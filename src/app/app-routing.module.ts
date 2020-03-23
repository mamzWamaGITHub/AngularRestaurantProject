import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QrAuthGuard } from './customer/guards/qr-auth.guard';

const routes: Routes = [
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.TabsPageModule),
    canActivate: [QrAuthGuard],
  },
  {
    path: 'customer/:tableID/:companyID/:qrCode',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./landing-page/landing-page.module').then(m => m.LandingPageModule)
      }
    ]
  },
  {
    path: 'chef',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./chef/chef.module').then(m => m.ChefModule)
      }
    ]
  },
  {
    path: 'error',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./error-page/error-page.module').then(m => m.ErrorPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/error',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
