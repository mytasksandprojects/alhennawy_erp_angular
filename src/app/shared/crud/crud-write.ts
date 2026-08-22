import { ApiClientService } from '../../core/api/api-client.service';
import { NotificationService } from '../../core/services/notification.service';

type Row = Record<string, unknown>;
type Draft = Record<string, string | number | boolean>;

export function persistRow(
  api: ApiClientService,
  notifications: NotificationService,
  endpoint: string,
  id: string | null,
  draft: Draft,
  done: () => void,
  fail: () => void,
): void {
  const request = id
    ? api.put<Row>(`${endpoint}/${id}`, draft)
    : api.post<Row>(endpoint, draft);
  request.subscribe({
    next: () => {
      notifications.success(id ? 'common.updated' : 'common.created');
      done();
    },
    error: fail,
  });
}

export function deleteRow(
  api: ApiClientService,
  notifications: NotificationService,
  endpoint: string,
  id: string,
  done: () => void,
  fail: () => void,
): void {
  api.delete<Row>(`${endpoint}/${id}`).subscribe({
    next: () => {
      notifications.success('common.deleted');
      done();
    },
    error: fail,
  });
}
