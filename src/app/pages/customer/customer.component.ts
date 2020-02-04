import { AlertService } from './../../services/alert/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogModel, AlertComponent } from '../alert/alert.component';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swall: SweetAlert = _swal as any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  public dialogRef: MatDialogRef<AlertComponent>;
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
  order: any = {};
  public error: any;
  public success: any;
  public popoverTitle = 'Cancel Order';
  public popoverMessage = 'Are You Sure To Cancel Order';

  constructor(
    private cartservice: CartService,
    private localStorage: LocalStorageService,
    private router: Router,
    private loaderService: LoaderService,
    private api: ApiService,
    public alertservice: AlertService,
    public dialog: MatDialog,
    ) {
      this.loaderService.display(true);
      this.meals = this.localStorage.get('cacheMeals');
      this.api.getData('menus/1').subscribe(data => {
        console.log('success', '1');
        swall('Loading Finished');
        this.loaderService.display(true);
        this.meals = data;
        this.loaderService.display(false);
        this.localStorage.set('cacheMeals', this.meals);
      },
      (
        error  => {
        swall('Oops!', 'Something went wrong!', 'error');
        this.loaderService.display(false);
        console.log('Error occured.');
        this.error = error;
     }));
      this.loaderService.display(true);
      this.tables = this.localStorage.get('tables');
      this.api.getData('tables/1').subscribe(data => {
        console.log('success', '1');
        this.loaderService.display(true);
        this.tables = data;
        this.loaderService.display(false);
        this.localStorage.set('tables', this.tables);
      },
      (
        error => {
        this.loaderService.display(false);
        console.log('Error occured.');
        this.error = error;
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
      const message = `Are you sure you want to do this?`;
      const dialogData = new ConfirmDialogModel('Place Order', message);
      const dialogRef = this.dialog.open(AlertComponent, {
          disableClose: false,
          maxWidth: '400px',
          data: dialogData
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // do confirmation actions
          this.loaderService.display(true);
          this.order.TableRID  = this.cart.TableRID;
          this.order.CompanyID = this.cart.CompanyID;
          this.order.MenuRID = this.cart.MenuRID;
          this.order.CategoryRID = this.cart.CategoryRID;
          this.order.Quanity = this.cart.Quanity;
          this.order.Amount = this.cart.Amount;
          this.api.postData('Cart', this.order)
          .subscribe(
            data => {
            console.log('buy', '1');
            this.localStorage.set('orders', data.order);
            console.log(data.order, 'buycart');
            this.loaderService.display(false);
            swall('Data Inserted Sucfully');
            this.cartservice.clear();
            this.router.navigate(['/']);
          },
            (
              error => {
                this.loaderService.display(false);
                swall('Oops!', 'Something went wrong!', 'error');
                console.log('Error occured.');
                this.error = error;
          })
          );
      }
        this.dialogRef = null;
    });
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
