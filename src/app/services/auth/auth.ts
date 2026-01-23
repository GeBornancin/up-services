import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  role: 'client' | 'nurse' | 'admin';
  firstName: string;
  lastName: string;
}

export interface Address {
  bairro: string;
  cep: string;
  cidade: string;
  complemento?: string;
  estado: string;
  numero: string;
  rua: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
  endereco: Address;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly ADDRESS_KEY = 'user_address';

  // Signal reativo para o usuário atual
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
        this.redirectByRole(response.user.role);
      })
    );
  }

  register(data: any) {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, data).pipe(
      tap((response) => {
        this.setSession(response);
        this.redirectByRole(response.user.role);
      })
    );
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(authResult.endereco));
    this.currentUser.set(authResult.user);
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  
  getUserAddress(): Address | null {
  const addressData = localStorage.getItem(this.ADDRESS_KEY);
  return addressData ? JSON.parse(addressData) : null;
}

  private redirectByRole(role: User['role']): void {
    const routes: Record<User['role'], string> = {
      client: '/client/dashboard',
      nurse: '/nurse/dashboard',
      admin: '/admin/dashboard',
    };

    this.router.navigate([routes[role]]);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }
}
