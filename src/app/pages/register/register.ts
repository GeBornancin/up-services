import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiErrorResponse } from '../../interfaces/api-error';
import { Auth } from '../../services/auth/auth';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { ErrorPopup } from '../../shared/components/error-popup/error-popup';

// Interface para resposta da API ViaCEP
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CustomInput, ReactiveFormsModule, ButtonGreen, ErrorPopup, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  errorMessage: string | null = null;
  userType: 'client' | 'nurse' = 'client';
  formSubmitted = false;
  selectedSpecialties: string[] = [];
  isLoadingCep = false;

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

  // Validadores customizados
  private cepValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const cepClean = control.value.replace(/\D/g, '');
    return /^\d{8}$/.test(cepClean) ? null : { cepInvalido: true };
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const phoneClean = control.value.replace(/\D/g, '');
    return /^\d{10,11}$/.test(phoneClean) ? null : { telefoneInvalido: true };
  }

  private corenValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^\d{6,10}$/.test(control.value) ? null : { corenInvalido: true };
  }

  private estadoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return /^[A-Za-z]{2}$/.test(control.value) ? null : { estadoInvalido: true };
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
    confirmPassword: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    // Campos de cliente
    phoneNumber: new FormControl(''),
    cep: new FormControl(''),
    rua: new FormControl('', [Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.maxLength(10)]),
    bairro: new FormControl('', [Validators.maxLength(80)]),
    cidade: new FormControl('', [Validators.maxLength(80)]),
    estado: new FormControl(''),
    complemento: new FormControl('', [Validators.maxLength(120)]),
    // Campos de enfermeiro
    coren: new FormControl(''),
  });

  setUserType(type: 'client' | 'nurse') {
    this.userType = type;
    this.updateValidators();
  }

  updateValidators() {
    if (this.userType === 'client') {
      // Validadores para cliente
      this.registerForm.get('phoneNumber')?.setValidators([Validators.required, this.phoneValidator]);
      this.registerForm.get('cep')?.setValidators([Validators.required, this.cepValidator]);
      this.registerForm.get('rua')?.setValidators([Validators.required, Validators.maxLength(120)]);
      this.registerForm.get('numero')?.setValidators([Validators.required, Validators.maxLength(10)]);
      this.registerForm.get('bairro')?.setValidators([Validators.required, Validators.maxLength(80)]);
      this.registerForm.get('cidade')?.setValidators([Validators.required, Validators.maxLength(80)]);
      this.registerForm.get('estado')?.setValidators([Validators.required, this.estadoValidator]);
      // Limpa validadores de enfermeiro
      this.registerForm.get('coren')?.clearValidators();
    } else {
      // Validadores para enfermeiro
      this.registerForm.get('coren')?.setValidators([Validators.required, this.corenValidator]);
      // Limpa validadores de cliente
      ['phoneNumber', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'].forEach((field) => {
        this.registerForm.get(field)?.clearValidators();
      });
    }

    // Atualiza a validade de todos os campos
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.updateValueAndValidity();
    });
  }

  // Máscara para telefone: (XX) XXXXX-XXXX
  applyPhoneMask(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    this.registerForm.get('phoneNumber')?.setValue(value, { emitEvent: false });
  }

  // Máscara para CEP: XXXXX-XXX
  applyCepMask(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    this.registerForm.get('cep')?.setValue(value, { emitEvent: false });

    // Busca CEP quando completo
    if (value.replace(/\D/g, '').length === 8) {
      this.buscarCep(value.replace(/\D/g, ''));
    }
  }

  // Busca endereço pelo CEP usando ViaCEP
  buscarCep(cep: string) {
    this.isLoadingCep = true;
    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        this.isLoadingCep = false;
        if (!data.erro) {
          this.registerForm.patchValue({
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
            complemento: data.complemento || '',
          });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingCep = false;
        this.cdr.detectChanges();
      },
    });
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

    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }

    if (control?.hasError('cepInvalido')) {
      return 'CEP inválido. Use formato: 12345-678';
    }

    if (control?.hasError('telefoneInvalido')) {
      return 'Telefone inválido. Use formato: (11) 99999-9999';
    }

    if (control?.hasError('corenInvalido')) {
      return 'COREN inválido (deve conter 6-10 dígitos)';
    }

    if (control?.hasError('estadoInvalido')) {
      return 'Estado deve ser UF com 2 letras (ex: SP)';
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
