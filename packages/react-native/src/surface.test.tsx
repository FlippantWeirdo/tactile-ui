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
        onLayout?: unknown;
      }
    >(function MockView(props, ref) {
      return createElement(
        'div',
        {
          ref,
          'data-testid': props.testID,
          'data-style': JSON.stringify(props.style),
          'data-decorative': props.accessibilityElementsHidden ? 'true' : undefined,
          'data-on-layout': props.onLayout ? 'forwarded' : undefined,
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
  it.each(['polished', 'porcelain'] as const)(
    'preserves unclipped shadows and clipped face geometry for refined %s',
    (preset) => {
      for (const radius of [0, 16, 9999]) {
        const recipe = resolveSurfaceRecipe(createTheme(), { preset, radius });
        const layers = surfaceToNativeStyles(recipe, 'ios');
        expect(layers.outer.borderRadius).toBe(radius);
        expect(layers.ambient.borderRadius).toBe(radius);
        expect(layers.face.borderRadius).toBe(radius);
        expect(layers.outer).not.toHaveProperty('overflow');
        expect(layers.ambient).not.toHaveProperty('overflow');
        expect(layers.face.overflow).toBe('hidden');
        expect(layers.outer.shadowOpacity).toBe(recipe.shadows[0]!.opacity);
        expect(layers.ambient.shadowRadius).toBe(recipe.shadows[1]!.blur / 2);
      }
    },
  );
  it('keeps ambient shadows out of the sizing chain and forwards native layout callbacks', () => {
    const onLayout = vi.fn();
    render(
      <TactileProvider preference="light">
        <Surface testID="sized" onLayout={onLayout} style={{ height: 96 }}>
          Content
        </Surface>
      </TactileProvider>,
    );
    const host = screen.getByTestId('sized');
    const ambient = host.children[0]!;
    const face = host.children[1]!;
    expect(host.getAttribute('data-on-layout')).toBe('forwarded');
    expect(ambient.getAttribute('data-decorative')).toBe('true');
    expect(ambient.children.length).toBe(0);
    expect(ambient.getAttribute('data-style')).toContain('"position":"absolute"');
    expect(ambient.getAttribute('data-style')).not.toContain('flexGrow');
    expect(face.getAttribute('data-style')).toContain('"position":"absolute"');
    expect(face.getAttribute('data-style')).not.toContain('flexGrow');
    expect(face.getAttribute('data-decorative')).toBe('true');
    expect(face.textContent).toBe('');
    expect(host.children[2]!.textContent).toBe('Content');
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
    const decorationLayers = Array.from(container.querySelectorAll('[data-decorative="true"]'));
    const decoration = decorationLayers.find((layer) => layer.children.length > 0);
    expect(decoration?.children.length).toBe(25);
    expect(decoration?.textContent).toBe('');
    expect(screen.getByText('Native content').closest('[data-decorative]')).toBe(null);
  });
});
