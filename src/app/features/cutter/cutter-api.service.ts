import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { ApiResponse } from '../../core/models/common.models';
import {
  CustomerSpec,
  CutterRoll,
  CutterRollBatchCreateRequest,
  CutterRollCreateRequest,
} from '../../core/models/cutter.models';
import { ProductionOrder } from '../../core/models/quality.models';

/** Data access for المقص — rolls, specs and label print registration. */
@Injectable({ providedIn: 'root' })
export class CutterApiService {
  private readonly api = inject(ApiClientService);

  listRolls(grade?: string, page = 1, pageSize = 20): Observable<ApiResponse<CutterRoll[]>> {
    return this.api.getWithMeta<CutterRoll[]>(API_ENDPOINTS.cutter.rolls, { grade, page, pageSize });
  }

  createRoll(request: CutterRollCreateRequest): Observable<CutterRoll> {
    return this.api.post<CutterRoll>(API_ENDPOINTS.cutter.rolls, request);
  }

  /** Multi-roll registration — one main serial + a serial per sub-roll entry. */
  createRolls(request: CutterRollBatchCreateRequest): Observable<CutterRoll[]> {
    return this.api.post<CutterRoll[]>(API_ENDPOINTS.cutter.rollBatch, request);
  }

  /** Next serial the backend will assign — shown on the form before saving. */
  nextSerial(): Observable<{ serial: number }> {
    return this.api.get<{ serial: number }>(API_ENDPOINTS.cutter.nextSerial);
  }

  /** أوامر الإنتاج the new rolls are being cut for (multi-select source). */
  listProductionOrders(): Observable<ProductionOrder[]> {
    return this.api.get<ProductionOrder[]>(API_ENDPOINTS.production.orders, { pageSize: 200 });
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
