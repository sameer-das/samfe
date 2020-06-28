import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class LoaderServiceService {
  constructor() {}
  subject = new Subject<boolean>();
  show() {this.subject.next(true);}

  hide() {this.subject.next(false);}
}
