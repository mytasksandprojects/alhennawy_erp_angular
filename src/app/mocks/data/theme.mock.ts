import { ThemeConfig, ThemeMode } from '../../core/models/config.models';

/**
 * MOCK LAYER — simulates the theme API. Every color, size, border,
 * radius, font, blur and number the UI uses is defined HERE and applied
 * as CSS variables. Nothing visual is hardcoded in stylesheets.
 * Glassmorphism design: translucent surfaces + backdrop blur over a
 * soft brand gradient background. Light and dark palettes are both
 * served by the (mock) backend; dark reuses geometry and overrides colors.
 */
const LIGHT_TOKENS: Record<string, string> = {
    // Brand (derived from the Al Hennawy logo gradient)
    'color-primary': '#0e8f6f',
    'color-primary-strong': '#0a6b53',
    'color-primary-soft': 'rgba(14, 143, 111, 0.12)',
    'color-accent': '#1d7fc4',
    'color-accent-soft': 'rgba(29, 127, 196, 0.12)',
    'brand-gradient': 'linear-gradient(135deg, #1d7fc4 0%, #58c05f 100%)',
    'brand-gradient-hover': 'linear-gradient(135deg, #16669f 0%, #43a44d 100%)',

    // Page background — soft brand wash, cards stay readable
    'color-bg': '#e7f0ed',
    'bg-gradient':
      'radial-gradient(720px 380px at 88% 0%, rgba(88, 192, 95, 0.18), transparent 62%), radial-gradient(640px 420px at 4% 16%, rgba(29, 127, 196, 0.12), transparent 58%), linear-gradient(180deg, #f3f8f6 0%, #e7f0ed 100%)',

    // Glass surfaces — more opaque so content does not fight the background
    'color-surface': 'rgba(255, 255, 255, 0.86)',
    'color-surface-alt': 'rgba(255, 255, 255, 0.62)',
    'color-surface-solid': '#ffffff',
    // Logo renders in its true colors on a light plate; admins can switch
    // back to the flat white look by setting the filter to
    // brightness(0) invert(1) and the plate to transparent (Appearance).
    'color-logo-plate': 'rgba(255, 255, 255, 0.92)',
    'sidebar-logo-filter': 'none',
    'glass-blur': '28px',
    'glass-highlight': 'rgba(255, 255, 255, 0.72)',
    'color-border': 'rgba(21, 39, 46, 0.10)',
    'color-border-strong': 'rgba(21, 39, 46, 0.22)',

    // Text
    'color-text': '#132a31',
    'color-text-soft': '#52676f',
    'color-text-faint': '#87989f',
    'color-text-inverse': '#ffffff',

    // Status tones (badges, alerts, trends, switches)
    'color-success': '#128a43',
    'color-success-soft': 'rgba(18, 138, 67, 0.13)',
    'color-warning': '#c26a05',
    'color-warning-soft': 'rgba(217, 119, 6, 0.13)',
    'color-danger': '#d02323',
    'color-danger-soft': 'rgba(220, 38, 38, 0.12)',
    'color-info': '#1f5fd6',
    'color-info-soft': 'rgba(37, 99, 235, 0.12)',
    'color-neutral': '#5c6b78',
    'color-neutral-soft': 'rgba(100, 116, 139, 0.13)',

    // Shell — dark glass sidebar, light glass header
    'color-sidebar-bg': '#124038',
    'color-sidebar-text': '#b9d2cb',
    'color-sidebar-active-bg': 'rgba(46, 168, 138, 0.22)',
    'color-sidebar-active-text': '#ffffff',
    'color-header-bg': 'rgba(255, 255, 255, 0.55)',
    'color-focus-ring': '#2ea88a',
    'overlay-bg': 'rgba(9, 34, 29, 0.45)',

    // Typography
    'font-family':
      "'Segoe UI', 'Cairo', 'Tahoma', 'Helvetica Neue', Arial, sans-serif",
    'font-size-xs': '11px',
    'font-size-sm': '12.5px',
    'font-size-md': '14px',
    'font-size-lg': '16px',
    'font-size-xl': '20px',
    'font-size-xxl': '26px',
    'font-weight-normal': '400',
    'font-weight-medium': '600',
    'font-weight-bold': '700',

    // Geometry
    'radius-sm': '8px',
    'radius-md': '12px',
    'radius-lg': '18px',
    'radius-full': '999px',
    'border-width': '1px',
    'border-width-strong': '2px',

    // Spacing scale
    'space-xs': '4px',
    'space-sm': '8px',
    'space-md': '16px',
    'space-lg': '24px',
    'space-xl': '32px',

    // Layout numbers
    'sidebar-width': '272px',
    'sidebar-item-height': '52px',
    'sidebar-icon-plate': '36px',
    'color-sidebar-icon-bg': 'rgba(255, 255, 255, 0.08)',
    'header-height': '64px',
    'control-height': '42px',
    'table-row-height': '46px',
    'content-max-width': '1440px',
    'sidebar-logo-height': '120px',
    'login-logo-width': '220px',
    'topbar-logo-height': '44px',
    'card-padding': '20px',
    'chart-bar-height': '14px',
    'chart-column-height': '170px',
    'chart-column-width': '48px',
    'chart-donut-size': '180px',
    'chart-donut-stroke': '7px',
    'chart-color-1': '#0e8f6f',
    'chart-color-2': '#1d7fc4',
    'chart-color-3': '#d98a06',
    'chart-color-4': '#7c5cd6',
    'chart-color-5': '#d0483a',
    'chart-color-6': '#5c6b78',
    'switch-width': '46px',
    'switch-height': '26px',

    // Effects
    'shadow-sm': '0 2px 8px rgba(13, 43, 38, 0.07)',
    'shadow-md': '0 10px 30px rgba(13, 43, 38, 0.10)',
    'shadow-lg': '0 24px 60px rgba(13, 43, 38, 0.18)',
    'shadow-glow': '0 6px 22px rgba(14, 143, 111, 0.35)',
    'transition-fast': '160ms ease',
};

