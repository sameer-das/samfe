import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { LoaderServiceService } from '../services/loader-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private _router: Router,
    private _userService: UserService,
    private _loaderService: LoaderServiceService) { }
  change_password: FormGroup;
  ngOnInit() {
    this.change_password = new FormGroup({
      userid: new FormControl(null, [Validators.required]),
      current_password: new FormControl(null, [Validators.required]),
      new_password: new FormControl(null, [Validators.required]),
    })
  }

  goToLogin() {
    this._router.navigate(['login']);
  }

  change_psw(){
    console.log(this.change_password.value);
    this._loaderService.show();
    this._userService.change_password(this.change_password.value).subscribe((data: any) => {
      this._loaderService.hide();
      if(data.success) {
        alert('Password changed successfully!');
        this.change_password.reset();
      } else {
        alert('Error while changing the password!');
        console.log(data);
      }

    }, err => {
      this._loaderService.hide();
      console.log(err)
      if(err.staus == 401) {
        return alert('Current Password did not match!');
      } else {
        return alert('Error while changing the password!');
      }
    })
  }



}
