import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =   this.storage.get('cart') || {
      items: [],
      total: 0,
    };
  constructor(
    public storage: LocalStorageService
    ) { }
  /**
   * Calc items total price
   * @param items [{price: any, count: any} ..]
   */
  calcTotalPrice(items) {
    return     this.cart.total = this.cart.items.reduce((acc, item) =>
    acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
  }
  public exist(item) {
    return this.cart.items.filter(elm => elm.id === item.id).length;
  }
   cartChanged() {
    this.cart.items = this.cart.items.map(item => {
      item.total = item.Prize * item.Quanity;
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
        elm.Quanity = Number(elm.Quanity);
        if (elm.id === item.id) {
          elm.Quanity =  elm.Quanity + 1;
        }
        return elm;
      });
    }
  }
  decreaseCount(item) {
    this.cart.items = this.cart.items.map(elm => {
      if (elm.id === item.id) {
          elm.Quanity--;
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
showMeal(meal) {
  // this.cart.items.map(elm => {
  //   this.cart.items.push(meal.DishName);
    // console.log(elm);
    // return elm;
  // });
}
addToCart(item) {
  if (this.cart.items.indexOf(item) === -1) {
    this.cart.items.push(item);
    this.cart.total = this.calcTotalPrice(this.cart.items);
    // this.cart.items = this.showMeal(item);
    this.cartChanged();
  }
}
getCart() {
  return this.cart;
}
getItemCount() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.Quanity)), 0);
}
getItemTotalPrice() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.Prize)) * Number(item.Quanity), 0);
}
getFinalTAmount() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
}
getTax() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.Tax)), 0);
}
getDisc() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.disc)), 0);
}
}
