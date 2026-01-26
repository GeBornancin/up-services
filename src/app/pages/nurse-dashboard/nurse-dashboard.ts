import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Nurse, NurseService } from '../../services/nurse/nurse';
import { delay } from 'rxjs';
import { ButtonGreen } from '../../shared/components/button-green/button-green';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [Header, CommonModule, ButtonGreen],
  templateUrl: './nurse-dashboard.html',
  styleUrl: './nurse-dashboard.css',
})
export class NurseDashboard implements OnInit {
  constructor(private nurseService: Nurse, private cdr: ChangeDetectorRef) { }
  isLoadingPage: boolean = true;
  availableServices: NurseService[] = [];
  activeServices: NurseService[] = [];
  scheduledServices: NurseService[] = [];
  completedServices: NurseService[] = [];
  allServices: NurseService[] = [];
  activeTab: 'active' | 'scheduled' | 'available' | 'all' = 'available';
  serviceDate: string = '';
  serviceTime: string = '';



  ngOnInit() {
    this.getNurseServices();
    this.getAvailableServices();
  }

  setActiveTab(tab: 'active' | 'scheduled' | 'available' | 'all') {
    this.activeTab = tab;
  }

  acceptService(serviceId: string) {
    console.log('Aceitando serviço:', serviceId);
    this.nurseService.acceptService(serviceId).subscribe({
      next: (response) => {
        console.log('Serviço aceito com sucesso:', response);
        // Atualiza as listas de serviços após aceitar
        this.getNurseServices();
        this.getAvailableServices();
      },
      error: (error) => {
        console.error('Erro ao aceitar serviço:', error);
      }
    });
  }


  getNurseServices() {
    this.nurseService
      .getNurseServices()
      .pipe(delay(100))
      .subscribe({
        next: (services) => {
          console.log('Serviços recebidos:', services);
          this.activeServices = services.filter(s => s.status === 'in_progress'
            || s.status === 'pending' || s.status === 'accepted'
            || s.status === 'waiting_payment' || s.status === 'scheduled');
          this.scheduledServices = services.filter(s => s.status === 'scheduled');
          this.completedServices = services.filter(s => s.status === 'completed');
          this.allServices = services;
          if (services.length > 0 && services[0].dataDesejada) {
            const date = new Date(services[0].dataDesejada);
            this.serviceDate = date.toLocaleDateString('pt-BR');
            this.serviceTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao obter serviços:', error);
          this.cdr.detectChanges();
        }
      });
  }

  getAvailableServices() {
    this.nurseService
      .getAvailableServices()
      .pipe(delay(100))
      .subscribe({
        next: (services) => {
          console.log('Serviços disponíveis recebidos:', services);
          this.isLoadingPage = false;
          this.availableServices = services;
          if (services.length > 0 && services[0].dataDesejada) {
            const date = new Date(services[0].dataDesejada);
            this.serviceDate = date.toLocaleDateString('pt-BR');
            this.serviceTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao obter serviços disponíveis:', error);
          this.isLoadingPage = false;
          this.cdr.detectChanges();

        }
      });
  }

}
