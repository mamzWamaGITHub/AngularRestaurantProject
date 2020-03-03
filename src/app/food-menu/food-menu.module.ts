import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodMenuPage } from './food-menu.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { FoodCategoryComponent } from './food-category/food-category.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: FoodMenuPage }])
  ],
  declarations: [FoodMenuPage, FoodCategoryComponent],
  entryComponents: [FoodCategoryComponent],
})
export class FoodMenuModule { }
