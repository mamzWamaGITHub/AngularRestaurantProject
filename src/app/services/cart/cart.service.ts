import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =   this.storage.get('cart') || {
      items: [],
      TableID : '',
      CompanyID: '',
      MenuRID: '',
      CategoryID: '',
      Amount: 0,
};
  constructor(
    public storage: LocalStorageService
    ) { }
  /**
   * Calc items Amount Prize
   * @param items [{Prize: any, Quanity: any } ..]
   */
  calcTotalAmount(items) {
    return   this.cart.items.reduce((acc, item) =>
    acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
  }
  public exist(item) {
    return this.cart.items.filter(elm => elm.CategoryId === item.CategoryId).length;
  }
   cartChanged() {
    this.cart.items = this.cart.items.map(item => {
      item.Amount = item.Prize * item.Quanity;
      return item;
    });
    this.cart.Amount = this.calcTotalAmount(this.cart.items);
    this.cart.Quanity = this.getItemCount();
    this.storage.set('cart', this.cart);
  }
  increaseCount(item) {
    if (!this.exist(item)) {
      item.Quanity = 1;
      this.cart.items.push(item);
    } else {
      this.cart.items = this.cart.items.map(elm => {
        elm.Quanity = Number(elm.Quanity);
        if (elm.CategoryId === item.CategoryId) {
          elm.Quanity =  elm.Quanity + 1;
        }
        return elm;
      });
    }
    this.cartChanged();
  }
  decreaseCount(item) {
    this.cart.items = this.cart.items.map(elm => {
      if (elm.CategoryId === item.CategoryId) {
          elm.Quanity--;
      }
      return elm;
    });
    this.cartChanged();
  }
  find(item) {
    return this.cart.items.filter(i => i.CategoryId === item.CategoryId)[0];
  }
  public deleteFromCart(item) {
    if (!this.exist(item)) { return; }
    item.isincart = false;
    this.cart.items = this.cart.items.filter(elm => elm.CategoryId !== item.CategoryId);
    this.cartChanged();
    return this.cart;
  }
  clear() {
    this.cart = {
      items: [],
      Amount: 0
    };
    this.storage.remove('cart');
    this.cartChanged();
  }
addToCart(item) {
  if (!this.exist(item))  {
    this.cart.items.push(item);
    this.cartChanged();
  }
  // this.cart.TableID = item.RID;
  // this.cart.CompanyID = item.CompanyID;
  // this.cart.MenuRID = item.DishID;
  // this.cart.CategoryID = item.CategoryId;
  // this.cart.items.push(
  //   {
  //   TableID: item.TableID,
  //   CompanyID: item.CompanyID,
  //   MenuRID: item.MenuRID,
  //   CategoryID: item.CategoryID
  //   }
    // );
  // this.cartChanged();
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
