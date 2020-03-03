import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShppingCartPage } from './shopping-cart.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { EditQuantityComponent } from './edit-quantity/edit-quantity.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ShppingCartPage }])
  ],
  declarations: [ShppingCartPage, EditQuantityComponent],
  entryComponents: [EditQuantityComponent]
})
export class ShoppingCartPageModule { }
