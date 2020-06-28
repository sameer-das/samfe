import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormControlDirective, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  constructor(private _userService: UserService, private _loaderService: LoaderServiceService) { }
  bShowRoles: boolean = true;
  bShowNewRoleForm: boolean = false;
  bShowEditRoleForm: boolean = false;
  newRoleForm: FormGroup;
  editRoleForm: FormGroup;
  roles: any[] = [];
  editing_role_id = null;

  ngOnInit() {
    this.initialize_newRoleForm();
    this.get_roles();
  }

  hideNewRoleForm() {
    this.bShowEditRoleForm = false;
    this.bShowNewRoleForm = false;
    this.bShowRoles = true;
  }

  showNewRoleForm() {
    this.bShowNewRoleForm = true;
    this.bShowEditRoleForm = false;
    this.bShowRoles = false;
  }


  hideEditRoleForm() {
    this.bShowEditRoleForm = false;
    this.bShowNewRoleForm = false;
    this.bShowRoles = true;
  }

  initialize_newRoleForm() {
    this.newRoleForm = new FormGroup({
      role_name: new FormControl(null, [Validators.required]),
      permission_staff: new FormControl('0'),
      permission_student: new FormControl('0'),
      permission_academics: new FormControl('0'),
      permission_policy: new FormControl('0'),
      permission_notice: new FormControl('0'),
      permission_library: new FormControl('0'),
      permission_usermanagement: new FormControl('0'),
      permission_studentenquiry: new FormControl('0'),
    })
  }

  editRole(role: any) {
    this.editing_role_id = role.id_role;
    const arr = role.permission.split('');
    // console.log(arr);
    this.editRoleForm = new FormGroup({
      role_name: new FormControl(role.role_name, [Validators.required]),
      permission_staff: new FormControl(arr[0]),
      permission_student: new FormControl(arr[1]),
      permission_academics: new FormControl(arr[2]),
      permission_policy: new FormControl(arr[3]),
      permission_notice: new FormControl(arr[4]),
      permission_library: new FormControl(arr[5]),
      permission_usermanagement: new FormControl(arr[6]),
      permission_studentenquiry: new FormControl(arr[7] ? arr[7] : '0'),
    });

    this.bShowEditRoleForm = true;
    this.bShowNewRoleForm = false;
    this.bShowRoles = false;
  }

  onUpdateRole() {
    console.log(this.editRoleForm.value);
    let permission = '';

    permission += this.editRoleForm.value.permission_staff ? this.editRoleForm.value.permission_staff : '0';
    permission += this.editRoleForm.value.permission_student ? this.editRoleForm.value.permission_student : '0';
    permission += this.editRoleForm.value.permission_academics ? this.editRoleForm.value.permission_academics : '0';
    permission += this.editRoleForm.value.permission_policy ? this.editRoleForm.value.permission_policy : '0';
    permission += this.editRoleForm.value.permission_notice ? this.editRoleForm.value.permission_notice : '0';
    permission += this.editRoleForm.value.permission_library ? this.editRoleForm.value.permission_library : '0';
    permission += this.editRoleForm.value.permission_usermanagement ? this.editRoleForm.value.permission_usermanagement : '0';
    permission += this.editRoleForm.value.permission_studentenquiry ? this.editRoleForm.value.permission_studentenquiry : '0';

    const role = { id_role: this.editing_role_id, name: this.editRoleForm.value.role_name, permission };

    this._userService.update_role(role).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Role Updated Successfully');
        // this.hideEditRoleForm();
        this.get_roles();
      } else {
        alert('Error while updating the role!');
        console.log(data);
      }
      // console.log(data);
    }, (err) => {
      this._loaderService.hide();
      if (err.status == 401)
        alert('You are not authenticated!');
      else
        alert('Error while updating the role!');
      console.log(err);
    })
  }


  get_roles() {
    this._userService.get_roles().subscribe((data: any) => {
      if (data.success) {
        this.roles = data.data;
      } else {
        console.log('Error fetching roles');
        console.log(data);
        this.roles = [];
      }
    }, (err) => {
      console.log(err);
      this.roles = []
    })
  }

  onSaveRole() {
    // console.log(this.newRoleForm.value);
    const ok = confirm('Are you sure to create the role?');
    if (!ok)
      return;
    let permission = '';

    permission += this.newRoleForm.value.permission_staff ? this.newRoleForm.value.permission_staff : '0';
    permission += this.newRoleForm.value.permission_student ? this.newRoleForm.value.permission_student : '0';
    permission += this.newRoleForm.value.permission_academics ? this.newRoleForm.value.permission_academics : '0';
    permission += this.newRoleForm.value.permission_policy ? this.newRoleForm.value.permission_policy : '0';
    permission += this.newRoleForm.value.permission_notice ? this.newRoleForm.value.permission_notice : '0';
    permission += this.newRoleForm.value.permission_library ? this.newRoleForm.value.permission_library : '0';
    permission += this.newRoleForm.value.permission_usermanagement ? this.newRoleForm.value.permission_usermanagement : '0';
    permission += this.newRoleForm.value.permission_studentenquiry ? this.newRoleForm.value.permission_studentenquiry : '0';

    console.log(this.newRoleForm.value.role_name, permission);
    const role = { name: this.newRoleForm.value.role_name, permission }
    this._loaderService.show();
    this._userService.create_role(role).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Role Created Successfully');
        this.newRoleForm.reset();
      } else {
        alert('Error while creating the role!');
        console.log(data);
      }
      console.log(data);
    }, (err) => {
      this._loaderService.hide();
      if (err.status == 401)
        alert('You are not authenticated!');
      else
        alert('Error while creating the role!');
      console.log(err);
    })
  }

}
