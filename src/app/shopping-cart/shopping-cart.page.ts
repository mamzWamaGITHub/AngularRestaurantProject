import { Component, ViewChild } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { IonItemSliding, ModalController, IonList, AlertController, LoadingController } from '@ionic/angular';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EditQuantityComponent } from './edit-quantity/edit-quantity.component';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: 'shopping-cart.page.html',
  styleUrls: ['shopping-cart.page.scss']
})
export class ShppingCartPage {
  @ViewChild(IonList, { static: false, read: false }) itemsList: IonList;

  dragSubject: BehaviorSubject<number>;
  orders: Order[];
  isDragging = false;

  get subTotal() {
    return this.cartService.subTotal;
  }

  get discountTotal() {
    return this.cartService.discountTotal;
  }

  get taxTotal() {
    return this.cartService.taxTotal;
  }

  get total() {
    return this.cartService.total;
  }

  constructor(
    private readonly cartService: CartService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController,
    private readonly loadingCtrl: LoadingController,
  ) {
    this.orders = this.cartService.getOrders();
    this.dragSubject = new BehaviorSubject(0);
    this.dragSubject
      .pipe(map((value) => {
        this.isDragging = true;
      }))
      .pipe(debounceTime(1000), map((value) => {
        this.isDragging = false;
      })).subscribe();
  }

  async editItem(order: Order, item: CartItem) {
    const modal = await this.modalCtrl.create({ component: EditQuantityComponent, componentProps: { cartItem: item, } });
    await modal.present();
    await this.itemsList.closeSlidingItems();
    await modal.onDidDismiss();
    this.cartService.recalculateOrderTotals(order);

  }
  async removeItem(order: Order, item: CartItem) {
    const alert = await this.alertCtrl.create({
      header: `Removeing ${item.dish.DishName} ${item.dishCategory.CategoryName} form cart`,
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cartService.removeItem(order, item);
          }
        },
        'No'
      ]
    });
    await alert.present();
  }

  async openItem(itemRef: IonItemSliding) {
    if (this.isDragging) {
      return;
    }
    if (itemRef.disabled) {
      return;
    }
    const openAmount = await itemRef.getOpenAmount();
    const isOpen = openAmount !== 0;
    if (isOpen) {
      itemRef.close();
    } else {
      itemRef.open('start');
    }
  }

  onItemDrag(e) {
    this.dragSubject.next(e.detail.amonut);
  }

  async emptyCart(order: Order) {
    const alert = await this.alertCtrl.create({
      header: 'Removeing all items form cart',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cartService.emptyCart(order);
            this.orders = this.cartService.getOrders();
          }
        },
        'No'
      ]
    });
    await alert.present();
  }

  async placeOrder() {
    const alert = await this.alertCtrl.create({
      header: 'Place Order',
      message: 'Are you sure?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingCtrl.create();
            loading.present();
            try {
              await this.cartService.placeOrder();
            } catch (error) {
              this.showErrorMessage(error.message);
            }
            loading.dismiss();
          }
        },
        'No'
      ]
    });
    alert.present();
  }

  async showErrorMessage(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['Ok']
    });
    alert.present();
  }

  statusDisplayName(name: string) {
    switch (name) {
      case 'DRAFT':
        return 'Draft';
      case 'IN_PROGRESS':
        return 'In progress';
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      default:
        return 'Unknow status';
    }
  }

}
