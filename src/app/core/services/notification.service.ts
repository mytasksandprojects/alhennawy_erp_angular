import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  messageKey: string;
  params?: (string | number)[];
  tone: 'success' | 'error' | 'info';
}

/** Signal-based toast bus. Messages carry translation keys only. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  private readonly toastsSignal = signal<ToastMessage[]>([]);

  readonly toasts = this.toastsSignal.asReadonly();

  success(messageKey: string, params?: (string | number)[]): void {
    this.push({ messageKey, params, tone: 'success' });
  }

  error(messageKey: string, params?: (string | number)[]): void {
    this.push({ messageKey, params, tone: 'error' });
  }

  info(messageKey: string, params?: (string | number)[]): void {
    this.push({ messageKey, params, tone: 'info' });
  }

  dismiss(id: number): void {
    this.toastsSignal.update((list) => list.filter((t) => t.id !== id));
  }

  private push(toast: Omit<ToastMessage, 'id'>): void {
    const id = ++this.counter;
    this.toastsSignal.update((list) => [...list, { ...toast, id }]);
    setTimeout(() => this.dismiss(id), 5000);
  }
}
