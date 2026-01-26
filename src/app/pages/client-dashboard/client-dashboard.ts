import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Client, Service } from '../../services/client/client';
import { Header } from '../../shared/components/header/header';
import { Address, Auth } from '../../services/auth/auth';
import { DecimalPipe } from '@angular/common';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { ServiceRequestModal } from "./components/service-request-modal/service-request-modal";

@Component({
  selector: 'app-client-dashboard',
  imports: [Header, DecimalPipe, ButtonGreen, ServiceRequestModal],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard implements OnInit {
  constructor(private clientService: Client, private cdr: ChangeDetectorRef, private authService: Auth) { }

  allServices: Service[] = [];
  activeServices: Service[] = [];
  completedServices: Service[] = [];
  activeServiceCount: number = 0;
  pendingServiceCount: number = 0;
  inProgressServiceCount: number = 0;
  completedServiceCount: number = 0;
  isLoadingPage: boolean = true;
  activeTab: 'active' | 'completed' | 'all' = 'active';
  serviceDate: string = '';
  serviceTime: string = '';
  dataDesejada: string = new Date().toISOString();

  requestServiceModalOpen: boolean = false;

  address: Address | null = null;

  ngOnInit() {
    this.address = this.authService.getUserAddress();

    this.getClientServices();
  }

  setActiveTab(tab: 'active' | 'completed' | 'all') {
    this.activeTab = tab;
  }


  getClientServices() {
    this.isLoadingPage = true;
    this.clientService
      .getClientServices()
      .pipe(delay(100))
      .subscribe({
        next: (services) => {
          this.allServices = services;
          this.activeServices = services.filter(s => s.status === 'in_progress'
            || s.status === 'pending' || s.status === 'accepted'
            || s.status === 'waiting_payment' || s.status === 'scheduled');
          this.completedServices = services.filter(s => s.status === 'completed' || s.status === 'provider_finished' || s.status === 'rejected' || s.status === 'cancelled');
          this.pendingServiceCount = services.filter(s => s.status === 'pending').length;
          this.inProgressServiceCount = services.filter(s => s.status === 'in_progress').length;
          this.completedServiceCount = services.filter(s => s.status === 'completed' || s.status === 'provider_finished' || s.status === 'rejected' || s.status === 'cancelled').length;
          if (services.length > 0 && services[0].dataDesejada) {
            const date = new Date(services[0].dataDesejada);
            this.serviceDate = date.toLocaleDateString('pt-BR');
            this.serviceTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }

          this.isLoadingPage = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.isLoadingPage = false;
          this.cdr.detectChanges();
        },
      });
  }

  solicitarServico() {
    this.requestServiceModalOpen = true;
  }
}
