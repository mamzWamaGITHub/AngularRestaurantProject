import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, startWith } from 'rxjs/operators';

import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private data: any;
  private url = 'http://aa.calibrecue.com/api/';
  //private url = 'http://localhost:52161/api/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };
  constructor(
    private http: HttpClient,
  ) {

  }
  private Data(res: Response) {
    const body = res;
    return body || {};
  }
  getData<T>(endpoint: string): Observable<T> {
    const fullUrl: string = this.url + endpoint;
    return this.http.get<T>(fullUrl);
  }
  postData(endpoint: string, data, headers): Observable<any> {
    const fullUrl: string = this.url + endpoint;
    return this.http.post(fullUrl,
      JSON.stringify(data), headers);
  }


  postMulitipleData(endpoint: string, pdata, headers): Observable<any> {
    const fullUrl: string = this.url + endpoint;
    //console.debug(pdata);

    var order = {
      TableRID: pdata.TableRID,
      RID: 0,
      CompanyID: 1,
      CustomerName: 'ateeq',
      CustomerMobile: '343',
      CustomerEmailAddress: 'ateeq@ateeq.com',
      UserName: 'ateeq'
    };


    console.log('item order' + order);
    console.log('item details' + pdata.items);
    console.log('item details details [0]' + pdata.items.itemDetails);
    var itemDetails = pdata.items.itemDetails;
    // var itemDetails = {
    //   MenuRID: pdata.itemDetails.MenuRID,

    // };
    // console.debug('item details' + itemDetails);
    console.log('itemDetails start here');
    console.log(pdata.itemDetails);
    // var  itemDetails = {  itemDetails  }
    var PaymentDetails = { PaymentDetails }
    let result = { order, itemDetails, PaymentDetails };
    // console.debug(result);
    console.log(result);
    return this.http.post(fullUrl, result, headers);
  }


  public handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    console.log('Server Error!');
    return Observable.throw(errMsg);
  }
}
