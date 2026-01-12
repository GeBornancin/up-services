import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, User } from '../../services/auth/auth';

export const roleGuard = (allowedRoles: User['role'][]): CanActivateFn => {
  return () => {
    const authService = inject(Auth);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Redireciona para o dashboard apropriado se não tiver permissão
    router.navigate([`/${user.role}/dashboard`]);
    return false;
  };
};
