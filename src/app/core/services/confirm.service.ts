import { Injectable, signal } from '@angular/core';

/** App-wide confirm overlay. Hosted once on `app-root`. */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly open = signal(false);
  readonly titleKey = signal('common.save');
  readonly messageKey = signal('common.confirmSave');
  readonly actionKey = signal('common.save');
  readonly danger = signal(false);
  private resolve?: (ok: boolean) => void;

  askSave(): Promise<boolean> {
    return this.ask('common.save', 'common.confirmSave', 'common.save', false);
  }

  askDelete(): Promise<boolean> {
    return this.ask('common.delete', 'common.confirmDelete', 'common.delete', true);
  }

  answer(ok: boolean): void {
    this.open.set(false);
    this.resolve?.(ok);
    this.resolve = undefined;
  }

  private ask(
    titleKey: string,
    messageKey: string,
    actionKey: string,
    danger: boolean,
  ): Promise<boolean> {
    this.titleKey.set(titleKey);
    this.messageKey.set(messageKey);
    this.actionKey.set(actionKey);
    this.danger.set(danger);
    this.open.set(true);
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
}
