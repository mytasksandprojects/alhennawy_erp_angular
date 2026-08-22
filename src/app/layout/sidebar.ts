import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RuntimeConfigStore } from '../core/config/runtime-config.store';
import { AuthService } from '../core/security/auth.service';
import { LayoutService } from './layout.service';
import { Translated } from '../shared/translated.base';
import { UiIcon } from '../shared/components/ui-icon';

/** Navigation driven by the API menu, filtered by user permissions. */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, UiIcon],
  template: `
    <aside class="sidebar" [class.sidebar--closed]="!layout.sidebarOpen()">
      <button
        type="button"
        class="sidebar__close"
        [attr.aria-label]="t('common.close')"
        (click)="layout.closeSidebar()"
      >
        <ui-icon name="close" [size]="18" />
      </button>
      <div class="sidebar__brand">
        <img
          class="sidebar__logo"
          [src]="logoUrl()"
          [alt]="t('company.name')"
        />
      </div>
      <nav class="sidebar__nav">
        @for (item of visibleMenu(); track item.id) {
          <a
            class="sidebar__link"
            [routerLink]="item.route"
            routerLinkActive="sidebar__link--active"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            (click)="layout.closeOnMobile()"
          >
            <span class="sidebar__link-icon">
              <ui-icon [name]="item.icon" [size]="20" />
            </span>
            <span class="sidebar__link-label">{{ t(item.labelKey) }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
})
export class Sidebar extends Translated {
  private readonly store = inject(RuntimeConfigStore);
  private readonly auth = inject(AuthService);
  protected readonly layout = inject(LayoutService);

  protected readonly logoUrl = computed(() => {
    const company = this.store.settings()?.company;
    return company?.sidebarLogoUrl || company?.logoUrl || '';
  });

  protected readonly visibleMenu = computed(() =>
    this.store.menu().filter((item) => this.auth.hasPermission(item.permission)),
  );
}
