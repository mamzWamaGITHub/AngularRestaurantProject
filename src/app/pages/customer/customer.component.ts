import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  meals: any = [];
  tables: any = [];
  cart: any  = [];
  showcats = false;
  showtable = true;
  showdish = false;
  mealname: any = {};
  tablename: any;
  mealid: any = {};
  subcats: any = {};
  data: any = {
    customername: 'One',
    status: 'Pending'
  };
  order: any = {

  };
  public popoverTitle = 'Cancel Order';
  public popoverMessage = 'Are You Sure To Cancel Order';
  constructor(
    private cartservice: CartService,
    private localStorage: LocalStorageService,
    private router: Router,
    private loaderService: LoaderService,
    private api: ApiService,
    public dialog: MatDialog,
    private alertservice: AlertService,
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
        error  => {
        this.loaderService.display(false);
        console.log('Error occured.');
     }));
      this.loaderService.display(true);
      this.tables = this.localStorage.get('tables');
      this.api.getData('tables/1').subscribe(data => {
        this.loaderService.display(true);
        this.tables = data;
        this.loaderService.display(false);
        this.localStorage.set('tables', this.tables);
      },
      (
        error => {
        this.loaderService.display(false);
        console.log('Error occured.');
     }));
    }
    ngOnInit() {
      this.cart = this.cartservice.getCart();
  }
  showCats(meal) {
    this.showcats = true;
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
  palceOrder(): void {
      // const message = `Are you sure you want to do this?`;
      // const dialogData = new ConfirmDialogModel('Place Order', message);
      // const dialogRef = this.dialog.open(AlertComponent, {
      //   maxWidth: '400px',
      //   data: dialogData
      // });
      this.order.TableRID  = this.cart.TableRID;
      this.order.CompanyID = this.cart.CompanyID;
      this.order.MenuRID = this.cart.MenuRID;
      this.order.CategoryRID = this.cart.CategoryRID;
      this.order.Quanity = this.cart.Quanity;
      this.order.Amount = this.cart.Amount;
      this.api.postData('Cart', this.order)
      .subscribe(
        data => {
        this.loaderService.display(true);
        this.localStorage.set('orders', data.order);
        console.log(data.order, 'buycart');
        this.loaderService.display(false);
        this.cartservice.clear();
        this.router.navigate(['/']);
      },
        (
          error => {
            this.loaderService.display(false);
            console.log('Error occured.');
      })
      );
  }
  showTable() {
    this.showtable = !this.showtable;
  }
  selectDish(table) {
    this.showdish = true;
    this.showtable = false;
    this.tablename = table.TableName;
  }
}
