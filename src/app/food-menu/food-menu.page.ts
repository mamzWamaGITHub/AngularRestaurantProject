import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../models/dish.model';
import { FoodCategoryComponent } from './food-category/food-category.component';

@Component({
  selector: 'app-food-menu',
  templateUrl: 'food-menu.page.html',
  styleUrls: ['food-menu.page.scss']
})
export class FoodMenuPage implements OnInit {
  ParamCompanyID = '1'; //TODO: fix
  ParamTableID = '1';
  meals: Dish[] = [];

  constructor(
    private readonly api: ApiService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
  ) {
    // this.ParamTableID = this.route.snapshot.paramMap.get('tableName');
    // this.ParamCompanyID = this.route.snapshot.paramMap.get('CompanyID');
  }


  ngOnInit(): void {
    this._loadMeals();
  }

  private async _loadMeals() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.meals = await this.api.getData<Dish[]>('menus/' + this.ParamCompanyID).toPromise();
    loading.dismiss();
  }

  async showCategories(meal: Dish) {
    const modal = await this.modalCtrl.create({
      component: FoodCategoryComponent,
      componentProps: { meal }
    });
    modal.present();
  }

}
