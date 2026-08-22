import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { AttendanceLocation, AttendancePolicy } from '../../core/models/access.models';
import { fileEntryHref, splitImageList } from '../../core/models/common.models';
import { AttendanceRecord, Employee } from '../../core/models/hr.models';
import { AuthService } from '../../core/security/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTable } from '../../shared/components/ui-table';
import { Translated } from '../../shared/translated.base';
import { ATTENDANCE_COLUMNS } from '../hr/hr.columns';

@Component({
  selector: 'app-checkin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiIcon, UiTable, UiBadge],
  template: `
    <ui-page-header titleKey="checkin.title" subtitleKey="checkin.subtitle" />
    <div class="checkin">
      <section class="ui-card checkin-hero">
        <div class="checkin-hero__who">
          @if (photoUrl()) {
            <img class="checkin-hero__photo" [src]="photoUrl()" [alt]="displayName()" />
          } @else {
            <div class="checkin-hero__photo checkin-hero__photo--empty">{{ initials() }}</div>
          }
          <div class="checkin-hero__id">
            <div class="checkin-hero__name">{{ displayName() }}</div>
            <p class="text-faint">{{ empCode() }} · {{ t(jobTitleKey()) }}</p>
            <p class="text-faint">{{ t('checkin.shift') }} · {{ shift() }}</p>
          </div>
        </div>
        <div class="checkin-hero__status">
          @if (!today()?.checkIn) {
            <ui-badge labelKey="checkin.noRecord" tone="neutral" />
          } @else if (!today()?.checkOut) {
            <ui-badge labelKey="checkin.stateIn" tone="info" />
          } @else {
            <ui-badge labelKey="checkin.stateDone" tone="success" />
          }
          <p class="text-faint">{{ t('checkin.todayStatus') }} · {{ fmtDate(todayDate) }}</p>
        </div>
      </section>
      <div class="checkin-metrics">
        <div class="checkin-metric">
          <div class="checkin-metric__value mono">{{ clock(today()?.checkIn) }}</div>
          <div class="checkin-metric__label">{{ t('hr.fields.checkIn') }}</div>
        </div>
        <div class="checkin-metric">
          <div class="checkin-metric__value mono">{{ clock(today()?.checkOut) }}</div>
          <div class="checkin-metric__label">{{ t('hr.fields.checkOut') }}</div>
        </div>
        <div class="checkin-metric">
          <div class="checkin-metric__value mono">{{ fmtNum(today()?.lateMinutes ?? 0) }}</div>
          <div class="checkin-metric__label">{{ t('hr.fields.late') }}</div>
        </div>
        <div class="checkin-metric">
          <div class="checkin-metric__value mono">{{ fmtNum(today()?.overtimeMinutes ?? 0) }}</div>
          <div class="checkin-metric__label">{{ t('hr.fields.overtime') }}</div>
        </div>
      </div>
      <div class="checkin-actions">
        <button
          type="button"
          class="ui-btn"
          [class.ui-btn--primary]="canIn()"
          [class.ui-btn--ghost]="!canIn()"
          [disabled]="!canIn()"
          (click)="punch('in')"
        >
          <ui-icon name="clock" [size]="22" />
          {{ t('checkin.punchIn') }}
        </button>
        <button
          type="button"
          class="ui-btn"
          [class.ui-btn--primary]="canOut()"
          [class.ui-btn--ghost]="!canOut()"
          [disabled]="!canOut()"
          (click)="punch('out')"
        >
          <ui-icon name="logout" [size]="22" />
          {{ t('checkin.punchOut') }}
        </button>
      </div>
      <section class="checkin-history">
        <h2 class="ui-card__title">{{ t('checkin.history') }}</h2>
        <ui-table [columns]="columns" [rows]="$any(mine())" />
      </section>
    </div>
  `,
})
export class CheckinPage extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly auth = inject(AuthService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly notifications = inject(NotificationService);
  protected readonly columns = ATTENDANCE_COLUMNS.filter(
    (col) => col.key !== 'employeeCode' && col.key !== 'employeeName',
  );
  private readonly employee = signal<Employee | null>(null);
  private readonly rows = signal<AttendanceRecord[]>([]);
  private readonly policy = signal<AttendancePolicy | null>(null);
  private readonly locations = signal<AttendanceLocation[]>([]);
  protected readonly todayDate = new Date().toISOString().slice(0, 10);

  protected readonly mine = computed(() =>
    this.rows()
      .filter((row) => row.employeeCode === this.employee()?.code)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
  protected readonly today = computed(
    () => this.mine().find((row) => row.date.slice(0, 10) === this.todayDate) ?? null,
  );
  protected readonly canIn = computed(() => !this.today()?.checkIn);
  protected readonly canOut = computed(() => !!this.today()?.checkIn && !this.today()?.checkOut);
  protected readonly displayName = computed(() => {
    const emp = this.employee();
    if (!emp) return '';
    return this.store.language() === 'en' && emp['name_en'] ? emp['name_en'] : emp.name;
  });
  protected readonly photoUrl = computed(() => {
    const raw = this.employee()?.photoUrl;
    const href = raw ? fileEntryHref(splitImageList(raw)[0] ?? '') : '';
    if (!href || this.isCompanyMark(href)) return '';
    return href;
  });
  protected readonly initials = computed(() => {
    const parts = this.displayName().trim().split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  });
  protected readonly empCode = computed(() => this.employee()?.code ?? '');
  protected readonly jobTitleKey = computed(() => this.employee()?.jobTitleKey ?? '');
  protected readonly shift = computed(() => {
    const emp = this.employee();
    return emp?.workStart && emp.workEnd ? emp.workStart + ' · ' + emp.workEnd : '';
  });

  constructor() {
    super();
    this.api.get<Employee[]>(API_ENDPOINTS.hr.employees).subscribe((list) => {
      const roleId = this.auth.user()?.roleId;
      this.employee.set(list.find((row) => row.roleId === roleId) ?? list[0] ?? null);
    });
    this.reload();
    this.api.get<AttendancePolicy>(API_ENDPOINTS.hr.attendancePolicy).subscribe((row) => this.policy.set(row));
    this.api.get<AttendanceLocation[]>(API_ENDPOINTS.hr.attendanceLocations).subscribe((rows) => this.locations.set(rows));
  }

  protected clock(value?: string): string {
    return value || this.t('checkin.awaitingTime');
  }

  protected punch(kind: 'in' | 'out'): void {
    const policy = this.policy();
    const employee = this.employee();
    if (!policy || !employee) return;
    const site = this.locations().find((row) => row.wifiSsid === policy.demoSsid);
    if (policy.wifiOnly && !site) {
      this.notifications.error('checkin.wifiBlocked');
      return;
    }
    if (policy.locationRequired && !site) {
      this.notifications.error('checkin.locationBlocked');
      return;
    }
    const now = new Date().toISOString().slice(11, 16);
    const current = this.today();
    const body: AttendanceRecord = current
      ? { ...current, checkOut: kind === 'out' ? now : current.checkOut }
      : {
          id: '',
          employeeCode: employee.code,
          employeeName: employee.name,
          date: this.todayDate,
          checkIn: kind === 'in' ? now : undefined,
          lateMinutes: this.late(employee.workStart ?? '08:00', now),
          overtimeMinutes: 0,
          deviceId: site?.wifiSsid ?? 'APP',
          statusKey: 'hr.attendance.present',
        };
    if (kind === 'out' && current?.checkIn) {
      body.overtimeMinutes = this.late(employee.workEnd ?? '16:00', now);
    }
    const request = current
      ? this.api.put<AttendanceRecord>(`${API_ENDPOINTS.hr.attendance}/${current.id}`, body)
      : this.api.post<AttendanceRecord>(API_ENDPOINTS.hr.attendance, body);
    request.subscribe(() => {
      this.notifications.success(kind === 'in' ? 'checkin.successIn' : 'checkin.successOut');
      this.reload();
    });
  }

  private late(start: string, actual: string): number {
    const [sh, sm] = start.split(':').map(Number);
    const [ah, am] = actual.split(':').map(Number);
    return Math.max(0, ah * 60 + am - (sh * 60 + sm));
  }

  private isCompanyMark(url: string): boolean {
    const clean = (value: string) => value.split('?')[0];
    const href = clean(url);
    const company = this.store.settings()?.company;
    return [company?.logoUrl, company?.sidebarLogoUrl]
      .filter(Boolean)
      .some((mark) => clean(String(mark)) === href);
  }

  private reload(): void {
    this.api.get<AttendanceRecord[]>(API_ENDPOINTS.hr.attendance).subscribe((rows) => this.rows.set(rows));
  }
}
