import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Admin, Nurse, Transaction, TransactionDetails } from '../../services/admin/admin';
import { CommonModule } from '@angular/common';
import { TransactionModal } from './components/transaction-modal/transaction-modal';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CreateServiceModal } from './components/create-service-modal/create-service-modal';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Header, CommonModule, TransactionModal, ButtonGreen, CreateServiceModal],
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

  createServiceModalOpen: boolean = false;

  constructor(private adminService: Admin, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getProvidersToApprove();
    this.getAllTransactions();
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
}
