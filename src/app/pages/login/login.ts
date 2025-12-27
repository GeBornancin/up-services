import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonGreen } from '../../shared/components/button-green/button-green';
import { CustomInput } from '../../shared/components/custom-input/custom-input';

@Component({
  selector: 'app-login',
  imports: [CustomInput, ReactiveFormsModule, ButtonGreen],
  templateUrl: './login.html',
  styles: ``,
  standalone: true,
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Dados:', this.loginForm.value);
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

    return 'Campo inválido'; // Mensagem padrão (fallback)
  }

  getControl(name: string): FormControl {
    return this.loginForm.get(name) as FormControl;
  }
}
