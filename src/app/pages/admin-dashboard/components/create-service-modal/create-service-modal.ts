import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Admin, TransactionDetails } from '../../../../services/admin/admin';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/custom-input/custom-input';
import { ButtonGreen } from '../../../../shared/components/button-green/button-green';

@Component({
  selector: 'app-create-service-modal',
  imports: [ReactiveFormsModule, CustomInput, ButtonGreen],
  templateUrl: './create-service-modal.html',
  styleUrl: './create-service-modal.css',
})
export class CreateServiceModal {

  constructor(private cdr: ChangeDetectorRef, private adminService: Admin) { }

  @Input() transactionDetails: TransactionDetails | null = null;
  @Output() closeModal = new EventEmitter<void>();

  isSubmitting: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  createServiceForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]),
    basePrice: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]),
    isActive: new FormControl(false),
  });

  getErrorMessage(controlName: string): string {
    const control = this.createServiceForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório.';
    }

    if (controlName === 'title' || controlName === 'description') {
      if (control?.hasError('minlength')) {
        return `O ${controlName === 'title' ? 'título' : 'descrição'} deve ter no mínimo ${control.errors?.['minlength'].requiredLength} caracteres.`;
      }
      if (control?.hasError('maxlength')) {
        return `O ${controlName === 'title' ? 'título' : 'descrição'} deve ter no máximo ${control.errors?.['maxlength'].requiredLength} caracteres.`;
      }
      if (control?.hasError('pattern')) {
        return `O ${controlName === 'title' ? 'título' : 'descrição'} contém caracteres inválidos.`;
      }
    }

    if (controlName === 'basePrice') {
      if (control?.hasError('min')) {
        return 'O preço base deve ser no mínimo 0.';
      }
      if (control?.hasError('max')) {
        return 'O preço base deve ser no máximo 10000.';
      }
    }

    return 'Campo inválido';
  }

  getControl(name: string): FormControl {
    return this.createServiceForm.get(name) as FormControl;
  }

  clearError() {
    this.errorMessage = '';
  }

  onSubmit() {
    // if(this.createServiceForm.valid) {
    //   this.isSubmitting = true;
    //   this.isLoading = true;
    //   const formValue = this.createServiceForm.value;
    //   this.adminService.createService({
    //     title: formValue.title!,
    //     description: formValue.description!,
    //     basePrice: Number(formValue.basePrice),
    //     isActive: formValue.isActive!,
    //   }).subscribe({
    //     next: () => {
    //       console.log('Serviço criado com sucesso.');
    //       this.isLoading = false;
    //       this.isSubmitting = false;
    //       this.cdr.detectChanges();
    //       this.closeModal.emit();
    //     },
    //     error: (error) => {
    //       console.error('Erro ao criar serviço:', error);
    //       this.isLoading = false;
    //       this.isSubmitting = false;
    //       this.cdr.detectChanges();
    //     }
    //   });
    // }

    if (this.createServiceForm.invalid) {
      this.createServiceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.createServiceForm.value;

    const payload: any = {
      title: formValue.title,
      description: formValue.description,
      basePrice: Number(formValue.basePrice),
      isActive: formValue.isActive,
    };

    if (formValue.title?.trim()) {
      payload.title = formValue.title.trim();
    }

    if (formValue.description?.trim()) {
      payload.description = formValue.description.trim();
    }

    if (formValue.basePrice) {
      payload.basePrice = Number(formValue.basePrice);
    }

    if (formValue.isActive) {
      payload.isActive = formValue.isActive;
    }

    this.adminService.createService(payload).subscribe({
      next: () => {
        console.log('Serviço criado com sucesso.');
        this.isSubmitting = false;
        this.closeModal.emit();
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Erro ao criar serviço:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao criar serviço. Por favor, tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }

}
