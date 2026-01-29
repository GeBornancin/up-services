import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Nurse {
  id: string;
  email: string;
  providerType: string;
  phone?: string;
  firstName: string;
  lastName: string;
  bairro: string;
  cep: string;
  cidade: string;
  complemento?: string;
  estado: string;
  numero: string;
  rua: string;
  coren?: string; // Registro profissional
  specialties?: string[]; // Ex: ['UTI', 'Pediatria', 'Home Care']
  isAvailable: boolean;

}

export interface providerApprovalResponse {
  count: number;
  providers: Nurse[];
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProvidersToApprove() {
    return this.http.get<providerApprovalResponse>(`${this.API_URL}/admin/providers?verified=false&providerType=nurse`);
  }

  approveProvider(id: string) {
    return this.http.patch(`${this.API_URL}/admin/providers/${id}/verify`, {});
  }

  rejectProvider(id: string) {
    return this.http.patch(`${this.API_URL}/admin/providers/${id}/reject`, {});
  }
}
