import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ListQuery } from '../models/common.models';

/**
 * Thin typed wrapper over HttpClient.
 * All features talk to the backend exclusively through this client,
 * so swapping mock → real API requires zero feature changes.
 */
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  get<T>(path: string, query?: ListQuery): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.baseUrl + path, { params: this.toParams(query) })
      .pipe(map((res) => res.data));
  }

  getWithMeta<T>(path: string, query?: ListQuery): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.baseUrl + path, {
      params: this.toParams(query),
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(this.baseUrl + path, body)
      .pipe(map((res) => res.data));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(this.baseUrl + path, body)
      .pipe(map((res) => res.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(this.baseUrl + path)
      .pipe(map((res) => res.data));
  }

  private toParams(query?: ListQuery): HttpParams | undefined {
    if (!query) return undefined;
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}
