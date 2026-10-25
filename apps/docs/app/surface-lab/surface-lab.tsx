'use client';

import { useState } from 'react';
import { Surface, TactileProvider, createTheme, resolveSurfaceRecipe } from '@tactile-ui/react';
import type { SurfaceOptions, SurfacePreset, SurfaceState } from '@tactile-ui/react';

function Arrow() {
  return (
    <span className="study-arrow" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M8 24 24 8M8 8h16v16"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
function ReferenceStudy({ options }: { options: SurfaceOptions }) {
  return (
    <div
      className="reference-studies"
      aria-label="Surface reconstruction, non-interactive material study"
    >
      <Surface {...options} preset="polished" className="resume-study">
        Download Resume
        <Arrow />
      </Surface>
      <Surface {...options} preset="porcelain" className="about-study">
        More About Me
      </Surface>
    </div>
  );
}
export function SurfaceLab() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [preset, setPreset] = useState<SurfacePreset>('polished');
  const [state, setState] = useState<SurfaceState>('rest');
  const [depth, setDepth] = useState(1);
  const [radius, setRadius] = useState(9999);
  const [comparison, setComparison] = useState<'stack' | 'overlay'>('stack');
  const [opacity, setOpacity] = useState(50);
  const theme = createTheme({ mode });
  const options = { preset, state, depth, radius };
  const recipe = resolveSurfaceRecipe(theme, options);
  function reset() {
    setPreset('polished');
    setState('rest');
    setDepth(1);
    setRadius(9999);
    setComparison('stack');
    setOpacity(50);
  }
  return (
    <TactileProvider theme={theme} className="docs-shell lab-shell">
      <a className="skip-link" href="#lab-main">
        Skip to content
      </a>
      <header className="masthead">
        <a className="wordmark" href="/">
          tactile<span> / ui</span>
        </a>
        <nav className="lab-nav" aria-label="Documentation">
          <a href="/">Foundations</a>
          <a href="/surface-lab" aria-current="page">
            Surface Lab
          </a>
          <a href="/button-lab">Buttons</a>
        </nav>
        <button
          className="theme-switch"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          aria-pressed={mode === 'dark'}
        >
          Dark theme <span>{mode === 'dark' ? 'On' : 'Off'}</span>
        </button>
      </header>
      <main id="lab-main" tabIndex={-1} className="lab-main">
        <div className="lab-intro">
          <h1>Surfaces with substance.</h1>
          <p className="lede">Tune the light, edge, and weight. One recipe, two rendering paths.</p>
          <p>
            Phase 2 material studies. These shapes are visual containers; interaction and the
            production Button come later.
          </p>
        </div>
        <div className="lab-workbench">
          <div className="lab-controls">
            <h2>Surface Lab</h2>
            <label htmlFor="surface-material">
              Material
              <select
                id="surface-material"
                value={preset}
                onChange={(e) => setPreset(e.target.value as SurfacePreset)}
              >
                <option value="polished">Polished · charcoal</option>
                <option value="porcelain">Porcelain · white</option>
              </select>
            </label>
            <label htmlFor="surface-state">
              Visual state
              <select
                id="surface-state"
                value={state}
                onChange={(e) => setState(e.target.value as SurfaceState)}
              >
                {(['rest', 'hovered', 'pressed', 'disabled'] as const).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label htmlFor="surface-depth">
              Depth <output aria-hidden="true">{depth.toFixed(2)}×</output>
              <input
                id="surface-depth"
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
              />
            </label>
            <label htmlFor="surface-radius">
              Radius <output aria-hidden="true">{radius === 9999 ? 'Pill' : `${radius}px`}</output>
              <input
                id="surface-radius"
                aria-valuetext={radius === 9999 ? 'Pill' : `${radius} pixels`}
                type="range"
                min="0"
                max="50"
                value={radius === 9999 ? 50 : radius}
                onChange={(e) =>
                  setRadius(Number(e.target.value) === 50 ? 9999 : Number(e.target.value))
                }
              />
            </label>
            <button className="theme-switch" onClick={reset}>
              Reset calibration
            </button>
          </div>
          <div className="material-stage">
            <div className="stage-label">
              <span>Live material</span>
              <span>
                {preset} / {state}
              </span>
            </div>
            <div className="specimen-space">
              <Surface {...options} className="live-specimen">
                A tactile surface
              </Surface>
            </div>
            <p>Static state preview · no click action</p>
          </div>
        </div>
        <section className="comparison-section" aria-labelledby="comparison-title">
          <div className="section-heading">
            <div>
              <h2 id="comparison-title">Against the original.</h2>
              <p>Original, previous, and refined surfaces on the same white canvas.</p>
            </div>
            <label htmlFor="surface-comparison">
              Comparison
              <select
                id="surface-comparison"
                value={comparison}
                onChange={(e) => setComparison(e.target.value as 'stack' | 'overlay')}
              >
                <option value="stack">Stacked</option>
                <option value="overlay">Overlay</option>
              </select>
            </label>
          </div>
          <p className="aside-text">
            The refined study uses the current state, depth, and radius on both materials. The
            previous capture stays at rest, depth 1, and pill radius. The material selector changes
            only the live specimen. The warm arrow medallion is a lab-only decoration.
          </p>
          {comparison === 'overlay' && (
            <label className="overlay-control" htmlFor="reference-opacity">
              Reference opacity <output aria-hidden="true">{opacity}%</output>
              <input
                id="reference-opacity"
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
              />
            </label>
          )}
          <div className={`comparison-board ${comparison}`}>
            <div className="comparison-caption">
              {comparison === 'stack' ? 'Original reference' : 'Overlay · reference over CSS'}
            </div>
            <div
              className="comparison-frame reference-frame"
              style={comparison === 'overlay' ? { opacity: opacity / 100 } : undefined}
            >
              {/* The original image is intentionally unoptimized for pixel comparison. */}
              <img
                src="/references/primary-button-reference.png"
                width="916"
                height="166"
                alt="Original reference: charcoal Download Resume pill with warm arrow medallion and white More About Me pill"
              />
            </div>
            {comparison === 'stack' && (
              <>
                <div className="comparison-caption">Previous implementation · Phase 2 baseline</div>
                <div className="comparison-frame previous-frame">
                  <img
                    src="/references/surface-phase-2-baseline.png"
                    width="916"
                    height="166"
                    alt="Previous Phase 2 web surfaces at rest, depth 1, pill radius"
                  />
                </div>
                <div className="comparison-caption reconstruction-caption">
                  Refined implementation · {state}
                </div>
              </>
            )}
            <div className="comparison-frame reconstruction-frame">
              <ReferenceStudy options={options} />
            </div>
          </div>
        </section>
        <section aria-labelledby="geometry-title">
          <h2 id="geometry-title">Across dimensions.</h2>
          <p>
            Small, medium, large, and custom-width containers. Current state, depth, and radius
            apply.
          </p>
          <div className="geometry-studies">
            {(['polished', 'porcelain'] as const).map((material) => (
              <div key={material} className="geometry-material" aria-label={`${material} geometry`}>
                {[
                  { name: 'Small', width: 160, height: 40 },
                  { name: 'Medium', width: 240, height: 56 },
                  { name: 'Large', width: 320, height: 80 },
                  { name: 'Custom width', width: 400, height: 56 },
                ].map(({ name, width, height }) => (
                  <div key={name} className="geometry-sample">
                    <span>
                      {name} · {width} × {height}
                    </span>
                    <Surface
                      {...options}
                      preset={material}
                      className="geometry-surface"
                      style={{ width, height }}
                    >
                      {name}
                    </Surface>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="recipe-title">
          <h2 id="recipe-title">The recipe underneath.</h2>
          <p>
            Platform-neutral values become CSS gradients and inset shadows on web, or clipped native
            view layers and platform shadows in React Native.
          </p>
          <div className="recipe-columns">
            <pre aria-label="Surface usage">
              <code>{`<Surface
  preset="${preset}"
  state="${state}"
  depth={${depth}}
  radius={${radius}}
>
  Your content
</Surface>`}</code>
            </pre>
            <pre aria-label="Resolved surface recipe">
              <code>{JSON.stringify(recipe, null, 2)}</code>
            </pre>
          </div>
          <p className="aside-text">
            Material colors stay fixed in light and dark themes to retain the reference identity.
            Native fill bands, rim layers, and OS shadows approximate CSS; there is no claim of
            pixel parity. Fonts, the arrow treatment, and source-image antialiasing also limit exact
            fidelity.
          </p>
        </section>
        <footer>
          Phase 2 · Surface engine. <a href="/">Return to foundations</a>
        </footer>
      </main>
    </TactileProvider>
  );
}
