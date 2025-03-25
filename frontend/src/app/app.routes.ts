import { Routes } from '@angular/router';
import { CreateFormComponent } from './pages/create-form/create-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'form',
    loadComponent: () => {
      return import('./pages/form/form.component').then((m) => m.FormComponent);
    },
  },
  {
    path: 'data',
    loadComponent: () => {
      return import('./pages/data/data.component').then((m) => m.DataComponent);
    },
  },
  {
    path: 'create',
    component: CreateFormComponent,
  },
];
