import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }
  url = "http://localhost:3000";
  token = null;
  private permission = {
    permission_staff: '0',
    permission_student: '0',
    permission_academics: '0',
    permission_policy: '0',
    permission_notice: '0',
    permission_library: '0',
    permission_usermanagement: '0',
    permission_studentenquiry: '0'
  }

  userDetails: any = {};

  load_token() {
    this.token = localStorage.getItem('token');
    // console.log(this.token)
  }

  login(credentials) {
    return this._http.post(this.url + '/user/login', credentials);
  }

  create_role(role) {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    // headers.set('Authorization', 'Bearer ' + this.token);
    return this._http.post(this.url + '/role', role, { headers: headers });
  }

  get_roles() {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this._http.get(this.url + '/roles', { headers: headers });
  }

  update_role(role) {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this._http.patch(this.url + '/role', role, { headers: headers });
  }

  get_user_role(user_id) {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this._http.get(this.url + '/role?user_id=' + user_id, { headers: headers });
  }

  create_user(user) {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this._http.post(this.url + '/user', user, { headers: headers });
  }

  update_role_mapping(role) {
    this.load_token();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this._http.patch(this.url + '/rolemapping', role, { headers: headers });

  }

  change_password(data) {
    return this._http.post(this.url + '/changepassword', data);
  }
  reset_password(data) {
    return this._http.post(this.url + '/resetpassword', data);
  }

  set_permission() {
    const token: any = localStorage.getItem('token');
    if (token) {
      const decodedToken = decode(token);
      // console.log(decodedToken);
      const perm = decodedToken.userAuthDetails.permission;
      this.userDetails = decodedToken.userDetails ? decodedToken.userDetails : { staff_id: 'ADMIN', type: 'admin' };

      console.log(this.userDetails);
      let type = decodedToken.userDetails ? decodedToken.userDetails.type : 'staff';
      this.parse_permission(perm, type);
    } else {
      // console.log('Token not found!');
      localStorage.removeItem('token');
    }
  }

  get_permission() {
    this.permission = {
      permission_staff: '0',
      permission_student: '0',
      permission_academics: '0',
      permission_policy: '0',
      permission_notice: '0',
      permission_library: '0',
      permission_usermanagement: '0',
      permission_studentenquiry: '0'
    }
    this.set_permission();
    return this.permission;
  }

  parse_permission(permission, type = 'staff') {
    let arr = permission.split('');
    if (type === 'staff')
      this.permission.permission_staff = '0.2';

    if (arr[0] > 0)
      this.permission.permission_staff = arr[0];

    if (type === 'student')
      this.permission.permission_student = '0.2';

    if (arr[1] > 0)
      this.permission.permission_student = arr[1];

    this.permission.permission_academics = arr[2];
    this.permission.permission_policy = arr[3];
    this.permission.permission_notice = arr[4];
    this.permission.permission_library = arr[5];
    this.permission.permission_usermanagement = arr[6];
    this.permission.permission_studentenquiry = arr[7] ? arr[7] : '0';


  }
}
