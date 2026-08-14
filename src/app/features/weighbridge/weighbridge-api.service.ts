import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  WeighingCompleteRequest,
  WeighingCreateRequest,
  WeighingTicket,
} from '../../core/models/weighbridge.models';

/** Data access for الميزان — the only place weighbridge endpoints are called. */
@Injectable({ providedIn: 'root' })
export class WeighbridgeApiService {
  private readonly api = inject(ApiClientService);

  list(filters?: { type?: string; status?: string }): Observable<WeighingTicket[]> {
    return this.api.get<WeighingTicket[]>(API_ENDPOINTS.weighbridge.tickets, {
      type: filters?.type,
      status: filters?.status,
    });
  }

  create(request: WeighingCreateRequest): Observable<WeighingTicket> {
    return this.api.post<WeighingTicket>(
      API_ENDPOINTS.weighbridge.tickets,
      request,
    );
  }

  complete(request: WeighingCompleteRequest): Observable<WeighingTicket> {
    return this.api.post<WeighingTicket>(
      API_ENDPOINTS.weighbridge.complete,
      request,
    );
  }

  update(id: string, body: Partial<WeighingTicket>): Observable<WeighingTicket> {
    return this.api.put<WeighingTicket>(`${API_ENDPOINTS.weighbridge.tickets}/${id}`, body);
  }

  remove(id: string): Observable<WeighingTicket> {
    return this.api.delete<WeighingTicket>(`${API_ENDPOINTS.weighbridge.tickets}/${id}`);
  }
}