/** Dark palette — same geometry/typography, color tokens overridden. */
const DARK_TOKENS: Record<string, string> = {
  ...LIGHT_TOKENS,

  'color-primary': '#2ea88a',
  'color-primary-strong': '#3dc2a1',
  'color-primary-soft': 'rgba(46, 168, 138, 0.18)',
  'color-accent': '#4da3e0',
  'color-accent-soft': 'rgba(77, 163, 224, 0.18)',
  'brand-gradient': 'linear-gradient(135deg, #2478b8 0%, #45a94e 100%)',
  'brand-gradient-hover': 'linear-gradient(135deg, #2e8bd2 0%, #52bd5c 100%)',

  'color-bg': '#0c1614',
  'bg-gradient':
    'radial-gradient(720px 380px at 88% 0%, rgba(46, 168, 138, 0.14), transparent 62%), radial-gradient(640px 420px at 4% 16%, rgba(36, 120, 184, 0.12), transparent 58%), linear-gradient(180deg, #101d1a 0%, #0c1614 100%)',

  'color-surface': 'rgba(23, 37, 34, 0.88)',
  'color-surface-alt': 'rgba(29, 46, 42, 0.62)',
  'color-surface-solid': '#15211e',
  'glass-highlight': 'rgba(255, 255, 255, 0.08)',
  'color-border': 'rgba(233, 244, 240, 0.10)',
  'color-border-strong': 'rgba(233, 244, 240, 0.22)',

  'color-text': '#e4efeb',
  'color-text-soft': '#a7bcb5',
  'color-text-faint': '#748881',
  'color-text-inverse': '#ffffff',

  'color-success': '#38c172',
  'color-success-soft': 'rgba(56, 193, 114, 0.16)',
  'color-warning': '#e8963a',
  'color-warning-soft': 'rgba(232, 150, 58, 0.16)',
  'color-danger': '#f06060',
  'color-danger-soft': 'rgba(240, 96, 96, 0.15)',
  'color-info': '#6b9bf2',
  'color-info-soft': 'rgba(107, 155, 242, 0.15)',
  'color-neutral': '#93a5a0',
  'color-neutral-soft': 'rgba(147, 165, 160, 0.15)',

  'color-sidebar-bg': '#0a211c',
  'color-sidebar-text': '#9dbcb4',
  'color-sidebar-active-bg': 'rgba(46, 168, 138, 0.26)',
  'color-sidebar-active-text': '#ffffff',
  'color-sidebar-icon-bg': 'rgba(255, 255, 255, 0.06)',
  'color-header-bg': 'rgba(16, 29, 26, 0.65)',
  'color-focus-ring': '#3dc2a1',
  'overlay-bg': 'rgba(0, 0, 0, 0.6)',

  'chart-color-1': '#2ea88a',
  'chart-color-2': '#4da3e0',
  'chart-color-3': '#e8963a',
  'chart-color-4': '#9d82e8',
  'chart-color-5': '#f06060',
  'chart-color-6': '#93a5a0',

  'shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
  'shadow-md': '0 10px 30px rgba(0, 0, 0, 0.35)',
  'shadow-lg': '0 24px 60px rgba(0, 0, 0, 0.5)',
  'shadow-glow': '0 6px 22px rgba(46, 168, 138, 0.3)',
};

/** Default theme returned inside the bootstrap bundle. */
export const MOCK_THEME: ThemeConfig = {
  id: 'alhennawy-glass-light-v4',
  tokens: LIGHT_TOKENS,
};

/** Served by GET /config/theme/:mode — the toggle fetches from here. */
export const MOCK_THEMES: Record<ThemeMode, ThemeConfig> = {
  light: MOCK_THEME,
  dark: { id: 'alhennawy-glass-dark-v4', tokens: DARK_TOKENS },
};
