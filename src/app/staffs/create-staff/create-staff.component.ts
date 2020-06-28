import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { StaffService } from 'src/app/services/staff.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.css']
})
export class CreateStaffComponent implements OnInit {

  constructor(private _staffService: StaffService, 
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }
  create_new_staff: FormGroup;
  isStaffSaved = false;
  savedStaff;
  updateStaff = false;
  ngOnInit() {
    this.initialize_create_new_staff_form();
  }

  initialize_create_new_staff_form(): void {
    this.create_new_staff = new FormGroup({
      staff_id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      emergency_contact: new FormControl(),
      permanent_address: new FormControl(null, Validators.required),
      current_address: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      married: new FormControl(false),
      spouse_detail: new FormControl(null),
      bloodgroup: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      past_med_history: new FormControl(),
      doj: new FormControl()
    })
  }

  initialize_edit_staff_form(): void {
   console.log(moment(this.savedStaff.dob, 'DD-MM-YYYY').toDate());

    this.create_new_staff.patchValue({
      staff_id: this.savedStaff.staff_id,
      name: this.savedStaff.name,
      mobile: this.savedStaff.mobile,
      emergency_contact: this.savedStaff.emergency_contact,
      permanent_address: this.savedStaff.permanent_address,
      current_address: this.savedStaff.current_address,
      dob:  new Date(this.savedStaff.dob),
      married: this.savedStaff.married,
      spouse_detail: this.savedStaff.spouse_detail,
      bloodgroup: this.savedStaff.bloodgroup,
      gender: this.savedStaff.gender,
      email: this.savedStaff.email,
      past_med_history: this.savedStaff.past_med_history,
      doj: new Date(this.savedStaff.doj),
    })
  }

  save() {
    this._loaderService.show();
    this.create_new_staff.value.dob = moment(this.create_new_staff.value.dob).format('YYYY-MM-DD');
    this.create_new_staff.value.doj = moment(this.create_new_staff.value.doj).format('YYYY-MM-DD');
    console.log(this.create_new_staff.value);
    const newStaff = {...this.create_new_staff.value};
    newStaff.created_by = this._userService.userDetails.staff_id;
    this._staffService.save_staff_details(newStaff).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('New Staff created successfully!');
        console.log(data);
        this.isStaffSaved = true;
        this.savedStaff = data.data;
        this.create_new_staff.reset();
      } else {
        alert('Error while creating new staff!');
        console.log('Error while saving data :: ' + data);
      }
    }, err => {
      alert('Error while creating new staff!');
      this._loaderService.hide();
      console.log(err);
    })
  }

  clear() {
    this.create_new_staff.reset();
    this.isStaffSaved = false;
    this.updateStaff = false;
  }

  samePermanentCurrentAddress(val: boolean) {
    if (val) {
      this.create_new_staff.patchValue({ current_address: this.create_new_staff.value.permanent_address });
      // this.create_new_staff.controls['current_address'].disable();
    } else {
      this.create_new_staff.patchValue({ current_address: null });
      // this.create_new_staff.controls['current_address'].enable();
    }
  }

  editAlreadySavedStaff() {
    this.initialize_edit_staff_form();
    this.isStaffSaved = false;
    this.updateStaff = true;
  }

  updateAlreadySavedStaff() {
    this._loaderService.show();
    const id = this.savedStaff.id_staff;
    this.create_new_staff.value.dob = moment(this.create_new_staff.value.dob).format('YYYY-MM-DD');
    this.create_new_staff.value.doj = moment(this.create_new_staff.value.doj).format('YYYY-MM-DD');
    console.log(id, this.create_new_staff.value);
    this._staffService.update_staff_details(id, this.create_new_staff.value).subscribe((data: any ) => {
      console.log(data);
      if(data.success) {
        this.isStaffSaved = true;
        this.updateStaff = false;
        this.savedStaff = data.data;
        this.create_new_staff.reset();
      } else {
        console.log('Error while updating :: ' + data);
      }
    }, err => console.log(err));
    this._loaderService.hide();
  }
}
