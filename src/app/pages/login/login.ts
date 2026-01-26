import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiErrorResponse } from '../../interfaces/api-error';
import { Auth } from '../../services/auth/auth';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { ErrorPopup } from '../../shared/components/error-popup/error-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CustomInput, ReactiveFormsModule, ButtonGreen, ErrorPopup],
  templateUrl: './login.html',
  styles: ``,
  standalone: true,
})
export class Login {
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  errorMessage: string | null = null;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email && password) {
        this.errorMessage = null;
        this.authService.login({ email, password }).subscribe({
          next: () => {
            // Redirecionamento é feito automaticamente no serviço
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
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (control?.hasError('email')) {
      return 'Digite um e-mail válido';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `A senha deve ter no mínimo ${requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  getControl(name: string): FormControl {
    return this.loginForm.get(name) as FormControl;
  }


  private router = inject(Router);

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
