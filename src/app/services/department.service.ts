import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/global';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http: HttpClient,  private _global: Global) { }
  // url = 'http://localhost:3000';
  url: string = this._global.ServiceBaseURL;

  get_departments() {
    return this._http.get(this.url + '/department')
  }

  create_department(newDepartment) {
    return this._http.post(this.url + '/department', newDepartment);
  }

  update_department(updated_department) {
    return this._http.patch(this.url + '/department', updated_department);
  }

}
