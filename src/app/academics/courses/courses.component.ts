import { Component, OnInit, Input } from '@angular/core';
import { AcademicService } from 'src/app/services/academic.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: any[] = [];
  bShowNewCourseForm: boolean;
  bShowCourseDetails: boolean;
  showingCourse: any;
  @Input('indexOfTab') indexOfTab;
  constructor(private _academicService: AcademicService,
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }

  perm:any = {};
  ngOnInit() {
    this.perm = this._userService.get_permission();
    this.bShowNewCourseForm = false;
    this.bShowCourseDetails = false;
    this.getCourses();
  }
  ngOnChanges(change) {
    if(this.indexOfTab === 0) {
      this.getCourses();
    }
  }

  showNewCourseForm() {    
    this.bShowNewCourseForm = true;
    this.bShowCourseDetails = false;
  }

  hideNewCourseForm(e) {
    if(e) {
      this.getCourses();
    }
    this.bShowNewCourseForm = false;
    this.bShowCourseDetails = false;
  }

  hideCourseDetails(e) {
    if(e) {
      this.getCourses();
    }
    this.bShowNewCourseForm = false;
    this.bShowCourseDetails = false;
  }

  onCourseDetail(course) {
    this.showingCourse = course;
    this.bShowNewCourseForm = false;
    this.bShowCourseDetails = true;
  }
  
  getCourses(){
    this._loaderService.show();
    this._academicService.get_courses().subscribe((data: any) => {
      console.log(data);
      this._loaderService.hide();
      if(data.success) {
        this.courses = data.data;
      } else {
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching courses');
      console.log(err);
    })
  }



}
