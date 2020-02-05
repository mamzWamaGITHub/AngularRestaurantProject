import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, startWith } from 'rxjs/operators';
import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private data: any ;
    private url = 'http://aa.calibrecue.com/api/';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
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
    getData(endpoint: string): Observable<any> {
      const fullUrl: string = this.url + endpoint;
      return  this.http.get(fullUrl).pipe(
        map(this.Data)
      );
    }
    postData(endpoint: string, data, headers): Observable<any> {
      const fullUrl: string = this.url + endpoint;
      return this.http.post(fullUrl,
        data, this.httpOptions);
    }

    public handleError(error: any) {
      const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg);
      console.log('Server Error!');
      return Observable.throw(errMsg);
    }
}
