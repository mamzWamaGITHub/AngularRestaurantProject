import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

// key that is used to access the data in local storageconst
// const STORAGE_KEY = 'local_todolist';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public STORE_LOCALSTORAGE = window.localStorage;

  public storeType: any = this.STORE_LOCALSTORAGE;

  // anotherTodolist = [];
  constructor(
  @Inject(LOCAL_STORAGE)
  private storage: StorageService
  ) {

  }
  // public storeOnLocalStorage(taskTitle: string): void {
  //      const currentTodoList = this.storage.get(STORAGE_KEY) || [];
  //      currentTodoList.push({
  //          title: taskTitle,
  //          isChecked: false
  //      });
  //      this.storage.set(STORAGE_KEY, currentTodoList);
  //      console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
  // }
  public isSet(key) {
    return this.storeType.getItem(key) !== null;
  }
  public set(key, val) {
    const obj = {
        type: val instanceof Date
            ? 'date'
            : typeof val,
        value: val
    };
    this.storeType.setItem(key, JSON.stringify(obj));
  }
  public get(key) {
      if (!this.isSet(key)) {
          return undefined;
      }
      const obj = JSON.parse(this.storeType.getItem(key));
      if (obj.type === 'date') {
          return new Date(obj.value);
      }
      return obj.value;
  }
  public clear() {
    this.storeType.clear();
  }
  public remove(key) {
      const keys = (key instanceof Array)
          ? key
          : [key];
      // tslint:disable-next-line:no-shadowed-variable
      keys.map((key) => {
          this.storeType.removeItem(key);
      });
  }
}
