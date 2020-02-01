import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
  display(value: boolean) {
    console.log('LoaderService.display ' + value);
    this.status.next(value);
}
}
