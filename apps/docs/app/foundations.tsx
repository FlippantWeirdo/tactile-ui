'use client';

import { useState } from 'react';
import { TactileProvider, useTactileTheme } from '@tactile-ui/react';
import { createTheme } from '@tactile-ui/theme';
import type { ColorMode } from '@tactile-ui/theme';
import { tokens } from '@tactile-ui/tokens';

export function Foundations() {
  const [mode, setMode] = useState<ColorMode>('light');
  const [accent, setAccent] = useState<'clay' | 'forest'>('clay');
  const theme = createTheme({
    mode,
    ...(accent === 'forest'
      ? {
          colors: {
            accent: mode === 'dark' ? '#a4d7b1' : '#286143',
            onAccent: mode === 'dark' ? '#181c18' : '#ffffff',
            focus: mode === 'dark' ? '#a4d7b1' : '#286143',
          },
        }
      : {}),
  });
  return (
    <TactileProvider theme={theme} className="docs-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="masthead">
        <a className="wordmark" href="#main" aria-label="Tactile UI home">
          tactile<span> / ui</span>
        </a>
        <span className="phase">Phase 1 · Foundations</span>
        <button
          className="theme-switch"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          aria-pressed={mode === 'dark'}
        >
          Dark theme <span aria-hidden="true">{mode === 'dark' ? 'On' : 'Off'}</span>
        </button>
      </header>
      <div className="docs-layout">
        <nav className="sidebar" aria-label="Foundations">
          <p>Documentation</p>
          <a href="#main">Overview</a>
          <a href="/surface-lab">Surface Lab</a>
          <a href="#architecture">Architecture</a>
          <a href="#tokens">Design tokens</a>
          <a href="#themes">Themes</a>
          <a href="#development">Development</a>
          <div className="sidebar-note">
            A foundation for web
            <br />
            and React Native.
            <br />
            <span>Catalog comes next.</span>
          </div>
        </nav>
        <main id="main" tabIndex={-1}>
          <section className="intro" aria-labelledby="intro-title">
            <h1 id="intro-title">
              A shared language.
              <br />
              <em>A native touch.</em>
            </h1>
            <p className="lede">
              Design decisions travel across platforms. The interface belongs to the platform it
              runs on.
            </p>
            <p>
              Start with typed tokens, customizable themes, and separate React DOM and React Native
              foundations. This workspace establishes the architecture; the component catalog is
              still ahead.
            </p>
            <a className="text-link" href="#development">
              Start developing <span aria-hidden="true">→</span>
            </a>
          </section>
          <section id="architecture" aria-labelledby="architecture-title">
            <h2 id="architecture-title">Shared at the foundation.</h2>
            <p>One set of design decisions. Two rendering paths.</p>
            <div
              className="architecture-flow"
              aria-label="Tokens feed themes, which feed separate web and native adapters"
            >
              <div>
                <strong>Tokens</strong>
                <span>Color · space · depth · motion</span>
              </div>
              <div>
                <strong>Themes</strong>
                <span>Semantic roles &amp; overrides</span>
              </div>
              <div className="platforms">
                <div>
                  <strong>React DOM</strong>
                  <span>CSS variables · Next.js</span>
                </div>
                <div>
                  <strong>React Native</strong>
                  <span>Native styles · Expo</span>
                </div>
              </div>
            </div>
            <p className="aside-text">
              Native views first. Advanced rendering will live in separate, opt-in packages. The
              base packages have no Skia, SVG, animation, or haptics dependency.
            </p>
          </section>
          <TokenPreview />
          <section id="themes" aria-labelledby="themes-title">
            <h2 id="themes-title">Make it yours.</h2>
            <p>
              Semantic colors keep both platforms in step. Change an accent here, or switch the
              entire page between light and dark.
            </p>
            <fieldset className="accent-options">
              <legend>Accent palette</legend>
              <label>
                <input
                  type="radio"
                  name="accent"
                  value="clay"
                  checked={accent === 'clay'}
                  onChange={() => setAccent('clay')}
                />{' '}
                Clay
              </label>
              <label>
                <input
                  type="radio"
                  name="accent"
                  value="forest"
                  checked={accent === 'forest'}
                  onChange={() => setAccent('forest')}
                />{' '}
                Forest
              </label>
            </fieldset>
            <pre>
              <code>{`const theme = createTheme({
  mode: '${mode}',
  colors: { accent: '${theme.colors.accent}' },
});`}</code>
            </pre>
            <p className="aside-text">
              Custom palettes are your responsibility to contrast-check. The full example also pairs
              onAccent and focus with the selected accent.
            </p>
          </section>
          <section id="development" aria-labelledby="development-title">
            <h2 id="development-title">A place to build from.</h2>
            <p>
              From the workspace root, install dependencies and start either app. Package builds run
              before the app starts.
            </p>
            <pre>
              <code>{`pnpm install
pnpm dev:docs
# In another terminal
pnpm dev:native`}</code>
            </pre>
            <dl className="commands">
              <div>
                <dt>Quality checks</dt>
                <dd>
                  <code>pnpm check</code>
                </dd>
              </div>
              <div>
                <dt>Browser checks</dt>
                <dd>
                  <code>pnpm test:browser</code>
                </dd>
              </div>
              <div>
                <dt>Record a release</dt>
                <dd>
                  <code>pnpm changeset</code>
                </dd>
              </div>
            </dl>
          </section>
          <footer>
            Foundation only. <span>Tactile UI is a provisional name.</span>
          </footer>
        </main>
      </div>
    </TactileProvider>
  );
}
function TokenPreview() {
  const theme = useTactileTheme();
  const roles = ['canvas', 'surface', 'text', 'accent', 'border'] as const;
  return (
    <section id="tokens" aria-labelledby="tokens-title">
      <h2 id="tokens-title">Decisions you can see.</h2>
      <p>Platform-neutral values become CSS on the web and density-independent styles on native.</p>
      <div className="swatches">
        {roles.map((role) => (
          <div key={role}>
            <div className="swatch" style={{ backgroundColor: theme.colors[role] }} />
            <strong>{role}</strong>
            <code>{theme.colors[role]}</code>
          </div>
        ))}
      </div>
      <div className="spacing-scale" aria-label="Spacing scale in density-independent units">
        {([1, 2, 3, 4, 6, 8, 12, 16] as const).map((step) => (
          <div key={step}>
            <span style={{ height: tokens.space[step] }} />
            <code>{tokens.space[step]}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
