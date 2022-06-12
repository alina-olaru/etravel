import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private _displayLoading = new BehaviorSubject<boolean>(false);
  displayLoanding$ = this._displayLoading.asObservable();
  constructor() { }
  hide(){
    this._displayLoading.next(false);
  }
  show(){
    this._displayLoading.next(true);
  }
}
