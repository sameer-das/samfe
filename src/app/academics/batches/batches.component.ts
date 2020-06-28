import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { AcademicService } from 'src/app/services/academic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit, OnChanges {

  constructor(private _loaderService: LoaderServiceService,
    private _academicService: AcademicService,
    private _userService: UserService) { }

  bShowNewBatchForm: boolean = false;
  newBatchForm: FormGroup;
  courses: any[] = [];
  batches: any[] = [];
  selectedCourse: any;
  courseEndDate: any;
  isBatchCreated: boolean = false;
  @Input('indexOfTab') indexOfTab;
  perm: any = {};
  ngOnInit() {
    this.perm = this._userService.get_permission();
  }
  ngOnChanges(change) {
    if (this.indexOfTab === 2) {
      if (this.perm.permission_academics >= 2)
        this.initialize_newBatchForm();
      this.getBatches();
      this.getCourses();
    }
  }

  showNewBatchForm() {
    this.bShowNewBatchForm = true;
  }

  hideNewBatchForm() {
    this.bShowNewBatchForm = false;
    if (this.isBatchCreated) {
      this.getBatches();
    }
  }

  initialize_newBatchForm() {
    this.newBatchForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      end_date: new FormControl(),
    })

    this.newBatchForm.controls['start_date'].disable();
  }

  onCourseChange() {
    if ((this.newBatchForm.value.course !== null || this.newBatchForm.value.course !== '') && this.newBatchForm.controls['start_date'].disabled) {
      console.log('enable')
      this.newBatchForm.controls['start_date'].enable();
    }

    this.selectedCourse = this.courses.filter(current => current.id_course === this.newBatchForm.value.course)

    if (this.newBatchForm.value.start_date) {
      this.populateEndDate();
    }
  }

  Holidays = [
    moment().day("Saturday").weekday(),
    moment().day("Sunday").weekday(),
    moment('28-04-2020', 'DD-MM-YYYY').weekday()];

  populateEndDate() {
    this.newBatchForm.patchValue({ end_date: this.addBusinessDays(this.newBatchForm.value.start_date).toDate() });
    this.courseEndDate = moment(this.newBatchForm.value.end_date).format('DD-MM-YYYY');
  }

  startDateChanged(e: MatDatepickerInputEvent<Date>) {
    this.populateEndDate();
  }


  addBusinessDays(val) {
    console.log(val);
    let mom = moment(val)

    console.log(this.selectedCourse[0].course_duration, this.selectedCourse[0].course_duration_unit);


    return mom.add(this.selectedCourse[0].course_duration, this.selectedCourse[0].course_duration_unit);
  }

  saveNewBatch() {
    this.newBatchForm.value.start_date = moment(this.newBatchForm.value.start_date).format('YYYY-MM-DD');
    this.newBatchForm.value.end_date = moment(this.newBatchForm.value.end_date).format('YYYY-MM-DD');
    // this.newBatchForm.value.course = this.selectedCourse[0];
    console.log(this.newBatchForm.value);

    this._loaderService.show();
    this._academicService.create_batch(this.newBatchForm.value).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.isBatchCreated = true;
        alert('New Batch Created Sussefully!');
      } else {
        alert('Error while creating new batch!');
        console.log(data);
      }
    }, (err) => {
      console.log(err);
      alert('Error while creating new batch!');
    })
  }

  getCourses() {
    this._loaderService.show();
    this._academicService.get_courses().subscribe((data: any) => {
      console.log(data);
      this._loaderService.hide();
      if (data.success) {
        this.courses = data.data;
      } else {
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching courses');
      console.log(err);
    })
  }

  getBatches() {
    this._loaderService.show();
    this._academicService.get_batches().subscribe((data: any) => {
      console.log(data);
      this._loaderService.hide();
      if (data.success) {
        this.batches = data.data;
      } else {
        console.log(data);
      }
    }, (err) => {
      console.log('Error while fetching batches');
      console.log(err);
    })
  }
}
