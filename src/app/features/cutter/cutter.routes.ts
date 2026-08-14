import { Routes } from '@angular/router';

export const CUTTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cutter-page').then((m) => m.CutterPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./roll-create-page').then((m) => m.RollCreatePage),
  },
];
