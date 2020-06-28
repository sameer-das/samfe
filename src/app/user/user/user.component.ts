import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentsService } from 'src/app/services/students.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private _studentService: StudentsService,
    private _staffService: StaffService,
    private _userService: UserService,
    private _loaderService: LoaderServiceService) { }
  searchType = 'staff';
  searchValue = null;
  showingDetails: any = {};
  bShowUserDetails: boolean = false;
  roles: any[] = [];
  assignedRole = null;
  ngOnInit() {
    this.get_roles()
  }

  onSearch() {
    console.log(this.searchType)
    console.log(this.searchValue)
    if (!this.searchValue || this.searchValue.trim() === '')
      return alert('Please enter Staff/Student ID to search!');

    if (this.searchType === 'student') {
      this._studentService.get_student(this.searchValue.toLowerCase().trim()).subscribe((data: any) => {
        console.log(data);
        if (data.success && data.data.length > 0) {
          this.showingDetails = {};
          this.showingDetails['person_type'] = 'student';
          this.showingDetails['person_id'] = data.data[0].student_id;
          this.showingDetails['id_person'] = data.data[0].id_student;
          this.showingDetails['person_name'] = data.data[0].name;
          this.bShowUserDetails = true;
          this.get_user_role(data.data[0].student_id);
        } else {
          alert('No Data Found');
          this.bShowUserDetails = false;
          this.showingDetails = {};
        }
      }, (err) => {
        console.log(err);
        alert('Error getting student data!');
        this.bShowUserDetails = false;
      })
    } else if (this.searchType === 'staff') {
      this._staffService.get_staff(this.searchValue.toLowerCase().trim()).subscribe((data: any) => {
        if (data.success && data.data) {
          this.showingDetails = {};
          this.showingDetails['person_type'] = 'staff';
          this.showingDetails['person_id'] = data.data.staff_id;
          this.showingDetails['id_person'] = data.data.id_staff;
          this.showingDetails['person_name'] = data.data.name;
          this.bShowUserDetails = true;
          this.get_user_role(data.data.staff_id);

        } else {
          alert('Details not found!');
          this.bShowUserDetails = false;
          this.showingDetails = {};
        }
        // console.log(data);
      }, (err) => {
        console.log(err);
        alert('Error getting staff data!');
        this.bShowUserDetails = false;
      })
    }
  }

  assignRole() {
    console.log(this.showingDetails);
    console.log(this.assignedRole);

    if (this.showingDetails.role.length > 0) {
      // already assgned a role go for update
      const user = { id_mapping: this.showingDetails.role[0].id_mapping, role: this.assignedRole }
      this._userService.update_role_mapping(user).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          alert('User role updated successfully!');
          this.clearSearch();
        } else {
          alert('Error while updating user role!');
          console.log(data);
        }
      }, (err) => {
        console.log(err);
        alert('Error while updating user role!');
      });

    } else {
      // create the user with the role
      const user = { username: this.showingDetails.person_id.toLowerCase(), role: this.assignedRole }
      this._userService.create_user(user).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          alert('User Created Successfully!');
          this.clearSearch();
        } else {
          alert('Error while creating user!');
          console.log(data);
        }
      }, (err) => {
        console.log(err);
        alert('Error while creating user!');
      })
    }
  }



  clearSearch() {
    this.searchValue = null;
    this.bShowUserDetails = false;
  }

  get_roles() {
    this._userService.get_roles().subscribe((data: any) => {
      if (data.success) {
        this.roles = data.data;
        console.log(this.roles);
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

  get_user_role(user_id) {
    this._userService.get_user_role(user_id).subscribe((data: any) => {
      if (data.success) {
        this.showingDetails['role'] = data.data;
        if (data.data.length > 0)
          this.assignedRole = data.data[0].id_role;
        else
          this.assignedRole = null;
        console.log(this.showingDetails);
      } else {
        console.log('Error fetching role of user');
        console.log(data);
        this.showingDetails['role'] = {};
      }
    }, (err) => {
      console.log(err);
      this.showingDetails['role'] = {};
    })
  }

  reset_psw() {
    const ok = confirm('Are you sure to reset the passord of this user?');
    if (!ok)
      return;
    console.log(this.showingDetails.role[0].id_user_master);
    const data = { id_user_master: this.showingDetails.role[0].id_user_master };
    this._loaderService.show();
    this._userService.reset_password(data).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Password reset successfully!')
      } else {
        alert('Error resetting password!');
        console.log(data)
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err);
      alert('Error resetting password!');

    })
  }


}
