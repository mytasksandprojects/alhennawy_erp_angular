import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from './layout.service';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { UiImageViewer } from '../shared/components/ui-image-viewer';
import { UiToasts } from '../shared/components/ui-toasts';

/** Authenticated layout: collapsible sidebar + topbar + content + toasts. */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar, Topbar, UiToasts, UiImageViewer],
  template: `
    <div class="shell" [class.shell--nav-closed]="!layout.sidebarOpen()">
      <app-sidebar />
      @if (layout.sidebarOpen() && layout.isMobile()) {
        <button
          type="button"
          class="sidebar-backdrop"
          (click)="layout.closeSidebar()"
        ></button>
      }
      <div class="shell__main">
        <app-topbar />
        <main class="shell__content">
          <router-outlet />
        </main>
      </div>
    </div>
    <ui-toasts />
    <ui-image-viewer />
  `,
})
export class Shell {
  protected readonly layout = inject(LayoutService);
}
