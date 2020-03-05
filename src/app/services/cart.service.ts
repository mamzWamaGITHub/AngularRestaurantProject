import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';
import { AlertController, MenuController } from '@ionic/angular';
import { Cart } from '../models/cart.model';
import { OrderStatus } from '../models/order-status.enum';
import { PaymentStatus } from '../models/payment-status.enum';
import { ItemDetail } from '../models/item-detail.model';
import { DishCategory } from '../models/dish-category.model';
import { MenuService } from './menu.service';
import * as shortid from 'shortid';
import { ApiService } from './api/api.service';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../config';
import { ItemOrderStatus } from '../models/item-order-status.enum';
import { QrAuthService } from './qr-auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
    private cartItemCount = new BehaviorSubject(0);
    private cart: BehaviorSubject<Cart> = new BehaviorSubject(null);
    customerId: string;
    subTotal = 0;
    discountTotal = 0;
    taxTotal = 0;
    total = 0;

    constructor(
        private readonly http: HttpClient,
        private readonly qrAuthService: QrAuthService,
    ) {
        this.loadCartFromLocalStorage();
        this.initCustomerId();
        if (this.cart.value) {
            this.updateCartItemCounter();
            this.recalculateCartTotals();
        }
    }

    private updateCartItemCounter() {
        this.cartItemCount.next(0);
        if (this.cart.value === null) {
            return;
        }

        if (!this.cart.value.itemDetails || this.cart.value.itemDetails.length === 0) {
            return;
        }
        let numberOfItems = 0;
        for (const item of this.cart.value.itemDetails) {
            numberOfItems += item.Quantity;
        }

        this.cartItemCount.next(numberOfItems);
    }

    getCart() {
        return this.cart;
    }

    // getOrders() {
    //     return this.orders;
    // }

    getCartItemCount() {
        return this.cartItemCount;
    }


    initNewCart(): Cart {
        const qrAuth = this.qrAuthService.qrAuthModel.value;
        return {
            order: {
                CompanyID: qrAuth.CompanyID,
                TableRID: qrAuth.TableID,
                CustomerMobile: 9959,
                CustomerName: 'Ateeq',
                Customer_Generate_ID: this.customerId,
                OrderStatus: OrderStatus.Pending,
                PaymentStatus: PaymentStatus.Pending,
            },
            PaymentDetails: {
                TotalAmount: 0,
            },
            itemDetails: []
        };
    }

    addToCart(dishCategory: DishCategory, quantity: number) {
        if (this.cart.value === null) {
            this.cart.next(this.initNewCart());
        }

        let added = false;
        for (const item of this.cart.value.itemDetails) {
            if (item.CategoryRID === dishCategory.CategoryRID) {
                const newQuantity = item.Quantity + quantity;
                this.updateItemQuantity(item, newQuantity);
                added = true;
                break;
            }
        }

        if (added === false) {
            const newItemDetail = ItemDetail.create(this.cart.value.order.Customer_Generate_ID, dishCategory, quantity);
            this.cart.value.itemDetails.push(newItemDetail);
        }

        this.recalculateCartTotals();
        this.updateCartItemCounter();
        this.saveToLocalStorage();
    }

    updateItemQuantity(item: ItemDetail, newQuantity: number) {
        const previousQuantity = item.Quantity;
        const dishPrice = item.Amount / previousQuantity;

        // updaing item's amount
        item.Amount = dishPrice * newQuantity;

        // calculating discount
        item.DiscountAmount = item.Amount * (item.DiscountPercentage / 100);

        // calculating tax
        item.TaxAmount = item.Amount * (item.TaxPercentage / 100);

        // setting the new quantity
        item.Quantity = newQuantity;

        // calculate totals
        this.updateCartItemCounter();

        // persist curretn cart state to local storage
        this.saveToLocalStorage();
    }


    removeItem(item: ItemDetail) {
        const index = this.cart.value.itemDetails.indexOf(item);
        this.cart.value.itemDetails.splice(index, 1);

        // if no items remained on the cart
        // we will distroy it
        if (this.cart.value.itemDetails.length === 0) {
            this.cart.next(null);
        }
        this.recalculateCartTotals();
        this.updateCartItemCounter();
        this.saveToLocalStorage();

    }


    recalculateCartTotals() {
        if (this.cart.value === null) {
            this.discountTotal = 0;
            this.taxTotal = 0;
            this.total = 0;
            this.subTotal = 0;
            return;
        }
        let subTotal = 0;
        let discountTotal = 0;
        let taxTotal = 0;
        for (const item of this.cart.value.itemDetails) {
            subTotal += item.Amount;
            discountTotal += item.DiscountAmount;
            taxTotal += item.TaxAmount;
        }

        this.subTotal = subTotal;
        this.discountTotal = discountTotal;
        this.taxTotal = taxTotal;
        this.total = subTotal - discountTotal + taxTotal;

        // updating cart payment
        this.cart.value.PaymentDetails.TotalAmount = this.total;
    }


    emptyCart() {
        //     if (order.status !== 'DRAFT') {
        //         return;
        //     }
        //     const index = this.orders.indexOf(order);
        //     this.orders.splice(index, 1);
        //     this.updateCartItemCounter();
        //     this.recalculateCartTotals();
        //     this.saveToLocalStorage();
    }

    async placeOrder(): Promise<boolean> {
        try {

            // make new copy of the cart to update its item,
            // for the new copy we set status to be OrderPlaced
            const cartCopy = { ...this.cart.value };
            cartCopy.itemDetails = this.cart.value.itemDetails
                .filter((item) => item.ItemOrderStatus === null)
                .map(detail => ({ ...detail }));
            for (const item of cartCopy.itemDetails) {
                item.ItemOrderStatus = ItemOrderStatus.OrderPlaced;
            }
            const response = await this.http.post<string>(SERVER_URL + 'Cart', cartCopy).toPromise();
            if (response === 'OK') {
                this.orderIsPlaced();
                return true;
            }
        } catch (error) {
            console.log('Posting cart faield');
            throw error;
        }
    }

    private orderIsPlaced() {
        // updating order info
        const cart = this.cart.value;
        cart.order.OrderStatus = OrderStatus.InProgress;

        for (const item of cart.itemDetails) {
            item.ItemOrderStatus = ItemOrderStatus.OrderPlaced;
        }

        this.saveToLocalStorage();
    }

    private saveToLocalStorage() {
        window.localStorage.setItem('SHOPPING_CART', JSON.stringify(this.cart.value));
    }

    private loadCartFromLocalStorage() {
        const ordersString = window.localStorage.getItem('SHOPPING_CART');
        if (ordersString) {
            this.cart.next(JSON.parse(ordersString));
        }
    }

    private initCustomerId() {
        // will try to load customer id from local storage
        if (!this.customerId) {
            const storedValue = window.localStorage.getItem('CUSTOMER_ID');
            if (storedValue) {
                this.customerId = storedValue;
                console.log('customer id loaded from local storage');
                return;
            }
        }

        // if customer id not found we will generate new one
        this.customerId = shortid.generate();
        // store the newly genreated customer id on local storage
        window.localStorage.setItem('CUSTOMER_ID', this.customerId);
        console.log('customer id stored successfully');
    }

}
