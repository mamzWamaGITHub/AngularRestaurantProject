import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =   this.storage.get('cart') || {
      items: [],
      total: 0,
      dishname: '',
    };
  constructor(
    public storage: LocalStorageService
    ) { }
  /**
   * Calc items total Prize
   * @param items [{Prize: any, Quanity: any } ..]
   */
  calcTotalPrice(items) {
    return   this.cart.items.reduce((acc, item) =>
    acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
  }
  public exist(item) {
    return this.cart.items.filter(elm => elm.PlayerId === item.PlayerId).length;
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
      item.Quanity = 1;
      this.cart.items.push(item);
    } else {
      this.cart.items = this.cart.items.map(elm => {
        elm.Quanity = Number(elm.Quanity);
        if (elm.PlayerId === item.PlayerId) {
          elm.Quanity =  elm.Quanity + 1;
        }
        return elm;
      });
    }
    this.cartChanged();
  }
  decreaseCount(item) {
    this.cart.items = this.cart.items.map(elm => {
      if (elm.PlayerId === item.PlayerId) {
          elm.Quanity--;
      }
      return elm;
    });
    this.cartChanged();
  }
  find(item) {
    return this.cart.items.filter(i => i.PlayerId === item.PlayerId)[0];
  }
  public deleteFromCart(item) {
    if (!this.exist(item)) { return; }
    item.isincart = false;
    this.cart.items = this.cart.items.filter(elm => elm.PlayerId !== item.PlayerId);
    this.cartChanged();
    return this.cart;
  }
  clear() {
    this.cart = {
      items: [],
      total: 0
    };
    this.storage.remove('cart');
    this.cartChanged();
  }
addMeal(item) {
  // this.cart.dishname = item.DishName;
  // this.cart.items.map(elm => {
  //   elm = this.cart.items.push(item.DishName);
  //   console.log(elm, 'this.cart.dishname');
  //   return elm;
  // });
}
addToCart(item) {
  if (!this.exist(item))  {
    this.cart.items.push(item);
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
