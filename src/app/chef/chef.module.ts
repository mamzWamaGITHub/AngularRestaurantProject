import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedPages, ChefRoutingModule } from './chef-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { OrdersService } from './services/orders.services';
import { ChefAuthService } from './services/chef-auth.service';
import { ChefAuthGuard } from './guards/chef-auth.guard';

@NgModule({
  declarations: [...routedPages],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ChefRoutingModule,
  ],
  providers: [OrdersService, ChefAuthService, ChefAuthGuard]
})
export class ChefModule { }
