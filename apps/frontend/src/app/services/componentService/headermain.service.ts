import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeadermainService {

  constructor() { }

  public status: Subject<boolean> = new Subject<boolean>();

  public Show(): void {
    this.status.next(true);
  }

  public Hide(): void {
    this.status.next(false);
  }

  public GetStatus(): Observable<boolean> {
    return this.status;
  }
}
