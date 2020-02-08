import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swall: SweetAlert = _swal as any;
@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart =   this.storage.get('cart') || {
      items: []
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
    acc + Number( Number(item.item.Prize)  *  Number(item.item.Quanity)) + Number(item.item.Tax), 0);
  }
  getTableId(item) {
    this.cart.items.TableName = item.TableName;
    this.cart.items.TableRID = item.RID;
    this.cart.items.CompanyID = item.CompanyID;
    if (!this.existtable(item))   {
      this.cart.items.TableName = item.TableName;
      this.cart.items.TableRID = item.RID;
      this.cart.items.CompanyID = item.CompanyID;
    } else if (this.existtable(item)) {
      swall(item.TableName +  '    ' + 'Is In Progressing Now' );
    }
  }
  getMealId(item) {
    this.cart.items.DishName = item.DishName;
    this.cart.items.MenuRID = item.DishID;
  }
  public exist(item) {
    return this.cart.items.filter(elm => elm.item.CategoryId === item.CategoryId).length;
  }
  public existtable(item) {
    return this.cart.items.filter(elm => elm.TableName === item.TableName).length;
  }
   cartChanged() {
    this.cart.items = this.cart.items.map(item => {
      item.item.Amount = item.item.Prize * item.item.Quanity;
      return item;
    });
    this.cart.Amount = this.calcTotalAmount(this.cart.items);
    this.cart.Quanity = this.getItemCount();
    this.storage.set('cart', this.cart);
  }
  increaseCount(item) {
    if (!this.exist(item)) {
      item.Quanity = 1;
      this.cart.items.push({item});
    } else {
      this.cart.items = this.cart.items.map(elm => {
        elm.item.Quanity = Number(elm.item.Quanity);
        if (elm.item.CategoryId === item.CategoryId) {
          elm.item.Quanity =  elm.item.Quanity + 1;
        }
        return elm;
      });
    }
    this.cartChanged();
  }
  decreaseCount(item) {
    this.cart.items = this.cart.items.map(elm => {
      if (elm.item.CategoryId === item.CategoryId) {
          elm.item.Quanity--;
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
    this.cart.items = this.cart.items.filter(elm => elm.item.CategoryId !== item.CategoryId);
    this.cartChanged();
    return this.cart;
  }
  clear() {
    this.cart = {
      items: [],
    };
    this.storage.remove('cart');
    this.cartChanged();
  }
addToCart(item) {
  if (!this.exist(item) || !this.existtable(item))  {
      if (!this.cart.items.TableName) {
          swall('You Should Select TableName');
      } else if (!this.cart.items.DishName) {
        swall('You Should Select DishName');
      } else {
        item.isincart = true;
        this.cart.items.push({
          TableName: this.cart.items.TableName,
          TableRID:  this.cart.items.TableRID,
          CompanyID: this.cart.items.CompanyID,
          DishName:  this.cart.items.DishName,
          MenuRID: this.cart.items.MenuRID,
          CustomerRID: this.cart.items.CustomerRID,
          CartID: this.cart.items.CartID,
          item
        });
        this.cartChanged();
      }
  }
}
getCart() {
  return this.cart;
}
getItemCount() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.item.Quanity)), 0);
}
getItemTotalPrice() {
  return this.cart.items.reduce((acc, item) =>
  acc + Number( Number(item.item.Prize)) * Number(item.item.Quanity), 0);
}
getFinalTAmount() {
  return this.cart.items.reduce((acc, item) =>
  acc + Number( Number(item.item.Prize)  *  Number(item.item.Quanity)) + Number(item.item.Tax), 0);
}
getTax() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.item.Tax)), 0);
}
getDisc() {
  return this.cart.items.reduce((acc, item) => acc + Number( Number(item.item.disc)), 0);
}
}
