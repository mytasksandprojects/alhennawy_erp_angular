import { Routes } from '@angular/router';
import { authGuard } from './core/security/auth.guard';
import { permissionGuard } from './core/security/permission.guard';

/** Lazy feature routing. Every module is permission-guarded. */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home-page').then((m) => m.HomePage),
      },
      {
        path: 'weighbridge',
        canActivate: [permissionGuard],
        data: { permission: 'weighbridge.view' },
        loadChildren: () =>
          import('./features/weighbridge/weighbridge.routes').then(
            (m) => m.WEIGHBRIDGE_ROUTES,
          ),
      },
      {
        path: 'cutter',
        canActivate: [permissionGuard],
        data: { permission: 'cutter.view' },
        loadChildren: () =>
          import('./features/cutter/cutter.routes').then((m) => m.CUTTER_ROUTES),
      },
      {
        path: 'warehouse',
        canActivate: [permissionGuard],
        data: { permission: 'warehouse.view' },
        loadComponent: () =>
          import('./features/warehouse/warehouse-page').then(
            (m) => m.WarehousePage,
          ),
      },
      {
        path: 'quality',
        canActivate: [permissionGuard],
        data: { permission: 'quality.view' },
        loadComponent: () =>
          import('./features/quality/quality-page').then((m) => m.QualityPage),
      },
      {
        path: 'production',
        canActivate: [permissionGuard],
        data: { permission: 'production.view' },
        loadComponent: () =>
          import('./features/production/production-page').then(
            (m) => m.ProductionPage,
          ),
      },
      {
        path: 'sales',
        canActivate: [permissionGuard],
        data: { permission: 'sales.view' },
        loadComponent: () =>
          import('./features/sales/sales-page').then((m) => m.SalesPage),
      },
      {
        path: 'purchasing',
        canActivate: [permissionGuard],
        data: { permission: 'purchasing.view' },
        loadComponent: () =>
          import('./features/purchasing/purchasing-page').then(
            (m) => m.PurchasingPage,
          ),
      },
      {
        path: 'logistics',
        canActivate: [permissionGuard],
        data: { permission: 'logistics.view' },
        loadComponent: () =>
          import('./features/logistics/logistics-page').then(
            (m) => m.LogisticsPage,
          ),
      },
      {
        path: 'finance',
        canActivate: [permissionGuard],
        data: { permission: 'finance.view' },
        loadComponent: () =>
          import('./features/finance/finance-page').then((m) => m.FinancePage),
      },
      {
        path: 'hr',
        canActivate: [permissionGuard],
        data: { permission: 'hr.view' },
        loadComponent: () =>
          import('./features/hr/hr-page').then((m) => m.HrPage),
      },
      {
        path: 'administration',
        canActivate: [permissionGuard],
        data: { permission: 'administration.view' },
        loadComponent: () =>
          import('./features/administration/administration-page').then(
            (m) => m.AdministrationPage,
          ),
      },
      {
        path: 'safety',
        canActivate: [permissionGuard],
        data: { permission: 'safety.view' },
        loadComponent: () =>
          import('./features/safety/safety-page').then((m) => m.SafetyPage),
      },
      {
        path: 'chemicals',
        canActivate: [permissionGuard],
        data: { permission: 'chemicals.view' },
        loadComponent: () =>
          import('./features/chemicals/chemicals-page').then(
            (m) => m.ChemicalsPage,
          ),
      },
      {
        path: 'clinic',
        canActivate: [permissionGuard],
        data: { permission: 'clinic.view' },
        loadComponent: () =>
          import('./features/clinic/clinic-page').then((m) => m.ClinicPage),
      },
      {
        path: 'reports',
        canActivate: [permissionGuard],
        data: { permission: 'reports.view' },
        loadComponent: () =>
          import('./features/reports/reports-page').then((m) => m.ReportsPage),
      },
      {
        path: 'appearance',
        canActivate: [permissionGuard],
        data: { permission: 'appearance.view' },
        loadComponent: () =>
          import('./features/appearance/appearance-page').then(
            (m) => m.AppearancePage,
          ),
      },
      {
        path: 'backups',
        canActivate: [permissionGuard],
        data: { permission: 'backups.view' },
        loadComponent: () =>
          import('./features/backups/backups-page').then((m) => m.BackupsPage),
      },
      {
        path: 'system',
        canActivate: [permissionGuard],
        data: { permission: 'system.view' },
        loadComponent: () =>
          import('./features/system/system-page').then((m) => m.SystemPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
