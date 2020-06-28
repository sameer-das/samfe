import { Component, OnInit } from "@angular/core";
import { LoaderServiceService } from "../services/loader-service.service";
import { Router } from "@angular/router";
import { MatTabChangeEvent } from '@angular/material';
import { UserService } from '../services/user.service';

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.css"]
})
export class StudentsComponent implements OnInit {
  constructor( 
    private _userService: UserService
  ) {}
  perm : any = {}

  ngOnInit() {
    this.perm = this._userService.get_permission();
    
    // this._loaderService.show();
    // setTimeout(() => {
    //   this._loaderService.hide();
    // },5000)
  }
  selectedTab: number;
  tabChanged(tabChangedEvent: MatTabChangeEvent): void {
    this.selectedTab = tabChangedEvent.index;
    console.log(this.selectedTab);
  }

}
