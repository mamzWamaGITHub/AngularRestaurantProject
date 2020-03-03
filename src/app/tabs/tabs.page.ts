import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cartItemCount = 0;
  constructor(private readonly cartService: CartService) {
    this.cartService.getCartItemCount().subscribe((value) => {
      this.cartItemCount = value;
    });
  }

}
