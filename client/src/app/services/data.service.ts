import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  static injector: Injector;
  public slotsSelect = [
    "8:00 - 8:20",
    "8:20 - 8:40",
    "8:40 - 9:00",
    "9:00 - 9:20",
    "9:20 - 9:40",
    "9:40 - 10:00",
    "10:00 - 10:20",
    "10:20 - 10:40",
    "10:40 - 11:00",
    "11:00 - 11:20",
    "11:20 - 11:40",
    "11:40 - 12:00",
    "12:00 - 12:20",
    "12:20 - 12:40",
    "12:40 - 13:00",
    "13:00 - 13:20",
    "13:20 - 13:40",
    "13:40 - 14:00",
    "14:00 - 14:20",
    "14:20 - 14:40",
    "14:40 - 15:00",
    "15:00 - 15:20",
    "15:20 - 15:40",
    "15:40 - 16:00",
    "16:00 - 16:20",
    "16:20 - 16:40",
    "16:40 - 17:00",
    "17:00 - 17:20",
    "17:20 - 17:40",
    "17:40 - 18:00",
    "18:00 - 18:20",
    "18:20 - 18:40",
    "18:40 - 19:00",
  ];
  public slots = new Subject<any>();

  sendSlots(slots) {
    this.slots.next(slots)
  }

  getSlots(): Observable<any> {
    return this.slots.asObservable();
  }

}
