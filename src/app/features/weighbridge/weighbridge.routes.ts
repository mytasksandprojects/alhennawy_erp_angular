import { Routes } from '@angular/router';

export const WEIGHBRIDGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./weighbridge-page').then((m) => m.WeighbridgePage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./weighing-create-page').then((m) => m.WeighingCreatePage),
  },
];
