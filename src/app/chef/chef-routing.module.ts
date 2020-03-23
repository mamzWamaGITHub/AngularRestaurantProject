import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './pages/orders/orders.page';
import { ChefAuthGuard } from './guards/chef-auth.guard';
import { ChefLoginPage } from './pages/chef-login/chef-login.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
  },
  {
    path: 'login',
    component: ChefLoginPage,
  },
  {
    path: 'orders',
    component: OrdersPage,
    canActivate: [ChefAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: [],
  providers: [],
})
export class ChefRoutingModule { }

export const routedPages = [OrdersPage, ChefLoginPage];
