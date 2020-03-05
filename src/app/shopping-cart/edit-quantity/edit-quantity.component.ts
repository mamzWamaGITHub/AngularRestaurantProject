import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { ItemDetail } from 'src/app/models/item-detail.model';
import { Dish } from 'src/app/models/dish.model';
import { DishCategory } from 'src/app/models/dish-category.model';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-edit-quantity',
  templateUrl: './edit-quantity.component.html',
  styleUrls: ['./edit-quantity.component.css']
})
export class EditQuantityComponent implements OnInit {
  @Input() itemDetail: ItemDetail;

  dish: Dish;
  dishCategory: DishCategory;

  qty = 1;

  constructor(
    private modalCtrl: ModalController,
    private cartService: CartService,
    private menuService: MenuService,
  ) {
  }
  ngOnInit() {
    this.qty = this.itemDetail.Quantity;
    this.dish = this.menuService.getDish(this.itemDetail.CategoryRID);
    this.dishCategory = this.menuService.getDishCategory(this.itemDetail.CategoryRID);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  updateCart() {
    this.cartService.updateItemQuantity(this.itemDetail, this.qty);
    this.modalCtrl.dismiss();
  }

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
