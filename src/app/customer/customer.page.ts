import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'customer.page.html',
  styleUrls: ['customer.page.scss']
})
export class CustomerPage {
  cartItemCount = 0;
  constructor(private readonly cartService: CartService) {
    this.cartService.getCartItemCount().subscribe((value) => {
      this.cartItemCount = value;
    });
  }

}
