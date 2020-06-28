import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-department-dialog',
  templateUrl: './new-department-dialog.component.html',
  styleUrls: ['./new-department-dialog.component.css']
})
export class NewDepartmentDialogComponent implements OnInit {

  new_department_form: FormGroup;
  isDepartmentCreated: boolean = false;
  dataFromParent: any;
  constructor(public dialogRef: MatDialogRef<NewDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: LoaderServiceService,
    private _departmentService: DepartmentService,
    private _userService: UserService) { this.dataFromParent = data }
  
  isSubDepartment: boolean = false;
  ngOnInit() {
    this.initialize_new_department_form();
    console.log(this.dataFromParent);
  }

  changeSubDepartmentToggle(){
    this.isSubDepartment = !this.isSubDepartment;
    // console.log(this.isSubDepartment);
    this.new_department_form.patchValue({parent_department: null});
  }

  initialize_new_department_form(): void {
    this.new_department_form = new FormGroup({
      name: new FormControl(),
      department_id: new FormControl(),
      isSubDepartment: new FormControl(false),
      parent_department: new FormControl(),
      designations: new FormArray([this.new_designation_row()]),
    })
  }

  add_new_designation(): void {
    (<FormArray>this.new_department_form.get("designations")).push(
      this.new_designation_row()
    );
  }

  delete_designation(i: number): void {
    (<FormArray>this.new_department_form.get("designations")).removeAt(i);
  }

  new_designation_row(): FormGroup {
    return new FormGroup({
      designation_name: new FormControl(),
      designation_id: new FormControl(),
    });
  }

  save_department() {
    console.log(this.new_department_form.value);
    if(this.new_department_form.value.isSubDepartment && !this.new_department_form.value.parent_department)
      return alert('Please select parent department!');
    
    const designation_ok = this.new_department_form.value.designations.every(current => {
      return current.designation_id !== null && current.designation_name !== null ;
    });
    if(!designation_ok)
      return alert('Please fill designation name and designation id!');
    console.log(designation_ok);

    this._loaderService.show();
    const newdepartment = {...this.new_department_form.value};
    newdepartment.created_by = this._userService.userDetails.staff_id;
    this._departmentService.create_department(newdepartment).subscribe((data: any) => {
      console.log(data);
      if(data.success) {
        this._loaderService.hide();
        alert('New Department saved successfully');
        this.closeDialog(true);
      } else {
        this._loaderService.hide();
        alert('New Department was not saved');
        this.closeDialog(false);
      }
    }, err => {
      this._loaderService.hide();
      alert('Error saving department');
      console.log('Error saving department :: ',  err);
    })
  }

  closeDialog(data: boolean) {
    this.dialogRef.close({ data });
  }

}
