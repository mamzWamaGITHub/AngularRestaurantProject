import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Dish } from 'src/app/models/dish.model';
import { CartService } from 'src/app/services/cart.service';
import { DishCategory } from 'src/app/models/dish-category.model';

@Component({
  selector: 'app-food-category',
  templateUrl: './food-category.component.html',
  styleUrls: ['./food-category.component.css']
})
export class FoodCategoryComponent implements OnInit {
  @Input() meal: Dish;
  selectedCategory: DishCategory;

  qty = 1;

  constructor(
    private modalCtrl: ModalController,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.selectedCategory = this.meal.DishCategories[0];
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  addToCart() {
    this.cartService.addToCart(this.selectedCategory, this.qty);
    this.modalCtrl.dismiss();
  }


  // categorySelected(category: DishCategory) {
  //   t
  //   alert(category);
  // }

  increaseQuantity() {
    this.qty++;
  }

  decreaseQuantity() {
    if (this.qty === 1) {
      return;
    }
    this.qty--;
  }
}
