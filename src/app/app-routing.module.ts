import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./customer/customer.module').then(m => m.TabsPageModule)
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
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
