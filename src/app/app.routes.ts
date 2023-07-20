import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  {
    path: 'site/:id',
    children: [
      {
        path: 'user',
        loadComponent: () => import('./pages/user/user.page').then(m => m.UserPage),
        canActivate: [AuthGuard],
      },
      {
        path: 'equipment',
        loadComponent: () => import('./pages/equipment/equipment.page').then(m => m.EquipmentPage),
        canActivate: [AuthGuard],
      },
      {
        path: 'location',
        loadComponent: () => import('./pages/location/location.page').then(m => m.LocationPage),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  // {
  //   path: 'user',
  //   loadComponent: () => import('./pages/user/user.page').then(m => m.UserPage),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'equipment',
  //   loadComponent: () => import('./pages/equipment/equipment.page').then(m => m.EquipmentPage)
  // },
  // {
  //   path: 'location',
  //   loadComponent: () => import('./pages/location/location.page').then(m => m.LocationPage)
  // },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
];
