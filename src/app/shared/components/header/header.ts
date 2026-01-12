import { Component, inject } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import { ButtonGreen } from '../button-green/button-green';

@Component({
  selector: 'app-header',
  imports: [ButtonGreen],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Auth);

  user = this.authService.currentUser;

  mapRoleToLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'client':
        return 'Contratante';
      case 'nurse':
        return 'Enfermeiro (a)';
      default:
        return 'Usuário';
    }
  }
}
