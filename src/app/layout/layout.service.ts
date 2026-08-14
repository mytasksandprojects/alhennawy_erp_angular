import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

const MOBILE_BREAKPOINT_PX = 960;

/**
 * Shell layout state. On phones the nav starts closed and slides in as a
 * drawer. On desktop it starts open and the hamburger still hides it.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly document = inject(DOCUMENT);
  private readonly mobile = signal(this.readMobile());

  readonly sidebarOpen = signal(!this.readMobile());
  readonly isMobile = this.mobile.asReadonly();

  constructor() {
    this.document.defaultView?.addEventListener('resize', () => this.onResize());
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /** Auto-close the drawer after navigating on small screens. */
  closeOnMobile(): void {
    if (this.mobile()) this.sidebarOpen.set(false);
  }

  private onResize(): void {
    const nowMobile = this.readMobile();
    const wasMobile = this.mobile();
    if (nowMobile === wasMobile) return;
    this.mobile.set(nowMobile);
    this.sidebarOpen.set(!nowMobile);
  }

  private readMobile(): boolean {
    const width = this.document.defaultView?.innerWidth ?? 1280;
    return width > 0 && width <= MOBILE_BREAKPOINT_PX;
  }
}
