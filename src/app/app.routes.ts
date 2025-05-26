import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'example',
  },
  {
    path: 'iframe',
    loadComponent: () =>
      import('../iframe.component').then(
        (m) => m.IframeComponent
      ),
  },
  {
    path: 'example',
    loadComponent: () =>
      import('../example/example.component').then(
        (m) => m.AppExampleComponent
      ),
  },
];
