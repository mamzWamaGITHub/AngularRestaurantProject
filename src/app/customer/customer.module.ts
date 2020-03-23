import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';

import { CustomerPage } from './customer.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CustomerRoutingModule
  ],
  declarations: [CustomerPage]
})
export class TabsPageModule { }
