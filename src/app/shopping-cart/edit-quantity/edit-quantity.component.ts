import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Dish, DishCategory } from 'src/app/models/dish.model';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-edit-quantity',
  templateUrl: './edit-quantity.component.html',
  styleUrls: ['./edit-quantity.component.css']
})
export class EditQuantityComponent implements OnInit {
  @Input() cartItem: CartItem;


  qty = 1;

  constructor(
    private modalCtrl: ModalController,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.qty = this.cartItem.quantity;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  updateCart() {
    this.cartService.updateItemQuantity(this.cartItem, this.qty);
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
