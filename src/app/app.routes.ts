import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ClientDashboard } from './pages/client-dashboard/client-dashboard';
import { NurseDashboard } from './pages/nurse-dashboard/nurse-dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['client'])],
    children: [
      {
        path: 'dashboard', component: ClientDashboard
      }
    ],
  },
  {
    path: 'nurse',
    canActivate: [authGuard, roleGuard(['nurse'])],
    children: [
      {
        path: 'dashboard',
        component: NurseDashboard,
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  }
];
