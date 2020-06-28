import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { StudentsComponent } from "./students/students.component";
import { StaffsComponent } from "./staffs/staffs.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { AcademicsComponent } from './academics/academics.component';
import { PolicyComponent } from './policy/policy.component';
import { NoticeComponent } from './notice/notice.component';
import { LibraryComponent } from './library/library.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { UserManagementComponent } from './user/user-management/user-management.component';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "changepassword", component: ForgotPasswordComponent },
  {
    path: "home",
    component: HomeComponent,
    canActivateChild: [AuthGuardService],  
    children: [
      { path: "students", component: StudentsComponent },
      { path: "staffs", component: StaffsComponent },
      { path: "attendance", component: AttendanceComponent },
      { path: "academics", component: AcademicsComponent },
      { path: "policy", component: PolicyComponent },
      { path: "notice", component: NoticeComponent },
      { path: "library", component: LibraryComponent },
      { path: "users", component: UserManagementComponent },
    ]
  },
  { path: "**", redirectTo:"/login" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
