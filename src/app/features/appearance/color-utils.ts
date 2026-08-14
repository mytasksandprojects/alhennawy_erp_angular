/** Parsing/building helpers for the theme token color and gradient pickers. */

export interface GradientSpec {
  kind: 'linear' | 'radial';
  angle: number;
  stops: string[];
}

const COLOR_TOKEN = /#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)/gi;

export function parseGradient(value: string): GradientSpec | null {
  const trimmed = value.trim();
  const kind = trimmed.startsWith('linear-gradient')
    ? 'linear'
    : trimmed.startsWith('radial-gradient')
      ? 'radial'
      : null;
  if (!kind) return null;
  const stops = trimmed.match(COLOR_TOKEN) ?? [];
  if (stops.length < 2) return null;
  const angle = Number(/(\d+)deg/.exec(trimmed)?.[1] ?? 135);
  return { kind, angle, stops };
}

/** Stops are distributed evenly from 0% to 100%. */
export function buildGradient(spec: GradientSpec): string {
  const step = 100 / Math.max(1, spec.stops.length - 1);
  const stops = spec.stops
    .map((color, i) => `${color} ${Math.round(i * step)}%`)
    .join(', ');
  return spec.kind === 'linear'
    ? `linear-gradient(${spec.angle}deg, ${stops})`
    : `radial-gradient(circle, ${stops})`;
}

/** Convert #rgb/#rrggbb/rgb()/rgba() to #rrggbb for `<input type=color>`. */
export function toHexColor(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(v)) {
    return '#' + [...v.slice(1)].map((c) => c + c).join('');
  }
  const hex = /^#([0-9a-f]{6})/.exec(v);
  if (hex) return '#' + hex[1];
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(v);
  if (rgb) {
    return (
      '#' +
      [rgb[1], rgb[2], rgb[3]]
        .map((n) => Number(n).toString(16).padStart(2, '0'))
        .join('')
    );
  }
  return null;
}

/** Opacity of an rgba() value; solid formats report 1. */
export function alphaOf(value: string): number {
  const match = /^rgba\([^)]*,\s*([\d.]+)\s*\)$/.exec(value.trim());
  return match ? Number(match[1]) : 1;
}

/** Re-apply the original opacity to a freshly picked hex color. */
export function hexToCss(hex: string, alpha: number): string {
  if (alpha >= 1) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
