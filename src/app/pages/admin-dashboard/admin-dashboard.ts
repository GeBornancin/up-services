import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Admin, Nurse, Transaction, TransactionDetails } from '../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { TransactionModal } from './components/transaction-modal/transaction-modal';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CreateServiceModal } from './components/create-service-modal/create-service-modal';
import { Services, ServiceType } from '../../services/services/services';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { ConfirmActionModal } from '../../shared/components/confirm-action-modal/confirm-action-modal';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Header, CommonModule, TransactionModal, ButtonGreen, CreateServiceModal, ConfirmActionModal],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  isLoadingPage: boolean = true;
  providersToApprove: Nurse[] = [];
  allTransactions: Transaction[] = [];
  pendingTransactions: Transaction[] = [];
  approvedTransactions: Transaction[] = []
  rejectedTransactions: Transaction[] = []
  refundedTransactions: Transaction[] = []
  activeTab: 'pending' | 'approved' | 'rejected' | 'refunded' = 'pending';

  transactionModalOpen: boolean = false;
  transactionDetails: TransactionDetails | null = null;

  allServices: ServiceType[] = [];

  createServiceModalOpen: boolean = false;

  confirmStatusModalOpen: boolean = false;
  pendingServiceId: string = '';
  pendingServiceStatus: boolean = false;

  constructor(private adminService: Admin, private servicesService: Services, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getProvidersToApprove();
    this.getAllTransactions();
    this.getAllServices();
  }

  getProvidersToApprove() {
    this.isLoadingPage = true;
    this.adminService.getProvidersToApprove().subscribe({
      next: (response) => {
        this.providersToApprove = response.providers
        console.log('Provedores:', this.providersToApprove);
        this.isLoadingPage = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar provedores:', error);
        this.isLoadingPage = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejectProvider(providerId: string) {
    this.adminService.rejectProvider(providerId).subscribe({
      next: () => {
        console.log(`Provedor com ID ${providerId} rejeitado com sucesso.`);
        this.providersToApprove = this.providersToApprove.filter(provider => provider.id !== providerId);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Erro ao rejeitar o provedor:`, error);
      }
    });
  }

  approveProvider(providerId: string) {
    this.adminService.approveProvider(providerId).subscribe({
      next: () => {
        console.log(`Provider with ID ${providerId} approved successfully.`);
        this.providersToApprove = this.providersToApprove.filter(provider => provider.id !== providerId);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Erro ao aprovar o provedor:`, error);
      }
    });
  }

  setActiveTab(tab: 'pending' | 'approved' | 'rejected' | 'refunded') {
    this.activeTab = tab;
  }

  getAllTransactions() {
    this.adminService.getAllTransactions().subscribe({
      next: (transactions) => {
        console.log('Transações:', transactions);
        this.allTransactions = transactions;
        this.pendingTransactions = transactions.filter(t => t.status === 'pending');
        this.approvedTransactions = transactions.filter(t => t.status === 'approved');
        this.rejectedTransactions = transactions.filter(t => t.status === 'rejected');
        this.refundedTransactions = transactions.filter(t => t.status === 'refunded');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar transações:', error);
      }
    });
  }

  openTransactionModal(transactionId: string, status: string) {
    this.transactionModalOpen = true;
    this.getTransactionDetails(transactionId);
  }

  getTransactionDetails(transactionId: string) {
    this.adminService.getTransactionDetails(transactionId).subscribe({
      next: (response) => {
        this.transactionDetails = response;
        console.log('Detalhes da transação:', this.transactionDetails);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar detalhes da transação:', error);
        this.cdr.detectChanges();
      }
    });
  }

  getAllServices() {
    this.servicesService.getAllServices().subscribe({
      next: (services) => {
        console.log('Serviços:', services);
        this.allServices = services;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar serviços:', error);
        this.cdr.detectChanges();
      }
    });
  }

  openConfirmStatusModal(serviceId: string, isActive: boolean) {
    this.pendingServiceId = serviceId;
    this.pendingServiceStatus = isActive;
    this.confirmStatusModalOpen = true;
  }

  confirmUpdateServiceStatus() {
    this.servicesService.updateServiceStatus(this.pendingServiceId, this.pendingServiceStatus).subscribe({
      next: () => {
        console.log(`Status do serviço com ID ${this.pendingServiceId} atualizado para ${this.pendingServiceStatus ? 'ativo' : 'inativo'}.`);
        const service = this.allServices.find(s => s.id === this.pendingServiceId);
        if (service) {
          service.ativo = this.pendingServiceStatus;
        }
        this.confirmStatusModalOpen = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Erro ao atualizar o status do serviço:`, error);
        this.confirmStatusModalOpen = false;
      }
    });
  }

  cancelUpdateServiceStatus() {
    this.confirmStatusModalOpen = false;
    // Força a atualização do checkbox para o estado original
    this.cdr.detectChanges();
  }
}
