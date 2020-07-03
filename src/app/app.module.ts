import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentsComponent } from './students/students.component';
import { StaffsComponent } from './staffs/staffs.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LoaderComponent } from './loader/loader.component';
import { NewEnquiryComponent } from './students/new-enquiry/new-enquiry.component';
import { EnquiryHistoryComponent } from './students/enquiry-history/enquiry-history.component';
import { StudentDetailComponent } from './students/student-detail/student-detail.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AcademicsComponent } from './academics/academics.component';
import { DepartmentsComponent } from './staffs/departments/departments.component';
import { StaffDetailsComponent } from './staffs/staff-details/staff-details.component';
import { CoursesComponent } from './academics/courses/courses.component';
import { NewCourseFormComponent } from './academics/courses/new-course-form/new-course-form.component';
import { NewDepartmentDialogComponent } from './staffs/departments/new-department-dialog/new-department-dialog.component';
import { CreateStaffComponent } from './staffs/create-staff/create-staff.component';

import { DetailDepartmentDialogComponent } from './staffs/departments/detail-department-dialog/detail-department-dialog.component';
import { EditStaffDetailsDialogComponent } from './staffs/staff-details/edit-staff-details-dialog/edit-staff-details-dialog.component';
import { CourseDetailsComponent } from './academics/courses/course-details/course-details.component';
import { BatchesComponent } from './academics/batches/batches.component';
import { RoomsComponent } from './academics/rooms/rooms.component';
import { PolicyComponent } from './policy/policy.component';
import { NoticeComponent } from './notice/notice.component';
import { LibraryComponent } from './library/library.component';
import { IssuebookformComponent } from './library/issuebookform/issuebookform.component';
import { HierarchyComponent } from './staffs/hierarchy/hierarchy.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { JwtModule, JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { UserComponent } from './user/user/user.component';
import { UserManagementComponent } from './user/user-management/user-management.component';
import { RolesComponent } from './user/roles/roles.component';
import { TimetableComponent } from './timetable/timetable.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StudentsComponent,
    StaffsComponent,
    AttendanceComponent,
    LoaderComponent,
    NewEnquiryComponent,
    EnquiryHistoryComponent,
    StudentDetailComponent,
    AcademicsComponent,
    DepartmentsComponent,
    StaffDetailsComponent,
    CoursesComponent,
    NewCourseFormComponent,
    NewDepartmentDialogComponent,
    CreateStaffComponent,
    DetailDepartmentDialogComponent,
    EditStaffDetailsDialogComponent, 
    CourseDetailsComponent, BatchesComponent, 
    RoomsComponent, PolicyComponent, 
    NoticeComponent, LibraryComponent, IssuebookformComponent, 
    HierarchyComponent, ForgotPasswordComponent, UserComponent, UserManagementComponent,
    RolesComponent,
    TimetableComponent

  ],
  entryComponents: [
    NewDepartmentDialogComponent,
    DetailDepartmentDialogComponent,
    EditStaffDetailsDialogComponent,
    IssuebookformComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule,
    AppRoutingModule,
  ],
  providers: [HttpClient,  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
