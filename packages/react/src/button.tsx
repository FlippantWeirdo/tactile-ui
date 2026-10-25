import { forwardRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { buttonSizes } from '@tactile-ui/tokens';
import type { ButtonSize } from '@tactile-ui/tokens';
import type { SurfacePreset } from '@tactile-ui/theme';
import { Surface } from './surface';
import { useTactileTheme } from './provider';
import './button.css';

export type ButtonVariant = SurfacePreset;
export type { ButtonSize } from '@tactile-ui/tokens';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Localize the live loading announcement. The original button name is retained. */
  loadingLabel?: string;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/** Semantic HTML host inside the public Surface: no material rendering is duplicated. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'polished',
    size = 'md',
    disabled = false,
    loading = false,
    loadingLabel = 'Loading',
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    children,
    type = 'button',
    style,
    className,
    onClick,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onKeyDown,
    onKeyUp,
    onBlur,
    ...props
  },
  ref,
) {
  const theme = useTactileTheme();
  const metrics = buttonSizes[size];
  const blocked = disabled || loading;
  const [interaction, setInteraction] = useState({ hovered: false, pressed: false, blocked });
  // Reset a canceled gesture before rendering again after controlled availability changes.
  if (interaction.blocked !== blocked) {
    setInteraction({ hovered: false, pressed: false, blocked });
  }
  const { hovered, pressed } = interaction;
  const setHovered = (hovered: boolean) => setInteraction((previous) => ({ ...previous, hovered }));
  const setPressed = (pressed: boolean) => setInteraction((previous) => ({ ...previous, pressed }));
  const state = disabled
    ? 'disabled'
    : blocked
      ? 'rest'
      : pressed
        ? 'pressed'
        : hovered
          ? 'hovered'
          : 'rest';
  const variables = {
    '--tactile-button-focus': theme.colors.focus,
    '--tactile-button-focus-width': `${theme.accessibility.focusRing}px`,
    '--tactile-button-focus-offset': `${theme.accessibility.focusOffset}px`,
    '--tactile-button-duration': `${theme.motion.duration.quick}ms`,
    '--tactile-button-easing': `cubic-bezier(${theme.motion.easing.join(',')})`,
  } as CSSProperties;
  return (
    <Surface
      preset={variant}
      state={state}
      className="tactile-button-surface"
      style={{
        ...variables,
        display: 'inline-grid',
        verticalAlign: 'middle',
        maxWidth: '100%',
        minWidth: 0,
        ...(fullWidth ? { width: '100%' } : {}),
      }}
    >
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={blocked}
        aria-busy={loading || undefined}
        data-tactile-button={variant}
        data-button-size={size}
        data-loading={loading || undefined}
        className={['tactile-button', className].filter(Boolean).join(' ')}
        style={{
          appearance: 'none',
          border: 0,
          borderRadius: 'inherit',
          background: 'transparent',
          color: 'inherit',
          fontFamily: 'inherit',
          fontWeight: theme.typography.weight.medium,
          fontSize: `${metrics.fontSize / 16}rem`,
          lineHeight: theme.typography.lineHeight.tight,
          minHeight: metrics.minHeight,
          minWidth: theme.accessibility.minTouchTarget,
          width: '100%',
          padding: `${theme.space[2]}px ${metrics.paddingX}px`,
          position: 'relative',
          cursor: blocked ? 'default' : 'pointer',
          touchAction: 'manipulation',
          ...style,
        }}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        onPointerEnter={(event) => {
          if (!blocked && event.pointerType !== 'touch') setHovered(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          setHovered(false);
          setPressed(false);
          onPointerLeave?.(event);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!blocked && !event.defaultPrevented && event.button === 0) {
            setPressed(true);
          }
        }}
        onPointerUp={(event) => {
          setPressed(false);
          onPointerUp?.(event);
        }}
        onPointerCancel={(event) => {
          setPressed(false);
          onPointerCancel?.(event);
        }}
        onLostPointerCapture={(event) => {
          setPressed(false);
          onLostPointerCapture?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!blocked && !event.defaultPrevented && (event.key === ' ' || event.key === 'Enter'))
            setPressed(true);
        }}
        onKeyUp={(event) => {
          setPressed(false);
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          setPressed(false);
          onBlur?.(event);
        }}
      >
        <span
          className="tactile-button-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: metrics.gap,
            opacity: loading ? 0 : 1,
          }}
        >
          {leadingIcon != null && (
            <span
              data-tactile-icon="leading"
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: metrics.icon,
                minWidth: metrics.icon,
              }}
            >
              {leadingIcon}
            </span>
          )}
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{children}</span>
          {trailingIcon != null && (
            <span
              data-tactile-icon="trailing"
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: metrics.icon,
                minWidth: metrics.icon,
              }}
            >
              {trailingIcon}
            </span>
          )}
        </span>
        {loading && (
          <span
            aria-hidden="true"
            className="tactile-button-spinner"
            style={{ width: metrics.icon, height: metrics.icon }}
          />
        )}
      </button>
      <span role="status" aria-live="polite" className="tactile-button-status">
        {loading ? loadingLabel : ''}
      </span>
    </Surface>
  );
});
