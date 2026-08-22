import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RuntimeConfigStore } from './core/config/runtime-config.store';
import { UiConfirm } from './shared/components/ui-confirm';

/**
 * Root component. Renders NOTHING until the API config bundle (settings,
 * theme, menu, translations) is fully loaded — an empty configuration
 * intentionally results in a white screen, per the business requirement
 * that every text/color/number comes from the API.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, UiConfirm],
  template: `
    @if (store.ready()) {
      <router-outlet />
      <ui-confirm />
    }
  `,
})
export class App {
  protected readonly store = inject(RuntimeConfigStore);
}
