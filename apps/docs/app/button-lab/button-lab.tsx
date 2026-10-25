'use client';
import { useEffect, useState } from 'react';
import { Button, TactileProvider, createTheme } from '@tactile-ui/react';
import type { ButtonSize, ButtonVariant } from '@tactile-ui/react';
function Arrow({ download = false }: { download?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={download ? 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4' : 'M5 19 19 5M5 5h14v14'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function WarmAccent() {
  return (
    <span className="button-warm-accent">
      <Arrow />
    </span>
  );
}
export function ButtonLab() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [variant, setVariant] = useState<ButtonVariant>('polished');
  const [size, setSize] = useState<ButtonSize>('md');
  const [label, setLabel] = useState('Continue');
  const [placement, setPlacement] = useState('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [forest, setForest] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState('Copy usage');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submissions, setSubmissions] = useState(0);
  const [resets, setResets] = useState(0);
  useEffect(() => {
    if (!saving) return;
    const timer = window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [saving]);
  const theme = createTheme({
    mode,
    ...(forest
      ? {
          colors: {
            focus: mode === 'dark' ? '#a4d7b1' : '#286143',
            accent: mode === 'dark' ? '#a4d7b1' : '#286143',
          },
        }
      : {}),
  });
  const activate = () => setClicks((c) => c + 1);
  const usage = [
    "import { Button } from '@tactile-ui/react';",
    "import '@tactile-ui/react/styles.css';",
    '',
    ...(placement !== 'none'
      ? [
          'function Icon() {',
          `  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${placement === 'leading' ? 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4' : 'M5 19 19 5M5 5h14v14'}" stroke="currentColor" strokeWidth="1.8" /></svg>;`,
          '}',
          '',
        ]
      : []),
    'export default function Example() {',
    '  return (',
    `    <Button variant="${variant}" size="${size}"`,
    ...(disabled ? ['      disabled'] : []),
    ...(loading ? ['      loading'] : []),
    ...(fullWidth ? ['      fullWidth'] : []),
    ...(placement === 'leading'
      ? ['      leadingIcon={<Icon />}']
      : placement === 'trailing'
        ? ['      trailingIcon={<Icon />}']
        : []),
    "      onClick={() => console.log('Activated')}",
    '    >',
    `      {${JSON.stringify(label || 'Continue')}}`,
    '    </Button>',
    '  );',
    '}',
  ].join(String.fromCharCode(10));
  return (
    <TactileProvider theme={theme} className="docs-shell lab-shell button-lab-shell">
      <a className="skip-link" href="#button-main">
        Skip to content
      </a>
      <header className="masthead">
        <a className="wordmark" href="/">
          tactile<span> / ui</span>
        </a>
        <nav className="lab-nav" aria-label="Documentation">
          <a href="/">Foundations</a>
          <a href="/surface-lab">Surfaces</a>
          <a href="/button-lab" aria-current="page">
            Buttons
          </a>
        </nav>
        <button
          className="theme-switch"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          aria-pressed={mode === 'dark'}
        >
          Dark theme <span>{mode === 'dark' ? 'On' : 'Off'}</span>
        </button>
      </header>
      <main id="button-main" tabIndex={-1} className="lab-main">
        <div className="lab-intro">
          <h1>A satisfying next step.</h1>
          <p className="lede">The approved materials, made interactive.</p>
          <p>Press, hover, or use Tab, Enter, and Space. These buttons have real behavior.</p>
        </div>
        <div className="lab-workbench button-workbench">
          <div className="lab-controls">
            <h2>Button Lab</h2>
            <label htmlFor="button-variant">
              Variant
              <select
                id="button-variant"
                value={variant}
                onChange={(e) => setVariant(e.target.value as ButtonVariant)}
              >
                <option value="polished">Polished · charcoal</option>
                <option value="porcelain">Porcelain · white</option>
              </select>
            </label>
            <label htmlFor="button-size">
              Size
              <select
                id="button-size"
                value={size}
                onChange={(e) => setSize(e.target.value as ButtonSize)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
            <label htmlFor="button-label">
              Label
              <input id="button-label" value={label} onChange={(e) => setLabel(e.target.value)} />
            </label>
            <label htmlFor="button-icon">
              Icon
              <select
                id="button-icon"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
              >
                <option value="none">None</option>
                <option value="leading">Leading · download</option>
                <option value="trailing">Trailing · arrow</option>
              </select>
            </label>
            <div className="button-toggles">
              {[
                { label: 'Disabled', value: disabled, set: setDisabled },
                { label: 'Loading', value: loading, set: setLoading },
                { label: 'Full width', value: fullWidth, set: setFullWidth },
                { label: 'Forest focus', value: forest, set: setForest },
              ].map((s) => (
                <label key={s.label}>
                  <input
                    type="checkbox"
                    checked={s.value}
                    onChange={(e) => s.set(e.target.checked)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
          <div className="material-stage button-material-stage">
            <div className="stage-label">
              <span>Live button</span>
              <span>
                {variant} / {size}
              </span>
            </div>
            <div className="button-preview-space" data-testid="button-preview">
              <Button
                variant={variant}
                size={size}
                disabled={disabled}
                loading={loading}
                fullWidth={fullWidth}
                leadingIcon={placement === 'leading' ? <Arrow download /> : undefined}
                trailingIcon={placement === 'trailing' ? <Arrow /> : undefined}
                aria-label={label.trim() || 'Continue'}
                onClick={activate}
              >
                {label || 'Continue'}
              </Button>
            </div>
            <p role="status" aria-live="polite">
              {clicks === 0
                ? 'Ready when you are.'
                : `Activated ${clicks} ${clicks === 1 ? 'time' : 'times'}.`}
            </p>
          </div>
        </div>
        <section aria-labelledby="usage-title">
          <div className="section-heading">
            <h2 id="usage-title">Use this button.</h2>
            <button
              className="theme-switch"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(usage);
                  setCopied('Copied');
                } catch {
                  setCopied('Select and copy the code below');
                }
              }}
            >
              {copied}
            </button>
          </div>
          <pre aria-label="Button usage">
            <code>{usage}</code>
          </pre>
        </section>
        <section aria-labelledby="sizes-title">
          <h2 id="sizes-title">Two materials. Three sizes.</h2>
          <p>
            Shared spacing and a minimum 48px interactive target. Hold a button to feel the depth
            compress.
          </p>
          <div className="button-size-studies">
            {(['polished', 'porcelain'] as const).map((material) => (
              <div key={material} className="button-size-row" aria-label={`${material} sizes`}>
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <Button key={s} variant={material} size={s} onClick={activate}>
                    {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="states-title">
          <h2 id="states-title">A state for the moment.</h2>
          <p>Disabled buttons prevent activation. Loading keeps the label and geometry in place.</p>
          <div className="button-example-grid">
            {(['polished', 'porcelain'] as const).map((material) => (
              <div className="button-example-row" key={material}>
                <Button variant={material} disabled>
                  Unavailable
                </Button>
                <Button variant={material} loading>
                  Saving changes
                </Button>
                <Button variant={material} leadingIcon={<Arrow download />} onClick={activate}>
                  Download
                </Button>
                <Button variant={material} trailingIcon={<Arrow />} onClick={activate}>
                  Explore
                </Button>
              </div>
            ))}
          </div>
          <div className="button-save-demo">
            <Button
              loading={saving}
              onClick={() => {
                setSaving(true);
                setSaved(false);
              }}
            >
              Save changes
            </Button>
            <p role="status">
              {saving
                ? 'Saving…'
                : saved
                  ? 'Saved. Ready for another change.'
                  : 'Try a short simulated save.'}
            </p>
          </div>
          <div className="button-wide-demo">
            <Button variant="porcelain" fullWidth trailingIcon={<Arrow />} onClick={activate}>
              Continue to the next step
            </Button>
          </div>
        </section>
        <section aria-labelledby="focus-title">
          <h2 id="focus-title">Find your place.</h2>
          <p>
            Tab to the button below to see the focus outline. Enter and Space both activate it. The
            focus color follows your theme.
          </p>
          <Button variant="porcelain" onClick={activate}>
            Keyboard focus example
          </Button>
          <p className="aside-text">
            Reduced motion removes material transitions and spinner rotation while preserving static
            state feedback.
          </p>
        </section>
        <section aria-labelledby="composition-title">
          <h2 id="composition-title">An accent, when it belongs.</h2>
          <p>
            A trailing slot carries the warm arrow. The Button and Surface stay independent of the
            accent.
          </p>
          <div className="button-reference-scroll">
            <div className="button-reference-composition">
              <Button
                className="reference-resume-button"
                trailingIcon={<WarmAccent />}
                onClick={activate}
              >
                Download Resume
              </Button>
              <Button variant="porcelain" className="reference-about-button" onClick={activate}>
                More About Me
              </Button>
            </div>
          </div>
          <p className="aside-text">
            Reference-scale study · 916 × 166. Scroll horizontally on narrow screens.
          </p>
          <pre>
            <code>{`<Button trailingIcon={<WarmAccent />} onClick={downloadResume}>
  Download Resume
</Button>`}</code>
          </pre>
        </section>
        <section aria-labelledby="forms-title">
          <h2 id="forms-title">At home in a form.</h2>
          <p>
            Submit and reset use the browser’s native form behavior. Ordinary buttons default to
            type="button".
          </p>
          <form
            className="button-form-demo"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmissions((c) => c + 1);
            }}
            onReset={() => setResets((c) => c + 1)}
          >
            <label htmlFor="button-form-name">
              Project name
              <input id="button-form-name" name="project" defaultValue="Tactile UI" required />
            </label>
            <div className="button-form-actions">
              <Button type="submit">Submit form</Button>
              <Button type="reset" variant="porcelain">
                Reset form
              </Button>
            </div>
            <p role="status">
              Submissions: {submissions} · Resets: {resets}
            </p>
          </form>
        </section>
        <footer>
          Phase 3 · Button. <a href="/surface-lab">Return to Surface Lab</a>
        </footer>
      </main>
    </TactileProvider>
  );
}
