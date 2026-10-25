// @vitest-environment jsdom
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buttonSizes } from '@tactile-ui/tokens';
import { Button } from './button';
import { TactileProvider } from './provider';
import { createTheme } from '@tactile-ui/theme';
afterEach(cleanup);
const wrap = (child: React.ReactNode) => (
  <TactileProvider preference="light">{child}</TactileProvider>
);
describe('DOM Button', () => {
  it.each(['polished', 'porcelain'] as const)(
    'renders %s through Surface with native button semantics',
    (variant) => {
      const ref = createRef<HTMLButtonElement>();
      render(
        wrap(
          <Button ref={ref} variant={variant} name="action" value="continue">
            Continue
          </Button>,
        ),
      );
      const host = screen.getByRole('button', { name: 'Continue' });
      expect(ref.current).toBe(host);
      expect(host.tagName).toBe('BUTTON');
      expect(host.getAttribute('type')).toBe('button');
      expect(host.closest('[data-tactile-surface]')?.getAttribute('data-tactile-surface')).toBe(
        variant,
      );
      expect(host.getAttribute('name')).toBe('action');
      expect(host.getAttribute('value')).toBe('continue');
    },
  );
  it.each(['sm', 'md', 'lg'] as const)(
    'uses shared %s dimensions with accessible targets',
    (size) => {
      render(wrap(<Button size={size}>Action</Button>));
      const host = screen.getByRole('button');
      expect(host.style.minHeight).toBe(`${buttonSizes[size].minHeight}px`);
      expect(parseFloat(host.style.minHeight)).toBeGreaterThanOrEqual(48);
      expect(host.getAttribute('data-button-size')).toBe(size);
    },
  );
  it('forwards callbacks and composes icons without adding names or focus stops', () => {
    const click = vi.fn();
    render(
      wrap(
        <Button
          onClick={click}
          leadingIcon={
            <svg>
              <title>Leading decoration</title>
            </svg>
          }
          trailingIcon={<span>Trailing decoration</span>}
        >
          Go
        </Button>,
      ),
    );
    const host = screen.getByRole('button', { name: 'Go' });
    fireEvent.click(host);
    expect(click).toHaveBeenCalledTimes(1);
    expect(host.querySelectorAll('[data-tactile-icon][aria-hidden="true"]')).toHaveLength(2);
    expect(host.querySelectorAll('button, [tabindex]')).toHaveLength(0);
  });
  it.each([{ disabled: true }, { loading: true }])('blocks activation with %j', (availability) => {
    const click = vi.fn();
    render(
      wrap(
        <Button {...availability} onClick={click}>
          Save
        </Button>,
      ),
    );
    const host = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(host.disabled).toBe(true);
    fireEvent.click(host);
    expect(click).not.toHaveBeenCalled();
  });
  it('preserves loading name/content and announces localized status without disabled material opacity', () => {
    const { rerender } = render(wrap(<Button>Save changes</Button>));
    const host = screen.getByRole('button');
    const beforePadding = host.style.padding;
    rerender(
      wrap(
        <Button loading loadingLabel="Enregistrement">
          Save changes
        </Button>,
      ),
    );
    expect(screen.getByRole('button', { name: 'Save changes' })).toBe(host);
    expect(host.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('Enregistrement');
    expect(host.querySelector<HTMLElement>('.tactile-button-content')?.style.opacity).toBe('0');
    expect(host.style.padding).toBe(beforePadding);
    expect(host.closest('[data-tactile-surface]')?.getAttribute('data-surface-state')).toBe('rest');
    rerender(wrap(<Button>Save changes</Button>));
    expect(host.hasAttribute('aria-busy')).toBe(false);
    expect(screen.getByRole('status').textContent).toBe('');
  });
  it('maps hover, pointer, keyboard, cancellation, and blur into Surface states', () => {
    render(wrap(<Button>Action</Button>));
    const host = screen.getByRole('button');
    const surface = host.closest('[data-tactile-surface]')!;
    fireEvent.pointerEnter(host);
    expect(surface.getAttribute('data-surface-state')).toBe('hovered');
    fireEvent(host, new MouseEvent('pointerdown', { bubbles: true, button: 0 }));
    expect(surface.getAttribute('data-surface-state')).toBe('pressed');
    fireEvent.pointerCancel(host);
    expect(surface.getAttribute('data-surface-state')).toBe('hovered');
    fireEvent.pointerLeave(host);
    expect(surface.getAttribute('data-surface-state')).toBe('rest');
    fireEvent.keyDown(host, { key: ' ' });
    expect(surface.getAttribute('data-surface-state')).toBe('pressed');
    fireEvent.keyUp(host, { key: ' ' });
    expect(surface.getAttribute('data-surface-state')).toBe('rest');
    fireEvent.keyDown(host, { key: 'Enter' });
    fireEvent.blur(host);
    expect(surface.getAttribute('data-surface-state')).toBe('rest');
  });
  it('honors prevented key events and clears canceled press state after availability changes', () => {
    const { rerender } = render(
      wrap(<Button onKeyDown={(e) => e.preventDefault()}>Action</Button>),
    );
    const host = screen.getByRole('button');
    const surface = host.closest('[data-tactile-surface]')!;
    fireEvent.keyDown(host, { key: 'Enter' });
    expect(surface.getAttribute('data-surface-state')).toBe('rest');
    rerender(wrap(<Button>Action</Button>));
    fireEvent.keyDown(host, { key: ' ' });
    rerender(wrap(<Button disabled>Action</Button>));
    expect(surface.getAttribute('data-surface-state')).toBe('disabled');
    rerender(wrap(<Button>Action</Button>));
    expect(surface.getAttribute('data-surface-state')).toBe('rest');
  });
  it('forwards forms and reset types without emulating browser submission', () => {
    render(
      wrap(
        <>
          <Button type="submit" form="project">
            Submit
          </Button>
          <Button type="reset">Reset</Button>
        </>,
      ),
    );
    expect(screen.getByRole('button', { name: 'Submit' }).getAttribute('form')).toBe('project');
    expect(screen.getByRole('button', { name: 'Submit' }).getAttribute('type')).toBe('submit');
    expect(screen.getByRole('button', { name: 'Reset' }).getAttribute('type')).toBe('reset');
  });
  it('uses nearest theme focus/radius, full width, and host customization', () => {
    render(
      <TactileProvider
        theme={createTheme({ mode: 'dark', colors: { focus: '#a4d7b1' }, radius: { full: 30 } })}
      >
        <Button fullWidth className="consumer" style={{ fontSize: 21 }} aria-label="Custom">
          Long content
        </Button>
      </TactileProvider>,
    );
    const host = screen.getByRole('button', { name: 'Custom' });
    const surface = host.closest<HTMLElement>('[data-tactile-surface]')!;
    expect(surface.style.width).toBe('100%');
    expect(surface.style.borderRadius).toBe('30px');
    expect(surface.style.getPropertyValue('--tactile-button-focus')).toBe('#a4d7b1');
    expect(host.classList.contains('consumer')).toBe(true);
    expect(host.style.fontSize).toBe('21px');
  });
  it('has deterministic SSR and no interactive descendants inside its button', () => {
    const tree = wrap(<Button loading>Save</Button>);
    expect(renderToString(tree)).toBe(renderToString(tree));
    expect(renderToString(tree)).toContain('aria-busy="true"');
  });
});
