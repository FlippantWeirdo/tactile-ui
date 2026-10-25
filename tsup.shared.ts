import { defineConfig } from 'tsup';

export function libraryConfig(client = false) {
  return defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    external: ['react', 'react-dom', 'react-native', '@tactile-ui/tokens', '@tactile-ui/theme'],
    ...(client ? { banner: { js: '"use client";' } } : {}),
  });
}
