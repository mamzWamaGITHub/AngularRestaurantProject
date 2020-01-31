import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private data: any = {};
    private url = 'https://matger-tutia.com/api/';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    constructor(
    private http: HttpClient
      ) {
    }
    private Data(res: Response) {
      const body = res;
      console.log(body);
      return body || {};
    }
    getData(endpoint: string, data: {} = {}): Observable<any> {
      const fullUrl: string = this.url + endpoint;
      return this.http.post(fullUrl, {
        data
      }, this.httpOptions).pipe(
        map(this.Data)
      );
    }
}
