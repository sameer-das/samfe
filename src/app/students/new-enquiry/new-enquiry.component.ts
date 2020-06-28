import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatStep } from "@angular/material";
import { HttpClient } from '@angular/common/http';
import { AcademicService } from 'src/app/services/academic.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { StudentsService } from 'src/app/services/students.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: "app-new-enquiry",
  templateUrl: "./new-enquiry.component.html",
  styleUrls: ["./new-enquiry.component.css"]
})
export class NewEnquiryComponent implements OnInit {
  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private _http: HttpClient,
    private _academicService: AcademicService,
    private _studentService: StudentsService,
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }
  student_details_from: FormGroup;


  courses: any[] = [];
  batches: any[] = [];
  formBoundBatches: any[] = [];

  ngOnInit() {

    this.initialize_student_details_from();
    this.getCourses();
    this.getBatches();

    // this.student_details_from.patchValue({batch: 2});
    // this.student_details_from.patchValue({
    //   student_name: "Sameer Das",
    //   mobile: 9658646979,
    //   email: "sameer.das@wipro.com",
    //   course: 3,
    //   batch: 2,
    //   source_of_info: "internet",
    //   remarks: "Interested to join on science course, Interested to join on science course, Interested to join on science course"
    // });
    // this.student_details_from.setControl('communications', this.setCommunicationsArray());



  }

  setCommunicationsArray() {
    const formArray = new FormArray([]);
    [
      { date: new Date('2020-01-01'), message: "Asked for matric certificate" },
      { date: new Date('2020-02-15'), message: "Asked for +2 certificate" },
      { date: new Date('2020-02-14'), message: "Asked for cttc certificate" }
    ].forEach(current => {
      let fg = this.fb.group({
        date: current.date,
        message: current.message
      });
      formArray.push(fg);
    });
    return formArray;
  }
  initialize_student_details_from() {
    this.student_details_from = new FormGroup({
      student_name: new FormControl(null, Validators.required),
      mobile: new FormControl(),
      email: new FormControl(),
      course: new FormControl(null),
      batch: new FormControl(null),
      source_of_info: new FormControl(),
      remarks: new FormControl(),
      communications: new FormArray([])
    });
  }



  add_communications_row() {
    (<FormArray>this.student_details_from.get("communications")).push(
      this.new_communication_row()
    );
  }

  delete_communications_row(i: number) {
    (<FormArray>this.student_details_from.get("communications")).removeAt(i);
  }

  new_communication_row(): FormGroup {
    return new FormGroup({
      date: new FormControl(),
      message: new FormControl()
    });
  }
  
  onCourseChange() {

    this.formBoundBatches = this.batches.filter(curr =>
      this.student_details_from.value.course === curr.id_course
    )
    this.student_details_from.patchValue({batch: null});
  }

  save() {

    const enquiry = { ...this.student_details_from.value };
    enquiry.created_by = this._userService.userDetails.staff_id;
    if (enquiry.communications.length > 0) {
      enquiry.communications = enquiry.communications.map(current => {
        return {
          date: moment(current.date).format('YYYY-MM-DD'),
          message: current.message,
          comm_by: this._userService.userDetails.staff_id
        }
      })
    }
    console.log(enquiry);

    this._loaderService.show();
    this._studentService.create_enquiry(enquiry).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Enquiry added successfuly!');
        this.student_details_from.reset();
        this.student_details_from.setControl('communications', new FormArray([]));
      } else {
        console.log('Error adding the enquiry')
        alert('Error adding the enquiry');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log('Error adding the enquiry')
      alert('Error adding the enquiry');
      console.log(err);
    })
  }
  clear() {
    const ok = confirm('This will reset all the data entered. Are you sure to clear the form?');
    if (!ok)
      return;
    this.student_details_from.reset();
  }

  getStudents() {
    this._http.get('http://localhost:3000/students/download')
      .subscribe(res => {
        console.log(res);
      })
  }

  getCourses() {
    this._academicService.get_courses().subscribe((data: any) => {
      if (data.success) {
        this.courses = data.data;
        console.log(this.courses);
      } else {
        console.log('Error while reading courses;')
        console.log(data);
      }
    }, (err) => {
      console.log('Error while reading courses;')
      console.log(err);
    })
  }
  getBatches() {
    this._academicService.get_batches().subscribe((data: any) => {
      if (data.success) {
        this.batches = data.data;
        console.log(this.batches)
      } else {
        console.log('Error while reading batches')
        console.log(data);
      }
    }, (err) => {
      console.log('Error while reading batches')
      console.log(err);
    })
  }

}
