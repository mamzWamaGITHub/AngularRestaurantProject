import { LoaderService } from './services/loader/loader.service';
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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    // MatProgressSpinnerModule,
    HttpClientModule,
    StorageServiceModule,
    AppRoutingModule,
  ],
  providers: [
    LocalStorageService,
    ApiService,
    CartService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
