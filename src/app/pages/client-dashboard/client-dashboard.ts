import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Client, Service } from '../../services/client/client';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-client-dashboard',
  imports: [Header],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard implements OnInit {
  constructor(private clientService: Client, private cdr: ChangeDetectorRef) {}

  activeServices: Service[] = [];
  activeServiceCount: number = 0;
  isLoadingPage: boolean = true;

  ngOnInit() {
    this.getActiveServices();
  }

  getActiveServices() {
    this.isLoadingPage = true;
    this.clientService
      .getActiveServices()
      .pipe(delay(100))
      .subscribe({
        next: (services) => {
          this.activeServiceCount = services.length;
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
}
