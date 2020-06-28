import { Component, OnInit } from '@angular/core';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { StaffService } from 'src/app/services/staff.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {

  constructor(private _loaderService: LoaderServiceService,
    private _staffService: StaffService,
    private _userService: UserService) { }

  showStaffSearchDetails: boolean = false;
  bshowChangeManager: boolean = false;
  showManagerSearchDetail: boolean = false;

  staffId: string = null;
  managerId: string = null;

  staffSearhResult = null;
  managerSearhResult = null;
  perm:any = {}
  ngOnInit() {
    this.perm = this._userService.get_permission();
  }

  searchStaff() {
    if (!this.staffId)
      return alert('Please enter staff id to search!');
    this._loaderService.show();
    this._staffService.get_staff_reporting(this.staffId.toLowerCase()).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.staffSearhResult = data.data;
        console.log(data);
        this.showStaffSearchDetails = true;
        this.bshowChangeManager = false;
      } else {
        this.staffSearhResult = null;
        this.showStaffSearchDetails = false;
        this.bshowChangeManager = false;
        console.log('Error while fetching staff reportings', data);
      }
    }, (err) => {
      alert('Error while fetching the staff details!');
      console.log(err);
      this.showStaffSearchDetails = false;
      this.bshowChangeManager = false;
    })

  }

  clearStaffSearch() {
    this.staffId = null;
    this.staffSearhResult = null;
    this.showStaffSearchDetails = false;
    this.bshowChangeManager = false;
  }

  showChangeManager() {
    this.bshowChangeManager = true;
  }
  hideChangeManager() {
    this.bshowChangeManager = false;
  }

  searchManager() {
    if (!this.managerId)
      return alert('Please enter staff id of line manager!');
    this._loaderService.show();
    this._staffService.get_staff_dept_desg(this.managerId).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.managerSearhResult = data.data[0];
        console.log(this.managerSearhResult);
        this.showManagerSearchDetail = true;
      } else {
        this.showManagerSearchDetail = false;
        alert('Error while reading manager details!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      this.showManagerSearchDetail = false;
      alert('Error while reading manager details!');
      console.log(err);
    })
  }

  clearManagerSearch() {
    this.managerId = null;
    this.managerSearhResult = null;
    this.showManagerSearchDetail = false;
  }

  assign_manager() {
    if (!this.staffSearhResult || !this.managerSearhResult)
      return alert('Please search manager/staff details!');

    const ok = confirm(`Are you sure to map ${this.managerSearhResult.staff_name}  as manager of ${this.staffSearhResult.staff_details[0].staff_name} ?`);
    if (!ok)
      return;

    const mapping = {
      staff_id: this.staffSearhResult.staff_details[0].staff_id,
      manager_id: this.managerSearhResult.staff_id,
      mapped_from: moment(new Date()).format('YYYY-MM-DD'),
      mapped_by: this._userService.userDetails.staff_id
    }
    console.log(mapping)
    this._loaderService.show();
    this._staffService.assign_manager(mapping).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Manager mapping success!');
        this.clearManagerSearch();
        this.clearStaffSearch();
      } else {
        alert('Error while Manager mapping!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while Manager mapping!');
      console.log(err);
    })


  }


















  get_staff_hirarchy() {

  }


}
