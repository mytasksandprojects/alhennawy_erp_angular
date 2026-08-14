import { inject } from '@angular/core';
import { I18nService } from '../core/config/i18n.service';

/**
 * Base for every component that renders text.
 * `t`, `fmtNum`, `fmtDate`, `fmtTime` read signals from the runtime
 * config store, so all templates re-render automatically when the
 * language or translations change.
 */
export abstract class Translated {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly fmtNum = this.i18n.formatNumber;
  protected readonly fmtDate = this.i18n.formatDate;
  protected readonly fmtTime = this.i18n.formatTime;
}
