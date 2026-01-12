import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ClientDashboard } from './pages/client-dashboard/client-dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['client'])],
    children: [{ path: 'dashboard', component: ClientDashboard }],
  },
];
