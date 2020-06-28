import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-staff-details-dialog',
  templateUrl: './edit-staff-details-dialog.component.html',
  styleUrls: ['./edit-staff-details-dialog.component.css']
})
export class EditStaffDetailsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditStaffDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _departmentService: DepartmentService,
    private _staffService: StaffService,
    private _userService: UserService) {
    this.initialize_edit_staff_form();
    

    console.log(data);
  }
  edit_staff: FormGroup;
  department_form: FormGroup = new FormGroup({department: new FormControl(),
  designation: new FormControl(),});
  departments: any[];
  form_bound_departments: any[] = [];
  form_bound_designations: any[] = [];

  isDataUpdated: boolean = false;

  ngOnInit() {

    this._departmentService.get_departments().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.departments = data.data;
        console.log(this.departments);
        this.populate_form_bound_departments();
        this.initialize_department_form(this.data.department_id, this.data.designation_id);
      }
    });

  }

  populate_form_bound_departments(){
    this.form_bound_departments = this.departments.filter((current,index,array) => {
      return index === array.findIndex(x => 
          x.id_department === current.id_department
      )
    });
    console.log(this.form_bound_departments)
  }

  initialize_edit_staff_form() {
    this.edit_staff = new FormGroup({
      staff_id: new FormControl(this.data.staff_id, Validators.required),
      name: new FormControl(this.data.name, Validators.required),
      mobile: new FormControl(this.data.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      emergency_contact: new FormControl(this.data.emergency_contact),
      permanent_address: new FormControl(this.data.permanent_address, Validators.required),
      current_address: new FormControl(this.data.current_address, Validators.required),
      dob: new FormControl(new Date(this.data.dob), Validators.required),
      doj: new FormControl(new Date(this.data.doj)),
      // dob: new FormControl(moment(this.data.dob, 'YYYY-MM-DD').toDate(), Validators.required),
      married: new FormControl(this.data.married),
      spouse_detail: new FormControl(this.data.spouse_detail),
      bloodgroup: new FormControl(this.data.bloodgroup, Validators.required),
      gender: new FormControl(this.data.gender, Validators.required),
      email: new FormControl(this.data.email),
      past_med_history: new FormControl(this.data.past_med_history),
    })
  }

  initialize_department_form(dep, des) {
    console.log(dep, des);
    if(dep && des) {

      this.form_bound_designations = this.departments.filter(current =>  current.id_department === dep)

      this.department_form = new FormGroup({
        department: new FormControl(dep),
        designation: new FormControl(des),
      });
    } else {
      // this.form_bound_designation = (this.departments.filter(current => current._id === dep)[0]).designations;
      this.department_form = new FormGroup({
        department: new FormControl(),
        designation: new FormControl(),
      });
    }    
  }

  samePermanentCurrentAddress(val: boolean) {
    if (val) {
      this.edit_staff.patchValue({ current_address: this.edit_staff.value.permanent_address });
      // this.create_new_staff.controls['current_address'].disable();
    } else {
      this.edit_staff.patchValue({ current_address: null });
      // this.create_new_staff.controls['current_address'].enable();
    }
  }

  onDepartmentChange() {
    console.log(this.department_form.value['department']);
    this.form_bound_designations = this.departments.filter(current =>  current.id_department === this.department_form.value['department'])
  }

  close() {
    this.dialogRef.close({data: this.isDataUpdated});
  }

  
  updatePersonalDetails() {
    const updatedValue = {...this.edit_staff.value, modified_by : this._userService.userDetails.staff_id};
    updatedValue.dob = moment(this.edit_staff.value.dob).format('YYYY-MM-DD');
    
    console.log(updatedValue);
    this._staffService.update_staff_details(this.data.id_staff, updatedValue).subscribe((data: any) => {
      if(data.success) {
        alert('Personal Details Updated Successfully!');
        this.isDataUpdated = true;
      } else {
        alert('Error while updating personal details!');
        console.log(data);
        this.isDataUpdated = false;
      }
    }, (err) => {
      console.log('Error while updating personal details!');
      console.log(err);
    })
  }

  updateDepartmentDetails() {
    console.log(this.department_form.value);
    if (this.department_form.value.department && this.department_form.value.designation) {
      
      const updatedValue = {
        department_id : this.department_form.value.department,
        designation_id: this.department_form.value.designation,
        modified_by : this._userService.userDetails.staff_id
      }

      this._staffService.update_staff_department(this.data.id_staff, updatedValue)
        .subscribe((data: any) => {
          if(data.success) {
            alert('Department Details Updated Successfully!');
            this.isDataUpdated = true;
          } else {
            alert('Error while updating department details!');
            console.log(data);
            this.isDataUpdated = false;
          }
        }, (err) => {
          console.log('Error while updating personal details!');
          console.log(err);
        })
    }
  }
}
