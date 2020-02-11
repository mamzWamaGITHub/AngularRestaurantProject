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
import { RequestOptions, Headers } from '@angular/http';

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
  order: any  = {
  };
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
  items: any = [];
  public error: any;
  public success: any;
  dish: any;
  public popoverTitle = 'Delete Order';
  public popoverMessage = 'Are you sure to delete order';
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
      // this.meals = this.localStorage.get('cacheMeals');
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
      this.order = this.cartservice.getCart();
  }
  showCats(meal) {
    this.showcats = true;
    this.mealname = meal.DishName;
    swall('You Selected The Dish' +  '    '    + (this.mealname));
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
    swall({
      title: 'Are you sure?',
      text: 'Are you sure to cancel order?',
      icon: 'warning',
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.cartservice.clear();
        this.router.navigate(['/']);
        swall('Canceled!', 'Your imaginary item has been canceled!', 'success');
        window.location.reload();
      }
    });
  }
  palceOrder(item): void {
      console.log(item);
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
          this.order.TableRID  = item.TableRID;
          this.order.CompanyID = item.CompanyID;
          this.order.MenuRID = item.MenuRID;
          this.order.CategoryRID = item.item.CategoryId;
          this.order.Quanity = item.item.Quanity;
          this.order.Amount = item.item.Amount + item.item.Tax;
          this.order.CustomerRID = this.order.CustomerRID;
          this.order.CartID = this.order.CartID;
          console.log(this.order, 'order');
          const headers = new Headers();
          headers.append('Content-Type', 'application/json');
          const options = new RequestOptions({headers});
          swall('The order in progress');
          this.api.postData('Cart', this.order, options).subscribe(
            data => {
            this.localStorage.set('orders', data);
            this.loaderService.display(false);
            swall('Data Inserted Sucfully');
            this.cartservice.clear();
            this.router.navigate(['/']);
            window.location.reload();
          },
          error => {
                this.loaderService.display(false);
                swall('Oops!', 'Something went wrong!', 'error');
                console.log('Error occured.');
                this.error = error;
          }
        );
      }
        this.dialogRef = null;
    });
  }
  showTable() {
    this.showtable = true;
  }
  selectDish(table) {
    this.showdish = true;
    this.showtable = false;
    this.tablename = table.TableName;
    // this.order.items = this.order.items.filter(elm =>  elm.TableRID === table.RID);
  }
}
