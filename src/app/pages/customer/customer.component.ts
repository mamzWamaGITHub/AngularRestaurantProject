import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  meals: any = [];
  cart: any  = [];
  showcats = false;
  showcart = true;
  mealname: any = [];
  mealid: any = {};
  subcats: any = {};
  data: any = {
    cart: {}
  };
  order: any = {
    customername: 'One',
    tableno:  '4',
    status: 'Pending'
  };
  public popoverTitle = 'Cancel Order';
  public popoverMessage = 'Are You Sure To Cancel Order';
  constructor(
    public cartservice: CartService,
    private localStorage: LocalStorageService,
    private router: Router,
    private loaderService: LoaderService,
    public api: ApiService,
    ) {
      this.loaderService.display(true);
      this.meals = this.localStorage.get('cacheMeals');
      this.api.getData('menus/1').subscribe(data => {
        this.loaderService.display(true);
        this.meals = data;
        this.loaderService.display(false);
        this.localStorage.set('cacheMeals', this.meals);
      },
      (
        (err: HttpErrorResponse) => {
        this.loaderService.display(false);
        console.log('Error occured.');
     }));
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
    this.cartservice.clear();
    this.router.navigate(['/']);
  }
  palceOrder() {
    this.data.cart = this.cart;
    this.api.postData('buy', this.data)
    .subscribe(data => {
      this.loaderService.display(true);
      this.localStorage.set('orders', data.data);
      console.log(data.data, 'buycart');
      this.loaderService.display(false);
      this.cartservice.clear();
      this.router.navigate(['/']);
    },
      (
        (err: HttpErrorResponse) => {
          this.loaderService.display(false);
          console.log('Error occured.');
    })
    );
  }
}
