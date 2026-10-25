// @vitest-environment jsdom
import { createRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const control = vi.hoisted(() => ({
  reduced: vi.fn<() => Promise<boolean>>(),
  listener: undefined as undefined | ((value: boolean) => void),
  remove: vi.fn(),
  timing: vi.fn(),
  stop: vi.fn(),
  setValue: vi.fn(),
}));
vi.mock('react-native', async () => {
  const { createElement, forwardRef, useState } = await import('react');
  const View = forwardRef<HTMLDivElement, Record<string, unknown>>(function MockView(p, ref) {
    return createElement(
      'div',
      {
        ref,
        'data-testid': p.testID,
        'data-style': JSON.stringify(p.style),
        'data-hidden': p.accessibilityElementsHidden,
      },
      p.children as ReactNode,
    );
  });
  return {
    Platform: { OS: 'ios' },
    useColorScheme: () => 'light',
    StyleSheet: { absoluteFill: { position: 'absolute' } },
    View,
    Text: ({ children }: { children: ReactNode }) => createElement('span', null, children),
    ActivityIndicator: () => createElement('span', { 'data-testid': 'activity' }),
    AccessibilityInfo: {
      isReduceMotionEnabled: () => control.reduced(),
      addEventListener: (_event: string, listener: (value: boolean) => void) => {
        control.listener = listener;
        return { remove: control.remove };
      },
    },
    Animated: {
      View,
      Value: class {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
        setValue(value: number) {
          this.value = value;
          control.setValue(value);
        }
        stopAnimation() {
          control.stop();
        }
      },
      timing: (_value: unknown, config: unknown) => {
        control.timing(config);
        return { start: vi.fn(), stop: control.stop };
      },
    },
    Easing: { bezier: () => 'easing' },
    Pressable: forwardRef<HTMLButtonElement, Record<string, unknown>>(
      function MockPressable(p, ref) {
        const [pressed, setPressed] = useState(false);
        const interaction = { pressed };
        return createElement(
          'button',
          {
            ref,
            disabled: p.disabled,
            'aria-label': p.accessibilityLabel,
            'data-testid': p.testID,
            'data-state': JSON.stringify(p.accessibilityState),
            'data-role': p.accessibilityRole,
            'data-style': JSON.stringify(
              typeof p.style === 'function' ? p.style(interaction) : p.style,
            ),
            onClick: p.onPress,
            onFocus: p.onFocus,
            onBlur: p.onBlur,
            onMouseDown: () => {
              setPressed(true);
              if (typeof p.onPressIn === 'function') p.onPressIn({});
            },
            onMouseUp: () => {
              setPressed(false);
              if (typeof p.onPressOut === 'function') p.onPressOut({});
            },
          },
          typeof p.children === 'function' ? p.children(interaction) : (p.children as ReactNode),
        );
      },
    ),
  };
});
import { Button } from './button';
import { TactileProvider } from './provider';
import { createTheme, resolveSurfaceRecipe } from '@tactile-ui/theme';
const wrap = (child: ReactNode) => <TactileProvider preference="light">{child}</TactileProvider>;
beforeEach(() => {
  vi.clearAllMocks();
  control.reduced.mockResolvedValue(true);
  control.listener = undefined;
});
afterEach(cleanup);
describe('native Button (mocked hosts; not device validation)', () => {
  it.each(['polished', 'porcelain'] as const)(
    'renders %s with button role, forwarded ref, callback, and shared foreground',
    async (variant) => {
      const onPress = vi.fn();
      const ref = createRef<ComponentRef<typeof Button>>();
      await act(async () => {
        render(
          wrap(
            <Button ref={ref} testID="host" variant={variant} onPress={onPress}>
              Continue
            </Button>,
          ),
        );
      });
      const host = screen.getByTestId('host');
      expect(ref.current).toBe(host);
      expect(host.getAttribute('data-role')).toBe('button');
      fireEvent.click(host);
      expect(onPress).toHaveBeenCalledTimes(1);
    },
  );
  it.each([{ disabled: true }, { loading: true }])(
    'blocks native activation with %j',
    async (availability) => {
      const onPress = vi.fn();
      await act(async () => {
        render(
          wrap(
            <Button testID="host" {...availability} onPress={onPress}>
              Save
            </Button>,
          ),
        );
      });
      const host = screen.getByTestId('host');
      fireEvent.click(host);
      expect(onPress).not.toHaveBeenCalled();
      expect(JSON.parse(host.getAttribute('data-state')!).disabled).toBe(true);
    },
  );
  it('retains name/content, preserves unrelated accessibility state, and uses static loading for Reduce Motion', async () => {
    await act(async () => {
      render(
        wrap(
          <Button
            testID="host"
            loading
            accessibilityLabel="Save project"
            accessibilityState={{ expanded: true }}
            trailingIcon={<span>Decorative</span>}
          >
            Save
          </Button>,
        ),
      );
    });
    const host = screen.getByRole('button', { name: 'Save project' });
    expect(JSON.parse(host.getAttribute('data-state')!)).toEqual({
      expanded: true,
      disabled: true,
      busy: true,
    });
    expect(screen.getByText('Save')).toBeTruthy();
    expect(screen.queryByTestId('activity')).toBeNull();
    expect(screen.getByText('Decorative').closest('[data-hidden="true"]')).toBeTruthy();
  });
  it.each(['sm', 'md', 'lg'] as const)(
    'supports %s size and full width without swallowing consumer styles',
    async (size) => {
      await act(async () => {
        render(
          wrap(
            <Button
              testID="host"
              size={size}
              fullWidth
              style={({ pressed }) => ({ marginTop: pressed ? 3 : 12 })}
            >
              Action
            </Button>,
          ),
        );
      });
      const host = screen.getByTestId('host');
      expect(host.getAttribute('data-style')).toContain('"width":"100%"');
      expect(host.getAttribute('data-style')).toContain('"marginTop":12');
      fireEvent.mouseDown(host);
      expect(host.getAttribute('data-style')).toContain('"marginTop":3');
    },
  );
  it('uses built-in native translation and observes reduced motion changes with cleanup', async () => {
    control.reduced.mockResolvedValue(false);
    const { unmount } = await act(async () => render(wrap(<Button testID="host">Action</Button>)));
    fireEvent.mouseDown(screen.getByTestId('host'));
    expect(control.timing).toHaveBeenLastCalledWith(
      expect.objectContaining({ toValue: 2, useNativeDriver: true, duration: 120 }),
    );
    act(() => control.listener?.(true));
    expect(control.setValue).toHaveBeenLastCalledWith(2);
    fireEvent.mouseUp(screen.getByTestId('host'));
    expect(control.setValue).toHaveBeenLastCalledWith(0);
    unmount();
    expect(control.remove).toHaveBeenCalled();
  });
  it('does not replace a newer Reduce Motion event with a stale initial query', async () => {
    let finish!: (value: boolean) => void;
    control.reduced.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    await act(async () => {
      render(wrap(<Button loading>Saving</Button>));
    });
    act(() => control.listener?.(true));
    await act(async () => finish(false));
    expect(screen.queryByTestId('activity')).toBeNull();
  });
  it('uses native focus outline from the nearest theme without changing Surface materials', async () => {
    const theme = createTheme({ mode: 'dark', colors: { focus: '#a4d7b1' } });
    const { container } = await act(async () =>
      render(
        <TactileProvider theme={theme}>
          <Button testID="host" variant="porcelain">
            Focus
          </Button>
        </TactileProvider>,
      ),
    );
    fireEvent.focus(screen.getByTestId('host'));
    expect(container.innerHTML).toContain('outlineWidth');
    expect(container.innerHTML).toContain('#a4d7b1');
    expect(container.innerHTML).toContain(
      resolveSurfaceRecipe(theme, { preset: 'porcelain' }).fill.middle,
    );
  });
});
