import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DishCategory, Dish } from '../models/dish.model';
import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class CartService {
    orders: Order[] = [];

    private cartItemCount = new BehaviorSubject(0);

    subTotal = 0;
    discountTotal = 0;
    taxTotal = 0;
    total = 0;

    constructor(

    ) {
        this.loadFromLocalStorage();
        this.updateCartItemCounter();
        this.recalculateCartTotals();
    }

    private updateCartItemCounter() {
        if (this.orders.length === 0) {
            this.cartItemCount.next(0);
            return;
        }
        let numberOfItems = 0;
        const notFinishedOrders = this.orders.filter(order => order.status !== 'COMPLETED');
        for (const order of notFinishedOrders) {
            for (const item of order.items) {
                numberOfItems += item.quantity;
            }
        }

        this.cartItemCount.next(numberOfItems);
    }

    getOrders() {
        return this.orders;
    }

    getCartItemCount() {
        return this.cartItemCount;
    }

    addToCart(dish: Dish, dishCategory: DishCategory, quantity: number) {
        let currentOrder: Order;

        const newDraftOrder = () => {
            const draftOrder = new Order();
            draftOrder.items = [];
            draftOrder.status = 'DRAFT';
            this.orders.unshift(draftOrder);
            return draftOrder;
        };

        // no old orders
        if (this.orders.length === 0) {
            currentOrder = newDraftOrder();
        }

        // looking up for an existing draft order
        if (this.orders.length > 0) {
            currentOrder = this.orders.find(order => order.status === 'DRAFT');
        }

        // createing new draft order
        if (currentOrder == null) {
            currentOrder = newDraftOrder();
        }

        let added = false;
        for (const item of currentOrder.items) {
            if (item.dishCategory.CategoryRID === dishCategory.CategoryRID) {
                item.quantity += quantity;
                added = true;
                break;
            }
        }
        if (added === false) {
            currentOrder.items.push({
                quantity,
                dish,
                dishCategory,
            });
        }
        this.recalculateOrderTotals(currentOrder);
        this.updateCartItemCounter();
        this.saveToLocalStorage();
    }

    recalculateOrderTotals(order: Order) {
        let subTotal = 0;
        let discountTotal = 0;
        let taxTotal = 0;
        let total = 0;
        for (const item of order.items) {
            subTotal += item.quantity * item.dishCategory.Amount;
            if (item.dishCategory.DiscountCategories.length > 0) {
                discountTotal += item.quantity * item.dishCategory.DiscountCategories[0].disc;
            }
            taxTotal += (subTotal - discountTotal) * (1 / item.dishCategory.TaxPercentage);
            total += subTotal + taxTotal - discountTotal;
        }

        order.subTotal = subTotal;
        order.discountTotal = discountTotal;
        order.taxTotal = taxTotal;
        order.total = total;

        this.recalculateCartTotals();
    }

    recalculateCartTotals() {
        let subTotal = 0;
        let discountTotal = 0;
        let taxTotal = 0;
        let total = 0;
        for (const order of this.orders) {
            subTotal += order.subTotal;
            discountTotal += order.discountTotal;
            taxTotal += order.taxTotal;
            total += order.total;
        }
        this.subTotal = subTotal;
        this.discountTotal = discountTotal;
        this.taxTotal = taxTotal;
        this.total = total;
    }

    updateItemQuantity(cartItem: CartItem, qty: number) {
        cartItem.quantity = qty;
        this.updateCartItemCounter();
        this.saveToLocalStorage();
    }


    removeItem(order: Order, item: CartItem) {
        const index = order.items.indexOf(item);
        order.items.splice(index, 1);
        this.updateCartItemCounter();
        this.recalculateOrderTotals(order);
        this.saveToLocalStorage();

        if (order.items.length === 0) {
            this.emptyCart(order);
        }
    }


    emptyCart(order: Order) {
        if (order.status !== 'DRAFT') {
            return;
        }
        const index = this.orders.indexOf(order);
        this.orders.splice(index, 1);
        this.updateCartItemCounter();
        this.recalculateCartTotals();
        this.saveToLocalStorage();
    }

    async placeOrder() {
        const order = this.orders.find(ord => ord.status === 'DRAFT');
        order.status = 'IN_PROGRESS';
        // order.status = 'COMPLETED';
        this.updateCartItemCounter();
        throw new Error('Not finised yet');

        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         // do confirmation actions
        //         this.loaderService.display(true);
        //         this.order.TableRID = item.TableRID;
        //         this.order.CompanyID = item.CompanyID;
        //         this.order.MenuRID = item.MenuRID;
        //         this.order.CategoryRID = item.CategoryRID;
        //         this.order.Quantity = item.Quantity;
        //         this.order.Amount = item.Amount + item.Tax;
        //         this.order.CustomerRID = this.order.CustomerRID;
        //         this.order.CartID = this.order.CartID;
        //         console.log(this.order, 'order');
        //         const headers = new Headers();
        //         headers.append('Content-Type', 'application/json');
        //         //headers.append('Host','http://localhost:52161/');
        //         //headers.append('Access-Control-Allow-Origin','*');
        //         const options = new RequestOptions({ headers });
        //         swall('The order in progress');
        //         //this.api.postData('Menus/1/1/4/8/1/1100/', this.order, options).subscribe(
        //         this.api.postMulitipleData('Cart', this.order, options).subscribe(
        //             data => {
        //                 this.localStorage.set('orders', data);
        //                 this.loaderService.display(false);
        //                 swall('Data Inserted Sucfully');
        //                 //this.cartservice.clear();
        //                 //this.router.navigate(['/']);
        //                 //window.location.reload();
        //             },
        //             error => {
        //                 this.loaderService.display(false);
        //                 swall('Oops!', 'Something went wrong!', 'error');
        //                 console.log('Error occured.' + error.message);
        //                 this.error = error;
        //             }
        //         );
        //     }
        //     this.dialogRef = null;
        // });
    }


    private saveToLocalStorage() {
        window.localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    private loadFromLocalStorage() {
        const ordersString = window.localStorage.getItem('orders');
        if (ordersString) {
            this.orders = JSON.parse(ordersString);
        }
    }

}
