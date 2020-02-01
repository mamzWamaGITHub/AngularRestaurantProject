import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  meals: any = [];
  cart: any  = [];
  showcats = false;
  showorders = false;
  showcart = true;
  mealname: any = [];
  mealid: any = {};
  subcats: any = {};
  constructor(
    public cartservice: CartService,
    private localStorage: LocalStorageService,
    private router: Router,
    public api: ApiService,
    ) {
      this.meals = this.localStorage.get('cacheMeals');
      this.api.getData('menus/1').subscribe(data => {
        this.meals = data;
        this.localStorage.set('cacheMeals', this.meals);
      });
   }

  ngOnInit() {
    this.cart = this.cartservice.getCart();
  }
  showCats(meal) {
    this.showcats = true;
    this.showcart = true;
    this.mealname = meal.DishName;
    this.mealid = meal.DishID;
    this.subcats =  meal.DishCategories.map(elm => {
       return elm;
    });
  }
  increaseCount(item) {
    this.cartservice.increaseCount(item);
  }
  decreaseCount(item) {
      this.cartservice.decreaseCount(item);
  }
  cancelOrder() {
    this.cart = [];
    this.cartservice.clear();
    this.localStorage.remove('cart');
  }
  palceOrder() {
    
  }
}
