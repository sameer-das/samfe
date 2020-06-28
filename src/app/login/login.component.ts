import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RoleGuardService } from '../services/guards/role-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _router: Router, private _userService: UserService) { }
  message: string;
  islogingIn: boolean = false;
  ngOnInit() {
    this.message = null;
  }
  login(f: NgForm) {
    this.message = 'Logging in, please wait!';
    this.islogingIn = true;
    const credentials = {
      username: f.value.userid.toLowerCase().trim(),
      password: f.value.password
    }

    this._userService.login(credentials).subscribe((data: any) => {
      this.islogingIn = false;
      if (data.success) {
        // console.log(data);
        this.message = null;
        localStorage.setItem('token', data.data);
        this._userService.set_permission();
        switch(this._userService.userDetails.type){
          case 'admin': {
            this._router.navigate(['/home']);
            break;
          }
          case 'student': {
            this._router.navigate(['/home/students']);
            break;
          }
          case 'staff': {
            this._router.navigate(['/home/staffs']);
            break;
          }
          default: { 
            this._router.navigate(['/home']);
            break; 
         }
        }

      }
    }, (err) => {
      this.islogingIn = false;
      if (err.status === 401)
        this.message = 'Authentication Failed!';
      else if (err.status === 404)
        this.message = 'User Not Found!';
      else
        this.message = 'Error while authenticating!';
    })
  }

}
