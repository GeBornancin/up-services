import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Admin, Nurse } from '../../services/admin/admin';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Header],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  isLoadingPage: boolean = true;
  providersToApprove: Nurse[] = [];

  constructor(private adminService: Admin, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getProvidersToApprove();
  }
  getProvidersToApprove() {
    this.isLoadingPage = true;
    this.adminService.getProvidersToApprove().subscribe({
      next: (response) => {
        this.providersToApprove = response.providers
        console.log('Providers:', this.providersToApprove);
        this.isLoadingPage = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching providers:', error);
        this.isLoadingPage = false;
        this.cdr.detectChanges();
      }
    });
  }
  rejectProvider(providerId: string) {
    this.adminService.rejectProvider(providerId).subscribe({
      next: () => {
        console.log(`Provider with ID ${providerId} rejected successfully.`);
        this.providersToApprove = this.providersToApprove.filter(provider => provider.id !== providerId);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Error rejecting provider with ID ${providerId}:`, error);
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
        console.error(`Error approving provider with ID ${providerId}:`, error);
      }
    });
  }

}
