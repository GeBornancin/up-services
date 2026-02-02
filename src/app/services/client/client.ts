import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


export interface ServiceRequest {
  id: string;
  status: string;
  descricao?: string;
  precoPropostoPorCliente: number;
  precoFinalAcordado?: number;
  dataDesejada?: Date;
  provider?: {
    baseRate?: number;
    descricao?: string;
    email: string;
    id: string;
    nome: string;
    telefone?: string;
  };
  criadoEm: Date;
  paid: boolean;
  pagoEm?: Date;
}

  @Injectable({
  providedIn: 'root',
})
export class Client {
  private readonly API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getClientServices() {
    return this.http.get<ServiceRequest[]>(`${this.API_URL}/service-requests`);
  }

  createServiceRequest(data: any) {
    return this.http.post(`${this.API_URL}/service-requests`, data);
  }

 
}
