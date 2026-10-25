import { Children, forwardRef, useEffect, useState } from 'react';
import type { ReactNode, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { PressableProps, ViewInstance } from 'react-native';
import { buttonSizes } from '@tactile-ui/tokens';
import type { ButtonSize } from '@tactile-ui/tokens';
import { resolveSurfaceRecipe } from '@tactile-ui/theme';
import type { SurfacePreset, SurfaceState } from '@tactile-ui/theme';
import { Surface } from './surface';
import { useTactileTheme } from './provider';

export type ButtonVariant = SurfacePreset;
export type { ButtonSize } from '@tactile-ui/tokens';
export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
}
function useReducedMotion() {
  // Conservative until the asynchronous platform preference is known.
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      changed = true;
      if (active) setReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active && !changed) setReduced(value);
      })
      .catch(() => {
        /* Keep the conservative fallback. */
      });
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}
function ButtonFace({
  variant,
  size,
  state,
  loading,
  children,
  leadingIcon,
  trailingIcon,
  reduced,
  focused,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  state: SurfaceState;
  loading: boolean;
  children: ReactNode;
  leadingIcon: ReactNode;
  trailingIcon: ReactNode;
  reduced: boolean;
  focused: boolean;
}) {
  const theme = useTactileTheme();
  const recipe = resolveSurfaceRecipe(theme, { preset: variant, state });
  const metrics = buttonSizes[size];
  const [translation] = useState(() => new Animated.Value(recipe.translateY));
  useEffect(() => {
    if (reduced) {
      translation.stopAnimation();
      translation.setValue(recipe.translateY);
      return;
    }
    const animation = Animated.timing(translation, {
      toValue: recipe.translateY,
      duration: theme.motion.duration.quick,
      easing: Easing.bezier(...theme.motion.easing),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [recipe.translateY, reduced, translation, theme]);
  const iconStyle = {
    minWidth: metrics.icon,
    minHeight: metrics.icon,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as const;
  return (
    <Animated.View style={{ transform: [{ translateY: translation }] }}>
      <Surface
        preset={variant}
        state={state}
        style={{
          transform: [{ translateY: 0 }],
          ...(focused
            ? {
                outlineWidth: theme.accessibility.focusRing,
                outlineColor: theme.colors.focus,
                outlineOffset: theme.accessibility.focusOffset,
                outlineStyle: 'solid' as const,
              }
            : {}),
        }}
      >
        <View style={{ position: 'relative', minHeight: metrics.minHeight }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: metrics.gap,
              minHeight: metrics.minHeight,
              paddingVertical: theme.space[2],
              paddingHorizontal: metrics.paddingX,
              opacity: loading ? 0 : 1,
            }}
          >
            {leadingIcon != null && (
              <View
                accessible={false}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={iconStyle}
              >
                {leadingIcon}
              </View>
            )}
            <View style={{ flexShrink: 1 }}>
              {Children.map(children, (child) =>
                typeof child === 'string' || typeof child === 'number' ? (
                  <Text
                    style={{
                      color: recipe.foreground,
                      fontSize: metrics.fontSize,
                      fontWeight: theme.typography.weight.medium,
                      textAlign: 'center',
                    }}
                  >
                    {child}
                  </Text>
                ) : (
                  child
                ),
              )}
            </View>
            {trailingIcon != null && (
              <View
                accessible={false}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={iconStyle}
              >
                {trailingIcon}
              </View>
            )}
          </View>
          {loading && (
            <View
              pointerEvents="none"
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {reduced ? (
                <View
                  style={{
                    width: metrics.icon,
                    height: metrics.icon,
                    borderWidth: 2,
                    borderColor: recipe.foreground,
                    borderRightColor: 'transparent',
                    borderRadius: metrics.icon / 2,
                  }}
                />
              ) : (
                <ActivityIndicator color={recipe.foreground} size="small" />
              )}
            </View>
          )}
        </View>
      </Surface>
    </Animated.View>
  );
}
export const Button: ForwardRefExoticComponent<
  PropsWithoutRef<ButtonProps> & RefAttributes<ViewInstance>
> = forwardRef<ViewInstance, ButtonProps>(function Button(
  {
    variant = 'polished',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    children,
    style,
    accessibilityState,
    onPress,
    onLongPress,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const blocked = disabled || loading;
  return (
    <Pressable
      {...props}
      ref={ref}
      accessible
      accessibilityRole="button"
      disabled={blocked}
      accessibilityState={{ ...accessibilityState, disabled: blocked, busy: loading }}
      onPress={(event) => {
        if (!blocked) onPress?.(event);
      }}
      onLongPress={(event) => {
        if (!blocked) onLongPress?.(event);
      }}
      onHoverIn={(event) => {
        if (!blocked) setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={(interaction) => [
        {
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          minWidth: buttonSizes[size].minHeight,
          maxWidth: '100%',
          ...(fullWidth ? { width: '100%' as const } : {}),
        },
        typeof style === 'function' ? style(interaction) : style,
      ]}
    >
      {({ pressed }) => (
        <ButtonFace
          variant={variant}
          size={size}
          state={
            disabled
              ? 'disabled'
              : loading
                ? 'rest'
                : pressed
                  ? 'pressed'
                  : hovered
                    ? 'hovered'
                    : 'rest'
          }
          loading={loading}
          reduced={reduced}
          focused={focused && !disabled}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
        >
          {children}
        </ButtonFace>
      )}
    </Pressable>
  );
});
