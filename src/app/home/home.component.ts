import { Component, OnInit } from '@angular/core';
import { LoaderServiceService } from '../services/loader-service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _loaderService: LoaderServiceService, private _userService: UserService) { }
  opened = false;
  perm: any;
  ngOnInit() {
    this.perm = this._userService.get_permission();
    // console.log(this.perm);    
  }
  onSideNavOpen(){
    // console.log('Side Nav Opened');
  }

  onSideNavClose(){
    // console.log('Side Nav Closed');
  }

  logout(){
    localStorage.removeItem('token');
  }

}
