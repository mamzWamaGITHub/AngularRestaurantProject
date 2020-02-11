import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swall: SweetAlert = _swal as any;
@Injectable({
  providedIn: 'root'
})
export class CartService {
  res = [];
  order =   this.storage.get('order') || {
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
    this.res = this.order.items.map((elm, i) => {
      return elm.itemDetails[0];
    });
    return   this.res.reduce((acc, item) =>
    acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
  }
  getTableId(item) {
    this.order.items.TableName = item.TableName;
    this.order.items.TableRID = item.RID;
    this.order.items.CompanyID = item.CompanyID;
    if (!this.existtable(item))   {
      this.order.items.TableName = item.TableName;
      this.order.items.TableRID = item.RID;
      this.order.items.CompanyID = item.CompanyID;
    } else if (this.existtable(item)) {
      swall(item.TableName +  '    ' + 'Is In Progressing Now' );
    }
  }
  getMealId(item) {
    this.order.items.DishName = item.DishName;
    this.order.items.MenuRID = item.DishID;
  }
  public exist(item) {
    // this.res = this.order.items.map((elm, i) => {
    //   return elm.itemDetails[0];
    // });
    // return this.res.filter(elm => {
    //   console.log(elm.CategoryId , item.CategoryId);
    //   return elm.CategoryId === item.CategoryId;
    // });
    // tslint:disable-next-line:no-unused-expression
    // return this.order.items;
    return this.order.items.filter(elm => elm.CategoryId === item.CategoryId).length;

  }
  public existtable(item) {
    return this.order.items.filter(elm => elm.TableRID === item.RID).length;
  }
   cartChanged() {
    this.res = this.order.items.map((elm, i) => {
      return elm.itemDetails[0];
    });
    this.order.items.itemDetails = this.res.map(item => {
      item.Amount = item.Prize * item.Quanity;
      return item;
    });
    this.order.Amount = this.calcTotalAmount(this.order.items);
    this.order.Quanity = this.getItemCount();
    this.storage.set('order', this.order);
  }
  increaseCount(item) {
    if (!this.exist(item)) {
      item.Quanity = 1;
      this.order.items.push([item]);
    } else {
      this.res = this.order.items.map((elm, i) => {
        return elm.itemDetails[0];
      });
      this.order.items.itemDetails = this.res.map(elm => {
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
    this.res = this.order.items.map((elm, i) => {
      return elm.itemDetails[0];
    });
    this.order.items.itemDetails = this.res.map(elm => {
      if (elm.CategoryId === item.CategoryId) {
          elm.Quanity--;
      }
      return elm;
    });
    this.cartChanged();
  }
  find(item) {
    return this.order.items.filter(i => i.CategoryId === item.CategoryId)[0];
  }
  public deleteFromCart(item) {
    if (!this.exist(item)) { return; }
    item.isincart = false;
    this.order.items = this.order.items.filter(elm => elm.MenuRID !== item.MenuRID);
    this.cartChanged();
    return this.order;
  }
  clear() {
    this.order = {
      items: [],
    };
    this.storage.remove('order');
    this.cartChanged();
  }
addToCart(item) {
  if (!this.exist(item) || !this.existtable(item))  {
      if (!this.order.items.TableName) {
          swall('You Should Select TableName');
      } else if (!this.order.items.DishName) {
        swall('You Should Select DishName');
      } else {
        item.isincart = true;
        this.order.items.push({
          TableName: this.order.items.TableName,
          TableRID:  this.order.items.TableRID,
          CompanyID: this.order.items.CompanyID,
          DishName:  this.order.items.DishName,
          MenuRID: this.order.items.MenuRID,
          CustomerRID: this.order.items.CustomerRID,
          orderID: this.order.items.orderID,
          itemDetails: [item]
        });
        this.cartChanged();
      }
  }
}
getCart() {
  return this.order;
}
getItemCount() {
  this.res = this.order.items.map((elm, i) => {
    return elm.itemDetails[0];
  });
  return this.res.reduce((acc, item) => acc + Number( Number(item.Quanity)), 0);
}
getItemTotalPrice() {
  this.res = this.order.items.map((elm, i) => {
    return elm.itemDetails[0];
  });
  return this.res.reduce((acc, item) =>
  acc + Number( Number(item.Prize)) * Number(item.Quanity), 0);
}
getFinalTAmount() {
  this.res = this.order.items.map((elm, i) => {
    return elm.itemDetails[0];
  });
  return this.res.reduce((acc, item) =>
  acc + Number( Number(item.Prize)  *  Number(item.Quanity)) + Number(item.Tax), 0);
}
getTax() {
  this.res = this.order.items.map((elm, i) => {
    return elm.itemDetails[0];
  });
  return this.res.reduce((acc, item) => acc + Number( Number(item.Tax)), 0);
}
getDisc() {
  this.res = this.order.items.map((elm, i) => {
    return elm.itemDetails[0];
  });
  return this.res.reduce((acc, item) => acc + Number( Number(item.disc)), 0);
}
}
