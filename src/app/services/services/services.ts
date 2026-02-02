import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ServiceType {
  id: string;
  titulo: string;
  descricao: string;
  precoBase: number;
  ativo: boolean;
  criadoEm?: Date;
  atualizadoEm?: Date;
}


@Injectable({
  providedIn: 'root',
})
export class Services {

  private readonly API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }
  
  getAllServices() {
    return this.http.get<ServiceType[]>(`${this.API_URL}/services`);
  }

  getActiveServices() {
    return this.http.get<ServiceType[]>(`${this.API_URL}/services/active`);
  }

  updateServiceStatus(serviceId: string, isActive: boolean) {
    return this.http.patch(`${this.API_URL}/services/${serviceId}/toggle-status`, { ativo: isActive });
  }
}
