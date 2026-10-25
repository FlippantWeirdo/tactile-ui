import { forwardRef } from 'react';
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ViewProps, ViewStyle, ViewInstance } from 'react-native';
import { resolveSurfaceRecipe, surfaceFillBands } from '@tactile-ui/theme';
import type { SurfaceOptions, SurfaceRecipe } from '@tactile-ui/theme';
import { useTactileTheme } from './provider';

export interface NativeSurfaceStyles {
  outer: ViewStyle;
  ambient: ViewStyle;
  face: ViewStyle;
}
export function surfaceToNativeStyles(
  recipe: SurfaceRecipe,
  platform: 'ios' | 'android',
): NativeSurfaceStyles {
  const shadow = (index: number): ViewStyle => {
    const layer = recipe.shadows[index]!;
    return platform === 'android'
      ? index === 0
        ? { elevation: recipe.elevation }
        : {}
      : {
          shadowColor: recipe.shadowColor,
          shadowOffset: { width: 0, height: layer.offsetY },
          shadowOpacity: layer.opacity,
          shadowRadius: layer.blur / 2,
        };
  };
  return {
    outer: {
      borderRadius: recipe.radius,
      backgroundColor: recipe.fill.middle,
      opacity: recipe.opacity,
      transform: [{ translateY: recipe.translateY }],
      ...shadow(0),
    } satisfies ViewStyle,
    ambient: {
      flexGrow: 1,
      borderRadius: recipe.radius,
      backgroundColor: recipe.fill.middle,
      ...shadow(1),
    } satisfies ViewStyle,
    face: {
      flexGrow: 1,
      borderRadius: recipe.radius,
      backgroundColor: recipe.fill.middle,
      borderWidth: 1.5,
      borderColor: recipe.edge,
      overflow: 'hidden',
    } satisfies ViewStyle,
  };
}
export interface SurfaceProps extends ViewProps, SurfaceOptions {}

/** Native View layers only. Children own their text color; Surface creates no interaction. */
export const Surface: ForwardRefExoticComponent<
  PropsWithoutRef<SurfaceProps> & RefAttributes<ViewInstance>
> = forwardRef<ViewInstance, SurfaceProps>(function Surface(
  { preset, state, radius, depth, style, children, ...props },
  ref,
) {
  const theme = useTactileTheme();
  const recipe = resolveSurfaceRecipe(theme, {
    ...(preset !== undefined ? { preset } : {}),
    ...(state !== undefined ? { state } : {}),
    ...(radius !== undefined ? { radius } : {}),
    ...(depth !== undefined ? { depth } : {}),
  });
  const layers = surfaceToNativeStyles(recipe, Platform.OS === 'android' ? 'android' : 'ios');
  return (
    <View {...props} ref={ref} style={[layers.outer, style]}>
      <View style={layers.ambient}>
        <View style={layers.face}>
          <View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={StyleSheet.absoluteFill}
          >
            {surfaceFillBands(recipe).map((color, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(index / 24) * 100}%`,
                  height: `${100 / 24 + 0.15}%`,
                  backgroundColor: color,
                }}
              />
            ))}
            <View
              style={{
                ...StyleSheet.absoluteFill,
                borderRadius: recipe.radius,
                borderTopWidth: 1.5,
                borderTopColor: recipe.highlight,
                borderBottomWidth: recipe.lip,
                borderBottomColor: recipe.shade,
              }}
            />
          </View>
          {children}
        </View>
      </View>
    </View>
  );
});
