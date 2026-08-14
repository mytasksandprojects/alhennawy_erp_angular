import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { DemoAccount } from '../../core/models/config.models';
import { AuthService } from '../../core/security/auth.service';
import { Translated } from '../../shared/translated.base';
import { UiIcon } from '../../shared/components/ui-icon';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiIcon],
  template: `
    <div class="login-page">
      <form class="ui-card login-card" (ngSubmit)="submit()">
        <img class="login-card__logo" [src]="logoUrl()" [alt]="t('company.name')" />
        <h1 class="login-card__title">{{ t('auth.loginTitle') }}</h1>
        <p class="login-card__subtitle">{{ t('auth.loginSubtitle') }}</p>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('auth.username') }}</span>
          <input
            class="ui-control"
            name="username"
            autocomplete="username"
            required
            [(ngModel)]="username"
          />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('auth.password') }}</span>
          <span class="ui-input-group">
            <input
              class="ui-control"
              [type]="showPassword() ? 'text' : 'password'"
              name="password"
              autocomplete="current-password"
              required
              [(ngModel)]="password"
            />
            <button
              type="button"
              class="ui-input-group__action"
              [attr.aria-label]="
                t(showPassword() ? 'auth.hidePassword' : 'auth.showPassword')
              "
              (click)="showPassword.set(!showPassword())"
            >
              <ui-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="18" />
            </button>
          </span>
        </label>

        @if (error()) {
          <span class="ui-badge ui-badge--danger">
            {{ t('auth.invalidCredentials') }}
          </span>
        }

        <button class="ui-btn ui-btn--primary" type="submit" [disabled]="busy()">
          {{ t('auth.signIn') }}
        </button>

        @if (demoAccounts().length) {
          <div class="login-card__divider">
            <span>{{ t('auth.demoHint') }}</span>
          </div>
          <div class="login-card__demo">
            @for (account of demoAccounts(); track account.username) {
              <button
                type="button"
                class="demo-account"
                [disabled]="busy()"
                (click)="quickLogin(account)"
              >
                <span class="demo-account__avatar">
                  <ui-icon name="user" [size]="18" />
                </span>
                <span class="demo-account__text">
                  <span class="demo-account__label">{{ t(account.labelKey) }}</span>
                  <span class="demo-account__user mono">{{ account.username }}</span>
                </span>
              </button>
            }
          </div>
        }
      </form>
    </div>
  `,
})
export class LoginPage extends Translated {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RuntimeConfigStore);

  protected username = '';
  protected password = '';
  protected readonly busy = signal(false);
  protected readonly error = signal(false);
  protected readonly showPassword = signal(false);

  protected readonly logoUrl = computed(
    () => this.store.settings()?.company.logoUrl ?? '',
  );

  /** Delivered by the (mock) settings API; absent in production. */
  protected readonly demoAccounts = computed(
    () => this.store.settings()?.demoAccounts ?? [],
  );

  protected quickLogin(account: DemoAccount): void {
    this.username = account.username;
    this.password = account.password;
    void this.submit();
  }

  protected async submit(): Promise<void> {
    if (!this.username || !this.password || this.busy()) return;
    this.busy.set(true);
    this.error.set(false);
    try {
      await this.auth.login({ username: this.username, password: this.password });
      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      await this.router.navigateByUrl(returnUrl);
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
