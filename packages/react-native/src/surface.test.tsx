// @vitest-environment jsdom
import { createRef } from 'react';
import type { ReactNode, ComponentRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTheme, resolveSurfaceRecipe } from '@tactile-ui/theme';

vi.mock('react-native', async () => {
  const { createElement, forwardRef } = await import('react');
  return {
    Platform: { OS: 'ios' },
    useColorScheme: () => 'light',
    StyleSheet: {
      absoluteFill: { position: 'absolute' },
      absoluteFillObject: { position: 'absolute' },
    },
    View: forwardRef<
      HTMLDivElement,
      {
        children?: ReactNode;
        style?: unknown;
        testID?: string;
        accessibilityElementsHidden?: boolean;
      }
    >(function MockView(props, ref) {
      return createElement(
        'div',
        {
          ref,
          'data-testid': props.testID,
          'data-style': JSON.stringify(props.style),
          'data-decorative': props.accessibilityElementsHidden ? 'true' : undefined,
        },
        props.children,
      );
    }),
  };
});
import { Surface, surfaceToNativeStyles } from './surface';
import { TactileProvider } from './provider';
afterEach(cleanup);
describe('native Surface adapter (mocked Views, not device rendering)', () => {
  it('maps two iOS shadows independently and selects Android elevation without iOS shadows', () => {
    const recipe = resolveSurfaceRecipe(createTheme(), { state: 'pressed', radius: 24 });
    const ios = surfaceToNativeStyles(recipe, 'ios');
    expect(ios.outer.shadowRadius).toBe(recipe.shadows[0]!.blur / 2);
    expect(ios.ambient.shadowOpacity).toBe(recipe.shadows[1]!.opacity);
    expect(ios.face.borderRadius).toBe(24);
    expect(ios.face.overflow).toBe('hidden');
    const android = surfaceToNativeStyles(recipe, 'android');
    expect(android.outer.elevation).toBe(recipe.elevation);
    expect(android.outer).not.toHaveProperty('shadowOpacity');
    expect(android.ambient).not.toHaveProperty('elevation');
  });
  it('keeps children outside hidden decoration layers and forwards ref and layout styles', () => {
    const ref = createRef<ComponentRef<typeof Surface>>();
    const { container } = render(
      <TactileProvider preference="light">
        <Surface ref={ref} testID="surface" preset="porcelain" style={{ margin: 12 }}>
          <span>Native content</span>
        </Surface>
      </TactileProvider>,
    );
    expect(ref.current).toBe(screen.getByTestId('surface'));
    expect(screen.getByTestId('surface').getAttribute('data-style')).toContain('"margin":12');
    const decoration = container.querySelector('[data-decorative="true"]');
    expect(decoration?.children.length).toBe(25);
    expect(decoration?.textContent).toBe('');
    expect(screen.getByText('Native content').closest('[data-decorative]')).toBe(null);
  });
});
