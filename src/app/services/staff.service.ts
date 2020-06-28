import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private _http: HttpClient) { }
  url = 'http://localhost:3000';

  save_staff_details(staff_data) {
    return this._http.post(this.url + '/staff', staff_data);
  }

  update_staff_details(id, updateddoc) {
    return this._http.patch(this.url + '/staff/' + id, updateddoc);
  }

  update_staff_department(id, updateddoc) {
    return this._http.patch(this.url + '/staff/department/' + id, updateddoc);
  }

  get_staffs() {
    return this._http.get(this.url + '/staffs');
  }

  get_staff(staff_id) {
    return this._http.get(this.url + '/staff?staff_id=' + staff_id);
  }

  get_all_documents(id_staff) {
    return this._http.get(this.url + '/staff/documents/' + id_staff);
  }
  check_avatar(id) {
    return this._http.get(this.url + '/avatar/check/staff/' + id);
  }
  download_file(uniqid) {
    return this._http.get(this.url + '/download/' + uniqid);
  }

  get_staff_dept_desg(staff_id) {
    return this._http.get(this.url + '/staffdeptdesg?staff_id=' + staff_id);
  }

  get_staff_reporting(staff_id) {
    return this._http.get(this.url + '/staffreporting?staff_id=' + staff_id);
  }

  assign_manager(mapping) {
    return this._http.post(this.url + '/assignmanager', mapping);
  }
}
