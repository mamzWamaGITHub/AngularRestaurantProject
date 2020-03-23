import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerPage } from './customer.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPage,
    children: [
      {
        path: 'food-menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../food-menu/food-menu.module').then(m => m.FoodMenuModule)
          }
        ]
      },
      {
        path: 'shopping-cart',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../shopping-cart/shopping-cart.module').then(m => m.ShoppingCartPageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/customer/food-menu',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
