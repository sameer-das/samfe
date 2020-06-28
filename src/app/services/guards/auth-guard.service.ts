import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private _jwtHelperService: JwtHelperService, private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    if(token && !this._jwtHelperService.isTokenExpired(token)) {
      console.log('Token Ok!');
      return true;
    } else {
      //token expired or toekn not available
      console.log('Token Expired!');
      this._router.navigate(['login']);
      return false;
    }
  }
}
