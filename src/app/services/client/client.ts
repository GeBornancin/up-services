import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Client {
  private readonly API_URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getActiveServices() {
    return this.http.get<Service[]>(`${this.API_URL}/services/active`);
  }
}
