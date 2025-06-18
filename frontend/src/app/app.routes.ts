import { Routes } from '@angular/router';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { FormComponent } from './pages/form/form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => {
      return import('./pages/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'survey/:surveyId',
    canActivate: [authGuard],
    component: FormComponent,
  },
  {
    path: 'data/:surveyId',
    canActivate: [authGuard],
    loadComponent: () => {
      return import('./pages/data/data.component').then((m) => m.DataComponent);
    },
  },
  {
    path: 'create',
    canActivate: [authGuard],
    component: CreateFormComponent,
  },
  {
    path: 'edit/:surveyId/:responseId',
    canActivate: [authGuard],
    component: FormComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
