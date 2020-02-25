import { NgModule } from '@angular/core';
import {enableProdMode} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { LoaderComponent } from './pages/loader/loader.component';

enableProdMode();
const routes: Routes = [
  { path: '', redirectTo: 'customer', pathMatch: 'full' },
   { path: 'customer/:tableName/:CompanyID', component: CustomerComponent },
  // { path: '/customer/:tableName/:CompanyID/', component: CustomerComponent },
  { path: 'loader', component: LoaderComponent },
];

@NgModule({
 
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

