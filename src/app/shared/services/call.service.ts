import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  public onCallStateChanged: BehaviorSubject<any>;
  @Output() callDataChange = new EventEmitter<any>();
  constructor() { 
    this.onCallStateChanged = new BehaviorSubject({});
  }

  newCallData(data){
    this.callDataChange.emit(data);
  }
}
