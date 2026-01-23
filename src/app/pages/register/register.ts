import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiErrorResponse } from '../../interfaces/api-error';
import { Auth } from '../../services/auth/auth';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { ErrorPopup } from '../../shared/components/error-popup/error-popup';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CustomInput, ReactiveFormsModule, ButtonGreen, ErrorPopup, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  errorMessage: string | null = null;
  userType: 'client' | 'nurse' = 'client';
  formSubmitted = false;
  selectedSpecialties: string[] = [];

  availableSpecialties = [
    'Cardiologia',
    'UTI',
    'Pediatria',
    'Geriatria',
    'Oncologia',
    'Emergência',
    'Home Care',
    'Obstetrícia',
  ];

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    // Campos de cliente
    phoneNumber: new FormControl(''),
    cep: new FormControl(''),
    rua: new FormControl(''),
    numero: new FormControl(''),
    bairro: new FormControl(''),
    cidade: new FormControl(''),
    estado: new FormControl(''),
    complemento: new FormControl(''),
    // Campos de enfermeiro
    coren: new FormControl(''),
  });

  setUserType(type: 'client' | 'nurse') {
    this.userType = type;
    this.updateValidators();
  }

  updateValidators() {
    const clientFields = ['phoneNumber', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];
    const nurseFields = ['coren'];

    if (this.userType === 'client') {
      clientFields.forEach((field) => {
        this.registerForm.get(field)?.setValidators([Validators.required]);
        this.registerForm.get(field)?.updateValueAndValidity();
      });
      nurseFields.forEach((field) => {
        this.registerForm.get(field)?.clearValidators();
        this.registerForm.get(field)?.updateValueAndValidity();
      });
    } else {
      nurseFields.forEach((field) => {
        this.registerForm.get(field)?.setValidators([Validators.required]);
        this.registerForm.get(field)?.updateValueAndValidity();
      });
      clientFields.forEach((field) => {
        this.registerForm.get(field)?.clearValidators();
        this.registerForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  toggleSpecialty(specialty: string) {
    const index = this.selectedSpecialties.indexOf(specialty);
    if (index > -1) {
      this.selectedSpecialties.splice(index, 1);
    } else {
      this.selectedSpecialties.push(specialty);
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.userType === 'nurse' && this.selectedSpecialties.length === 0) {
      this.errorMessage = 'Selecione pelo menos uma especialidade';
      return;
    }

    if (this.registerForm.valid) {
      this.errorMessage = null;

      const baseData = {
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        role: this.userType,
      };

      let registerData: any;

      if (this.userType === 'client') {
        registerData = {
          ...baseData,
          phoneNumber: this.registerForm.value.phoneNumber,
          cep: this.registerForm.value.cep,
          rua: this.registerForm.value.rua,
          numero: this.registerForm.value.numero,
          bairro: this.registerForm.value.bairro,
          cidade: this.registerForm.value.cidade,
          estado: this.registerForm.value.estado,
          complemento: this.registerForm.value.complemento || '',
        };
      } else {
        registerData = {
          ...baseData,
          coren: this.registerForm.value.coren,
          specialties: this.selectedSpecialties,
          providerType: 'nurse',
          isVerified: false,
        };
      }

      this.authService.register(registerData).subscribe({
        next: () => {
          // Redirecionamento após cadastro bem-sucedido
        },
        error: (err: HttpErrorResponse) => {
          const backendError = err.error as ApiErrorResponse;

          if (err.status === 0) {
            this.errorMessage = 'Não foi possível conectar ao servidor.';
          } else if (backendError && backendError.message) {
            if (Array.isArray(backendError.message)) {
              this.errorMessage = backendError.message.join(', ');
            } else {
              this.errorMessage = backendError.message;
            }
          } else {
            this.errorMessage = 'Ocorreu um erro desconhecido.';
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (control?.hasError('email')) {
      return 'Digite um e-mail válido';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Deve ter no mínimo ${requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  getControl(name: string): FormControl {
    return this.registerForm.get(name) as FormControl;
  }

  ngOnInit() {
    this.updateValidators();
  }
}
