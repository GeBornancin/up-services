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

export interface Transaction {
  id: string;
  valor: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  taxaPlataforma: number;
  valorLiquido: number;
  linkPagamento: string;
  criadoEm: string;
}

export interface TransactionDetails extends Transaction {
  idPagamento?: string;
  idReembolso?: string;
  reembolsadoEm?: Date;
  motivoReembolso?: string;
  historicoStatus?: any[];
  retidoAte?: Date;
  liberado?: boolean;
  liberadoEm?: Date;
  serviceRequestId?: string;
  serviceRequest?: {
    id: string;
    status: string;
    descricao?: string;
  };
  provider?: {
    id: string;
    nome: string;
    email: string;
  };
  client?: {
    id: string;
    nome: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProvidersToApprove() {
    return this.http.get<providerApprovalResponse>(`${this.API_URL}/admin/providers?verified=null&providerType=nurse`);
  }

  approveProvider(id: string) {
    return this.http.patch(`${this.API_URL}/admin/providers/${id}/verify`, {});
  }

  rejectProvider(id: string) {
    return this.http.patch(`${this.API_URL}/admin/providers/${id}/reject`, {});
  }

  getAllTransactions() {
    return this.http.get<Transaction[]>(`${this.API_URL}/admin/transactions`);
  }

  getTransactionDetails(transactionId: string) {
    return this.http.get<TransactionDetails>(`${this.API_URL}/admin/transactions/${transactionId}`);
  }

  createService(data: { title: string; description: string; basePrice: number; isActive: boolean; }) {
    return this.http.post(`${this.API_URL}/services`, data);
  }
}
