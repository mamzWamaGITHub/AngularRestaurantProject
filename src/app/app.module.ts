import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomerComponent } from './pages/customer/customer.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { LocalStorageService } from './services/storage/storage.service';
import { ApiService } from './services/api/api.service';
import { CartService } from './services/cart/cart.service';
import { LoaderComponent } from './pages/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StorageServiceModule,
    AppRoutingModule,
  ],
  providers: [
    LocalStorageService,
    ApiService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
