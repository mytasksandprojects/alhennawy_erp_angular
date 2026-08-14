import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  CustomerSpec,
  CutterRoll,
  CutterRollCreateRequest,
} from '../../core/models/cutter.models';

/** Data access for المقص — rolls, specs and label print registration. */
@Injectable({ providedIn: 'root' })
export class CutterApiService {
  private readonly api = inject(ApiClientService);

  listRolls(grade?: string): Observable<CutterRoll[]> {
    return this.api.get<CutterRoll[]>(API_ENDPOINTS.cutter.rolls, { grade });
  }

  createRoll(request: CutterRollCreateRequest): Observable<CutterRoll> {
    return this.api.post<CutterRoll>(API_ENDPOINTS.cutter.rolls, request);
  }

  listSpecs(): Observable<CustomerSpec[]> {
    return this.api.get<CustomerSpec[]>(API_ENDPOINTS.cutter.specs);
  }

  /** Registering a print deducts the roll from the customer quantity (BRD). */
  registerPrint(rollId: string): Observable<CutterRoll> {
    return this.api.post<CutterRoll>(API_ENDPOINTS.cutter.print(rollId), {});
  }

  updateRoll(id: string, body: Partial<CutterRoll>): Observable<CutterRoll> {
    return this.api.put<CutterRoll>(`${API_ENDPOINTS.cutter.rolls}/${id}`, body);
  }

  removeRoll(id: string): Observable<CutterRoll> {
    return this.api.delete<CutterRoll>(`${API_ENDPOINTS.cutter.rolls}/${id}`);
  }
}
