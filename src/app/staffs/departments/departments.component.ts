import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewDepartmentDialogComponent } from './new-department-dialog/new-department-dialog.component';
import { DepartmentService } from 'src/app/services/department.service';
import { DetailDepartmentDialogComponent } from './detail-department-dialog/detail-department-dialog.component';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  constructor(private _matDialog: MatDialog,
    private _departmentService: DepartmentService,
    private _loaderService: LoaderServiceService,
    private _fb: FormBuilder,
    private _userService: UserService
    ) { }

  departments: any[] = [];
  bShowEditForm: boolean = false;
  edit_department_form: FormGroup;
  current_editing_department: any = null;
  edit_form_bound_departments:any[] = [];
  isDepartmentUpdated: boolean = false;
  @Input('indexOfTab') indexOfTab: number;
  perm: any = {};
  ngOnInit() {
    // this._loaderService.show();
    // this.get_departments()
    this.perm = this._userService.get_permission();
  }

  ngOnChanges(change) {
    if (change && change.indexOfTab && change.indexOfTab.currentValue == 1) {
      this._loaderService.show();
      this.get_departments()
    }
  }

  get_departments() {
    this._departmentService.get_departments().subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        // this.departments = data.data;
        this.process_data(data.data);
      } else {
        this._loaderService.hide();
        console.log('Error while fetching departments');
        console.log(data);
      }
    }, err => {
      this._loaderService.hide();
      console.log(err);
    })
  }

  process_data(dataArray) {
    const set = new Set();

    dataArray.forEach(element => {
      set.add(element.id_department);
    });;

    this.departments = [];

    Array.from(set).forEach(curr => {
      let obj: any = {};
      obj.designations = [];

      dataArray.forEach(element => {
        if (curr === element.id_department) {
          obj.id_department = element.id_department;
          obj.name = element.name;
          obj.department_id = element.department_id;
          obj.designations.push({ id_designation: element.id_designation, designation_name: element.designation_name, designation_id: element.designation_id });
          obj.createdAt = element.created_on;
          obj.subdepartment = element.subdepartment;
          obj.parent_department_id = element.parent_department_id;
        }
      });
      this.departments.push(obj);
    });

    console.log(this.departments);

  }

  openCreateNewDepartmentDialog() {
    const dialogRef = this._matDialog.open(NewDepartmentDialogComponent,
      { disableClose: true, data: { departments: this.departments } });

    dialogRef.afterClosed().subscribe(datafrommodal => {
      console.log(`Modal closed`);
      if (datafrommodal.data) {
        this.get_departments();
      }
    });
  }

  openDepartmentDetailDialog(department: any) {
    const dialogRef = this._matDialog.open(DetailDepartmentDialogComponent,
      { disableClose: true, data: { department } });

    dialogRef.afterClosed().subscribe(datafrommodal => {
      console.log('Department detail dialog closed, data received :: ', datafrommodal);
    });
  }

  onDepartmentEdit(department: any) {
    this.isDepartmentUpdated = false;
    this.current_editing_department = department;
    this.edit_form_bound_departments = this.departments.filter(cur => {
      return cur.id_department !== this.current_editing_department.id_department;
    })
    console.log(department);
    this.edit_department_form = new FormGroup({
      department_id: new FormControl(),
      name: new FormControl(),
      parent_department: new FormControl(),
      isSubDepartment: new FormControl(),
      designations: new FormArray([])
    });
    this.edit_department_form.patchValue({
      department_id: department.department_id,
      name: department.name,
      parent_department: department.parent_department_id,
      isSubDepartment: department.subdepartment
    });
    this.edit_department_form.setControl('designations', this.setDesignationArray(department.designations));
    this.bShowEditForm = true;
  }

  setDesignationArray(designations) {
    const formArray = new FormArray([]);
    designations.forEach(current => {
      formArray.push(this._fb.group({
        id_designation: current.id_designation,
        designation_id: current.designation_id,
        designation_name: current.designation_name
      }));
    });
    return formArray;
  }
  add_new_designation(){
    (<FormArray>this.edit_department_form.get("designations")).push(
      this.new_designation_row()
    );
  }
  new_designation_row(): FormGroup {
    return new FormGroup({
      id_designation: new FormControl(),
      designation_name: new FormControl(),
      designation_id: new FormControl(),
    });
  }
  delete_designation(i){
    const ok = confirm('Deleting the designation will detag the designation of the staff tagged! Are you sure to proceed?');
    if(!ok)
      return;
    (<FormArray>this.edit_department_form.get("designations")).removeAt(i);
  }


  hideEditForm() {
    this.get_departments();
    this.bShowEditForm = false;
  }

  onDepartmentRemove(id: string) {
    console.log(`Delete department ${id}`);
  }


  unUpdate(){
    const ok = confirm('Are you sure to proceed with provided data for department update?');
    if(!ok)
      return;
    console.log(this.current_editing_department);
    console.log(this.edit_department_form.value);

    if(this.edit_department_form.value.isSubDepartment && !this.edit_department_form.value.parent_department)
      return alert('Please select parent department!');

    if(!this.edit_department_form.value.isSubDepartment)
      this.edit_department_form.value.parent_department = null;
    
    const designations_updated = this.edit_department_form.value.designations.filter((desig: any) => {
      return this.current_editing_department.designations.findIndex((cur: any ) => {
        return cur.id_designation === desig.id_designation;
      }) > -1;
    })

    const designations_deleted = this.current_editing_department.designations.filter((desig: any) => {
      return this.edit_department_form.value.designations.findIndex((cur: any ) => {
        return cur.id_designation === desig.id_designation;
      }) == -1;
    })    

    const designations_added = this.edit_department_form.value.designations.filter((desig: any) => {
      return desig.id_designation === null;
    })

    const updated_department = {
      id_department : this.current_editing_department.id_department,
      department_id: this.edit_department_form.value.department_id,
      name: this.edit_department_form.value.name,
      isSubDepartment: this.edit_department_form.value.isSubDepartment,
      parent_department: this.edit_department_form.value.parent_department,
      designations_updated,
      designations_deleted,
      designations_added,
      modified_by : this._userService.userDetails.staff_id
    }
    console.log(updated_department);

    this._loaderService.hide();
    this._departmentService.update_department(updated_department).subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        this.get_departments();
        alert('Department Updated Successfully!');
        this.isDepartmentUpdated = true;
      } else {
        this._loaderService.hide();
        alert('Error while updating departments!');
        console.log(data);
        this.isDepartmentUpdated = false;
      }
    }, err => {
      this._loaderService.hide();
      alert('Error while updating departments!');
      console.log(err);
      this.isDepartmentUpdated = false;
    })

  }


}
