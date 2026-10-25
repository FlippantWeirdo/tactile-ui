import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
mkdirSync('work', { recursive: true });
const destination = mkdtempSync(path.join(root, 'work/package-check-'));
const names = ['tokens', 'theme', 'react', 'react-native'];
const forbidden = /(?:skia|reanimated|react-native-svg|expo|three|lottie)/i;
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}
function targets(value) {
  if (typeof value === 'string') return [value];
  return Object.values(value).flatMap(targets);
}
try {
  for (const name of names) {
    const source = JSON.parse(
      readFileSync(path.join(root, 'packages', name, 'package.json'), 'utf8'),
    );
    run('pnpm', ['--filter', source.name, 'pack', '--pack-destination', destination]);
    const archive = `${source.name.replace('@', '').replace('/', '-')}-${source.version}.tgz`;
    assert.ok(archive, `Missing archive for ${name}`);
    const unpacked = path.join(destination, name);
    mkdirSync(unpacked);
    run('tar', ['-xzf', path.join(destination, archive), '-C', unpacked]);
    const packageRoot = path.join(unpacked, 'package');
    const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
    assert.equal(manifest.name, `@tactile-ui/${name}`);
    assert.ok(existsSync(path.join(packageRoot, 'README.md')), `${name}: README missing`);
    for (const target of [
      manifest.main,
      manifest.module,
      manifest.types,
      ...targets(manifest.exports),
    ]) {
      assert.ok(
        existsSync(path.join(packageRoot, target)),
        `${name}: missing packed export ${target}`,
      );
    }
    assert.ok(!existsSync(path.join(packageRoot, 'src')), `${name}: source leaked into package`);
    for (const [dependency, version] of Object.entries({
      ...manifest.dependencies,
      ...manifest.peerDependencies,
    })) {
      assert.ok(!forbidden.test(dependency), `${name}: advanced runtime or Expo dependency`);
      assert.ok(!version.startsWith('workspace:'), `${name}: unresolved workspace dependency`);
      assert.ok(
        !['@tactile-ui/react', '@tactile-ui/react-native'].includes(dependency),
        `${name}: platform adapter dependency`,
      );
    }
    if (['tokens', 'theme'].includes(name))
      assert.ok(!manifest.peerDependencies?.react, `${name}: React leaked into foundation`);
    if (name === 'react-native') {
      assert.equal(manifest['react-native'], './dist/index.js');
      assert.ok(
        !readFileSync(path.join(packageRoot, 'dist/index.js'), 'utf8').match(
          /react-dom|document\.|window\./,
        ),
      );
    }
    if (name === 'react') {
      const built = readFileSync(path.join(packageRoot, 'dist/index.js'), 'utf8');
      assert.ok(built.startsWith('"use client";'), 'React adapter lost the client boundary');
      assert.ok(!built.includes('react-native'), 'Native runtime leaked into web');
    }
    console.log(`✓ ${manifest.name}: packed exports, declarations, README, dependency boundaries`);
  }
  // Link only extracted archives to each other; no workspace source or dist directories.
  const modules = path.join(destination, 'node_modules');
  mkdirSync(path.join(modules, '@tactile-ui'), { recursive: true });
  for (const name of names)
    symlinkSync(
      path.join(destination, name, 'package'),
      path.join(modules, '@tactile-ui', name),
      'dir',
    );
  for (const name of ['react', 'react-dom'])
    symlinkSync(path.join(root, 'node_modules', name), path.join(modules, name), 'dir');
  // The platform-neutral package must work directly from its tarball, in both module systems.
  const tokenEntry = path.join(destination, 'tokens/package/dist/index.js');
  const esm = run(process.execPath, [
    '--input-type=module',
    '-e',
    `import { tokens } from ${JSON.stringify(tokenEntry)}; if (tokens.space[4] !== 16) process.exit(1);`,
  ]);
  assert.equal(esm.trim(), '');
  run(process.execPath, [
    '-e',
    `const {tokens} = require(${JSON.stringify(path.join(destination, 'tokens/package/dist/index.cjs'))}); if (tokens.space[4] !== 16) process.exit(1);`,
  ]);
  for (const format of ['esm', 'cjs']) {
    const source =
      format === 'esm'
        ? `import { createTheme, resolveSurfaceRecipe } from '@tactile-ui/theme'; import { TactileProvider, Surface } from '@tactile-ui/react'; import { createElement } from 'react'; import { renderToString } from 'react-dom/server';`
        : `const { createTheme, resolveSurfaceRecipe } = require('@tactile-ui/theme'); const { TactileProvider, Surface } = require('@tactile-ui/react'); const { createElement } = require('react'); const { renderToString } = require('react-dom/server');`;
    const check = `const theme = createTheme({mode:'dark'}); const html = renderToString(createElement(TactileProvider, {theme}, createElement(Surface, {preset:'porcelain'}, 'packed consumer'))); if (resolveSurfaceRecipe(theme).preset !== 'polished' || !html.includes('data-tactile-surface="porcelain"') || !html.includes('data-tactile-theme="dark"') || !html.includes('packed consumer')) process.exit(1);`;
    run(
      process.execPath,
      [...(format === 'esm' ? ['--input-type=module'] : []), '-e', source + check],
      destination,
    );
  }
  console.log('✓ Packed tokens, themes, and React SSR work as ESM and CommonJS');
} finally {
  rmSync(destination, { recursive: true, force: true });
}
