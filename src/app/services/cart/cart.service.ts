import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =   this.storage.get('cart') || {
    items: [],
    total: 0
  };
  showorders = false;
  showmeal: any;
  constructor(
    public storage: LocalStorageService
    ) { }
  /**
   * Calc items total price
   * @param items [{price: any, count: any} ..]
   */
  calcTotalPrice(items) {
    return     this.cart.total = this.cart.items.reduce((acc, item) =>
    acc + Number( Number(item.price)  *  Number(item.quantity)) + Number(item.tax), 0);
  }
  public exist(item) {
    return this.cart.items.filter(elm => elm.id === item.id);
  }
   cartChanged() {
    this.cart.items = this.cart.items.map(item => {
      item.total = item.price * item.count;
      return item;
    });
    this.cart.total = this.calcTotalPrice(this.cart.items);
    this.storage.set('cart', this.cart);
  }
  increaseCount(item) {
    if (!this.exist(item)) {
      this.cart.items.push(item);
    } else {
      this.cart.items = this.cart.items.map(elm => {
        elm.quantity = Number(elm.quantity);
        if (elm.id === item.id) {
          elm.quantity =  elm.quantity + 1;
        }
        return elm;
      });
    }
  }
  decreaseCount(item) {
    this.cart.items = this.cart.items.map(elm => {
      if (elm.id === item.id) {
          elm.quantity--;
      }
      return elm;
    });
  }
  find(item) {
    return this.cart.items.filter(i => i.id === item.id)[0];
  }
  clear() {
    this.cart = {
      items: [],
      total: 0
    };
  }
ShowMeal(meal) {
  this.showmeal = meal.name;
  console.log(this.showmeal, 'm');
}
addToCart(item) {
  this.showorders =  true;
  // if (!this.exist(item)) {
  this.cart.items.push(item);
  this.cart.total = this.calcTotalPrice(this.cart.items);
  this.cartChanged();
  // }
}
getCart() {
  console.log(this.cart, );
  return this.cart;
}
getItemCount() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.quantity)), 0);
}
getItemTotalPrice() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.price)) * Number(item.quantity), 0);
}
getFinalTAmount() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.price)  *  Number(item.quantity)) + Number(item.tax), 0);
}
getTax() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.tax)), 0);
}
getDisc() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.disc)), 0);
}
}
