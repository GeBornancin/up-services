import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface NurseService {
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
  }; servico?: {
    id: string;
    titulo: string;
    precoBase: number;
  };
  cliente?: {
    id: string;
    nome: string;
    bairro?: string;
    cep?: string;
    cidade?: string;
    complemento?: string;
    email?: string;
    estado?: string;
    numero?: string;
    rua?: string;
    telefone?: string;
  };
  criadoEm: Date;
  paid: boolean;
  pagoEm?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Nurse {
  private readonly API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getNurseServices() {
    return this.http.get<NurseService[]>(`${this.API_URL}/service-requests/providers`);
  }

  getAvailableServices() {
    return this.http.get<NurseService[]>(`${this.API_URL}/service-requests/available`);
  }
}
