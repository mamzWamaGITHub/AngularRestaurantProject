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
  meals: any = [
    {
      id: 1,
      name: 'Biryani',
      image: 'assets/dummy/images/bri.jpg',
      subcategories: [
        {id: 1, name: 'Family', price: 500, tax: 50, disc: 0, quantity: 2, mealname: 'Biryani' },
        {id: 2, name: 'Plate', price: 300, tax: 50, disc: 0, quantity: 1,  mealname: 'Biryani'  },
        {id: 3, name: 'Half Plate', price: 200, tax: 50, disc: 0, quantity: 1, mealname: 'Biryani'  }
      ]
    },
    {
    id: 2,
    name: 'Burger' ,
    image: 'assets/dummy/images/bur.jpg' ,
    subcategories: [
      {id: 1, name: 'Large', price: 100, tax: 20, disc: 0, quantity: 1, mealname: 'Burger'  },
      {id: 2, name: 'Medium', price: 80, tax: 20, disc: 0, quantity: 1, mealname: 'Burger'  },
      {id: 3, name: 'Smal', price: 50, tax: 20, disc: 0, quantity: 1, mealname: 'Burger'  }
    ]
  },
    {
      id: 3,
      name: 'Pizza',
      image: 'assets/dummy/images/piz.jpg',
      tax: 0,
      disc: 0,
      quantity: 1,
      subcategories: []
    },
    {
      id: 4,
      name: 'Dish4',
      image: 'assets/dummy/images/bri.jpg',
      tax: 0,
      disc: 0,
      quantity: 1,
      subcategories: []
    },
    {
      id: 5,
      name: 'Dish5',
      image: 'assets/dummy/images/bri.jpg',
      tax: 0,
      disc: 0,
      quantity: 1,
      subcategories: []
    },
    {
      id: 6,
      name: 'Dish6',
      image: 'assets/dummy/images/bri.jpg',
      tax: 0,
      disc: 0,
      quantity: 1,
      subcategories: []
    },
    {
      id: 7,
      name: 'Dish7',
      image: 'assets/dummy/images/bri.jpg',
      tax: 0,
      disc: 0,
      quantity: 1,
      subcategories: []
    },
  ];

  cart: any  = [];
  showcats = false;
  showorders = false;
  mealname: any = {};
  mealid: any = {};
  subcats: any = {};
  constructor(
    public cartservice: CartService,
    private localStorage: LocalStorageService,
    private router: Router,
    public api: ApiService
    ) {
      // this.api.getData('getitems').subscribe(data => {this.meals    = data;  console.log(data, 'LL'); });
   }

  ngOnInit() {
    this.cart = this.cartservice.getCart();
  }
  showCats(meal) {
    this.showcats = true;
    this.mealname = meal.name;
    this.mealid = meal.id;
    this.subcats =  meal.subcategories.map(elm => {
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
    this.showorders = false;
    this.cartservice.clear();
    this.localStorage.remove('cart');
  }
  palceOrder() {
  }
  // go() {
  //   this.router.navigate(['loder']);
  // }
}
