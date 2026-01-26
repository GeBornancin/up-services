import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, ServiceType } from '../../../../services/client/client';
import { ButtonGreen } from '../../../../shared/components/button-green/button-green';
import { CustomInput } from '../../../../shared/components/custom-input/custom-input';
import { ErrorPopup } from '../../../../shared/components/error-popup/error-popup';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-service-request-modal',
  imports: [ReactiveFormsModule, ButtonGreen, CustomInput, ErrorPopup, DecimalPipe],
  templateUrl: './service-request-modal.html',
  styleUrl: './service-request-modal.css',
})
export class ServiceRequestModal implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  serviceRequestForm: FormGroup;
  isSubmitting = false;
  isLoadingServices = true;
  errorMessage = '';

  availableServices: ServiceType[] = [];
  selectedService: ServiceType | null = null;
  minPrice = 10;

  constructor(private fb: FormBuilder, private clientService: Client) {
    this.serviceRequestForm = this.fb.group({
      serviceId: ['', [Validators.required]],
      proposed_price: [null, [Validators.required, Validators.min(10), Validators.max(10000)]],
      description: ['', [Validators.maxLength(1000)]],
      notes: ['', [Validators.maxLength(500)]],
      desiredDate: [''],
    });
  }

  ngOnInit() {
    this.loadActiveServices();
  }

  loadActiveServices() {
    this.isLoadingServices = true;
    this.errorMessage = '';

    this.clientService.getActiveServices().subscribe({
      next: (services) => {
        this.availableServices = services;
        this.isLoadingServices = false;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços:', err);
        this.errorMessage = 'Erro ao carregar serviços disponíveis';
        this.isLoadingServices = false;
      },
    });
  }

  onServiceChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const serviceId = selectElement.value;
    
    this.selectedService = this.availableServices.find(s => s.id === serviceId) || null;
    
    if (this.selectedService) {
      this.minPrice = this.selectedService.precoBase;
      this.serviceRequestForm.get('proposed_price')?.setValidators([
        Validators.required,
        Validators.min(this.minPrice),
        Validators.max(10000)
      ]);
      this.serviceRequestForm.get('proposed_price')?.setValue(null);
      this.serviceRequestForm.get('proposed_price')?.updateValueAndValidity();
    }
  }

  get proposedPriceControl(): FormControl {
    return this.serviceRequestForm.get('proposed_price') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.serviceRequestForm.get('description') as FormControl;
  }

  get notesControl(): FormControl {
    return this.serviceRequestForm.get('notes') as FormControl;
  }

  get desiredDateControl(): FormControl {
    return this.serviceRequestForm.get('desiredDate') as FormControl;
  }

  clearError() {
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.serviceRequestForm.invalid) {
      this.serviceRequestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.serviceRequestForm.value;

    const payload: any = {
      serviceId: formValue.serviceId,
      proposed_price: formValue.proposed_price,
      providerType: 'nurse',
    };

    if (formValue.description?.trim()) {
      payload.description = formValue.description.trim();
    }

    if (formValue.notes?.trim()) {
      payload.notes = formValue.notes.trim();
    }

    if (formValue.desiredDate) {
      payload.desiredDate = new Date(formValue.desiredDate).toISOString();
    }

    this.clientService.createServiceRequest(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Erro ao criar solicitação:', err);
        this.errorMessage = err.error?.message?.[0] || 'Erro ao criar solicitação';
        this.isSubmitting = false;
      },
    });
  }
}
