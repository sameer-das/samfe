import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.css']
})

export class StaffsComponent implements OnInit {

  constructor(private _userService: UserService) { }
  perm: any = {};
  ngOnInit() {
    this.perm = this._userService.get_permission();
  }

  selectedTab;


  tabChanged(tabChangedEvent: MatTabChangeEvent): void {
    this.selectedTab = tabChangedEvent.index;
    console.log(this.selectedTab);
  }

 
}
