import { Routes } from '@angular/router';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { FormComponent } from './pages/form/form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pages/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'survey/:surveyId',
    component: FormComponent,
  },
  {
    path: 'data/:surveyId',
    loadComponent: () => {
      return import('./pages/data/data.component').then((m) => m.DataComponent);
    },
  },
  {
    path: 'create',
    component: CreateFormComponent,
  },
  {
    path: 'edit/:surveyId/:responseId',
    component: FormComponent,
  },
];
