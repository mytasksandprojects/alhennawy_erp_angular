import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Stroke-based 24×24 icon paths. Color always inherits `currentColor`. */
const PATHS: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  scale: 'M12 3v3m-7 0h14M5 6l-2.5 6a3.5 3.5 0 0 0 7 0L7 6m12 0-2.5 6a3.5 3.5 0 0 0 7 0L19 6M12 6v13m-4 2h8',
  cutter: 'M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7.5 7.5 20 20M7.5 16.5 20 4',
  warehouse: 'M3 9l9-5 9 5v11H3V9Zm4 11v-7h10v7M7 16h10',
  quality: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Zm-3 8 2.5 2.5L16 9',
  production: 'M4 20V9l6 4V9l6 4V4h4v16H4Z',
  flask: 'M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3M7.5 15h9',
  sales: 'M4 19V5m0 14h16M8 15l3-4 3 2 4-6',
  purchasing: 'M5 7h15l-1.5 8h-12L5 4H2m6 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  logistics: 'M2 16V6h11v10M13 9h5l3 4v3h-3M2 16h2m5 0h4m-9.5 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  finance: 'M4 21h16M6 18V10m4 8V6m4 12v-8m4 8V4',
  hr: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M17 8a3 3 0 1 1-2 5.2M15 20a6 6 0 0 1 6-5',
  administration: 'M12 3l8 4v2H4V7l8-4ZM5 9v8m4-8v8m6-8v8m4-8v8M3 21h18',
  money: 'M3 7h18v10H3V7Zm9 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 10h.01M18 14h.01',
  expense: 'M3 7h18v10H3V7Zm9 2v6m3-3H9',
  chart: 'M4 19V5m0 14h16M8 15v-3m4 3V8m4 7v-5',
  customers: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a6 6 0 0 1 12 0m1-6a6 6 0 0 1 7 6',
  bank: 'M3 9l9-6 9 6H3Zm2 0v9m4-9v9m6-9v9m4-9v9M3 18h18v3H3v-3Z',
  inbox: 'M4 4h16v16H4V4Zm0 11h5a3 3 0 0 0 6 0h5M12 7v5m0 0-2-2m2 2 2-2',
  outbox: 'M4 4h16v16H4V4Zm0 11h5a3 3 0 0 0 6 0h5M12 12V7m0 0-2 2m2-2 2 2',
  alert: 'M12 3 2 20h20L12 3Zm0 7v4m0 3h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  timer: 'M10 2h4m-2 4a8 8 0 1 0 8 8m-8-8v8l4-2m4-9 2 2',
  check: 'M4 12.5 9.5 18 20 6',
  close: 'M5 5l14 14M19 5 5 19',
  percent: 'M19 5 5 19M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  grade: 'M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19l1-5.8L3.5 9.2l5.9-.9L12 3Z',
  chemistry: 'M9 3h6M10 3v6l-6 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-6-9V3M7 15h10',
  certificate: 'M4 4h16v12H4V4Zm4 4h8m-8 4h5m3 8-2-2-2 2v-6h4v6Z',
  weight: 'M9 7a3 3 0 1 1 6 0M5 7h14l2 13H3L5 7Z',
  return: 'M20 7H7M10 3 6 7l4 4m-4 6h13',
  transfer: 'M4 8h13m0 0-3-3m3 3-3 3m6 5H7m0 0 3-3m-3 3 3 3',
  items: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  empty: 'M4 6h16v12H4V6Zm0 4h16M9 14h6',
  document: 'M6 2h9l4 4v16H6V2Zm9 0v4h4M9 12h6m-6 4h6',
  invoice: 'M6 2h12v20l-2-1.5L14 22l-2-1.5L10 22l-2-1.5L6 22V2Zm3 6h6m-6 4h6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  calendar: 'M4 5h16v16H4V5Zm0 5h16M8 3v4m8-4v4',
  fleet: 'M3 16V8h10v8M13 10h4l3 3v3h-2M3 16h2m6 0h4m-10.5 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  wrench: 'M14 6a4 4 0 0 1 5.7 3.6L17 12l-5-5 2.4-2.7A4 4 0 0 1 14 6ZM12 12l-7.5 7.5a1.4 1.4 0 0 0 2 2L14 14',
  fuel: 'M5 3h9v18H5V3Zm0 8h9m2-5 3 3v8a2 2 0 1 1-4 0v-4h-1',
  customs: 'M4 21V4h12l-2 4 2 4H4m0 9h16',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm5-1.5L21 21',
  logout: 'M15 4h5v16h-5M4 12h11m0 0-4-4m4 4-4 4',
  lang: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z',
  print: 'M7 8V3h10v5M7 8H4v9h3m10-9h3v9h-3M7 14h10v7H7v-7Z',
  user: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 10a8 8 0 0 1 16 0',
  menu: 'M4 6h16M4 12h16M4 18h16',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'eye-off': 'M4 4l16 16M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3.2 4M6.1 6.1A17.4 17.4 0 0 0 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2',
  shield: 'M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z',
  audit: 'M6 2h9l4 4v16H6V2Zm9 0v4h4M9 11h6m-6 4h6m-6-8h3',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4m12.8-12.8 1.4-1.4',
  moon: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.9-1.7L14 2h-4l-.5 2.6a8 8 0 0 0-2.9 1.7l-2.4-1-2 3.5 2 1.5A8 8 0 0 0 4 12c0 .6.1 1.1.2 1.7l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.9 1.7L10 22h4l.5-2.6a8 8 0 0 0 2.9-1.7l2.4 1 2-3.5-2-1.5c.1-.6.2-1.1.2-1.7Z',
  safety: 'M5 14a7 7 0 0 1 14 0v3H5v-3ZM3 17h18M12 4v3m-6 7v3m12-3v3',
  backup: 'M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  download: 'M12 3v12m0 0-4-4m4 4 4-4M4 20h16',
  upload: 'M12 16V4m0 0-4 4m4-4 4 4M4 20h16',
  clinic: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v8m-4-4h8',
};

@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="size()"
      [attr.height]="size()"
      aria-hidden="true"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: [':host { display: inline-flex; line-height: 0; }'],
})
export class UiIcon {
  readonly name = input.required<string>();
  readonly size = input(20);
  protected readonly path = computed(() => PATHS[this.name()] ?? PATHS['items']);
}
