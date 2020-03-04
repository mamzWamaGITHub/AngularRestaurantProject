import { Component, ViewChild, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { IonItemSliding, ModalController, IonList, AlertController, LoadingController } from '@ionic/angular';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EditQuantityComponent } from './edit-quantity/edit-quantity.component';
import { Order } from '../models/order.model';
import { Cart } from '../models/cart.model';
import { ItemOrderStatus } from '../models/item-order-status.enum';
import { ItemDetail } from '../models/item-detail.model';
import { Dish } from '../models/dish.model';
import { MenuService } from '../services/menu.service';
import { DishCategory } from '../models/dish-category.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: 'shopping-cart.page.html',
  styleUrls: ['shopping-cart.page.scss']
})
export class ShppingCartPage implements OnInit {
  @ViewChild(IonList, { static: false, read: false }) itemsList: IonList;

  cart: Cart = null;
  menu: Dish[] = null;
  dragSubject: BehaviorSubject<number>;

  // orders: Order[];
  isDragging = false;

  ItemOrderStatus = ItemOrderStatus;
  messages: any[];

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
    private readonly menuService: MenuService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController,
    private readonly loadingCtrl: LoadingController,
  ) {
    this.messages = new Array(100).fill({ title: 'Hello' });
    cartService.getCart().subscribe(value => {
      this.cart = value;
      if (!this.menu && this.cart) {
        this.loadMenu();
      }
    });

    //   this.orders = this.cartService.getOrders();
    this.dragSubject = new BehaviorSubject(0);
    this.dragSubject
      .pipe(map((value) => {
        this.isDragging = true;
      }))
      .pipe(debounceTime(1000), map((value) => {
        this.isDragging = false;
      })).subscribe();
  }
  ngOnInit(): void {
  }

  async loadMenu() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      this.menu = await this.menuService.getMenu();
    } catch (error) {
      this.showAlertMessage('Error', error.message);
    }
    loading.dismiss();
  }

  async editItem(item: ItemDetail) {
    const modal = await this.modalCtrl.create({ component: EditQuantityComponent, componentProps: { itemDetail: item, } });
    await modal.present();
    await modal.onDidDismiss();
    await this.itemsList.closeSlidingItems();
    this.cartService.recalculateCartTotals();
  }

  async removeItem(item: ItemDetail) {
    const dishName = this.getDish(item.CategoryRID).DishName;
    const dishCategory = this.getCategory(item.CategoryRID).CategoryName;
    const alert = await this.alertCtrl.create({
      header: `Removeing ${dishName} ${dishCategory} form cart`,
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cartService.removeItem(item);
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

  // async emptyCart(order: Order) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Removeing all items form cart',
  //     message: 'Are you sure?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.cartService.emptyCart(order);
  //           this.orders = this.cartService.getOrders();
  //         }
  //       },
  //       'No'
  //     ]
  //   });
  //   await alert.present();
  // }


  async showAlertMessage(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });
    alert.present();
  }


  getIconName(itemDetail: ItemDetail) {
    switch (itemDetail.ItemOrderStatus) {
      case ItemOrderStatus.OrderPlaced:
        return 'basket-outline';
      case ItemOrderStatus.OrderAccepted:
        return 'checkmark-circle-outline';
      case ItemOrderStatus.OrderReady:
        return 'fast-food-outline';
      case ItemOrderStatus.OrderServed:
        return 'checkmark-done-outline';
      case ItemOrderStatus.OrderRejected:
        return 'close-circle-outline';
      case ItemOrderStatus.OrderCancelled:
        return 'person-remove-outline';
      default:
        return 'alert-outline';
    }
  }

  getItemStatus(itemDetail: ItemDetail) {
    switch (itemDetail.ItemOrderStatus) {
      case ItemOrderStatus.OrderPlaced:
        return 'Placed';
      case ItemOrderStatus.OrderAccepted:
        return 'Accepted';
      case ItemOrderStatus.OrderReady:
        return 'Ready';
      case ItemOrderStatus.OrderServed:
        return 'Served';
      case ItemOrderStatus.OrderRejected:
        return 'Rejected';
      case ItemOrderStatus.OrderCancelled:
        return 'Cancelled';
      default:
        return 'Unknow status';
    }
  }

  getDish(categoryId: number): Dish {
    return this.menuService.getDish(categoryId);
  }

  getCategory(categoryId: number): DishCategory {
    return this.menuService.getDishCategory(categoryId);
  }

  cartIsEmpty() {
    return this.cart === null || (this.cart.itemDetails && this.cart.itemDetails.length === 0);
  }


  async placeOrder() {
    const newItems = this.cart.itemDetails.filter(item => item.ItemOrderStatus === null);
    console.log(newItems);
    if (newItems.length === 0) {
      return this.showAlertMessage('No new items added', 'Your order is already sent to kichen, you can go to menu and select new dishes');
    }
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
              this.showAlertMessage('Success!', 'Order placed succssfully');
            } catch (error) {
              this.showAlertMessage('Error', error.message);
            }
            loading.dismiss();
          }
        },
        'No'
      ]
    });
    alert.present();
  }

}
