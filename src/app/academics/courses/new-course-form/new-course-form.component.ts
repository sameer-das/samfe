import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AcademicService } from 'src/app/services/academic.service';
import { StaffService } from 'src/app/services/staff.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { forEach } from '@angular/router/src/utils/collection';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-course-form',
  templateUrl: './new-course-form.component.html',
  styleUrls: ['./new-course-form.component.css']
})
export class NewCourseFormComponent implements OnInit {

  constructor(private _academicService: AcademicService,
    private _staffService: StaffService,
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }

  new_course_form: FormGroup;
  awardingbodies: any[] = [];
  academicDepartments: any[] = [];
  formBoundAcademicDepartments: any[] = [];
  courseSaved: boolean = false;

  documents = [];
  
  @Output() hideNewCourseForm = new EventEmitter();
  perm:any = {};
  ngOnInit() {
    this.perm = this._userService.get_permission();
    if(this.perm.permission_academics >= 2) {
      this.initialize_new_course_form();
      this.getAwardingBodies();
      this.getAcademicDepartments();
      this.read_document_master();
    }
  }

  initialize_new_course_form() {
    this.new_course_form = new FormGroup({
      course_name: new FormControl(null, Validators.required),
      id_department: new FormControl(null, Validators.required),
      course_in_charge: new FormControl(null, Validators.required),
      course_in_charge_staffid: new FormControl(),
      id_awarding_body: new FormControl(null, Validators.required),
      required_documents: new FormControl(),
      course_duration: new FormControl(null, Validators.required),
      course_duration_unit: new FormControl(null, Validators.required),
      course_fee: new FormControl(null, Validators.required),
      course_fee_unit: new FormControl(null, Validators.required),
      subjects: new FormArray([]),
    })
  }

  add_new_subject(): void {
    (<FormArray>this.new_course_form.get("subjects")).push(
      this.new_subject_row()
    );
  }

  delete_subject(i: number): void {
    (<FormArray>this.new_course_form.get("subjects")).removeAt(i);
  }

  new_subject_row(): FormGroup {
    return new FormGroup({
      subject_name: new FormControl(),
      subject_code: new FormControl(),
      subject_duration: new FormControl(),
    });
  }

  onAwardingbodyChange() {
    // console.log(this.new_course_form.value.awarding_body);
    this.formBoundAcademicDepartments = this.academicDepartments
      .filter(current => current.id_awarding_body === this.new_course_form.value.id_awarding_body);
  }

  onSearchStaff() {
    // console.log(this.new_course_form.value);
    if (this.new_course_form.value.course_in_charge === null || this.new_course_form.value.course_in_charge === "") {
      alert('Please enter valid staff id and search!');
    } else {
      this.getStaffDetailsFromStaffId(this.new_course_form.value.course_in_charge);
    }
  }

  save_course(): void {

    if (this.new_course_form.value.course_in_charge === null
      || this.new_course_form.value.course_in_charge === ''
      || this.new_course_form.value.course_in_charge_staffid === null
      || this.new_course_form.value.course_in_charge_staffid === ''
    ) {
      alert('Please assign a valid staff as course in charge!');
    } else if (this.invalidSubjects(this.new_course_form.value.subjects)) {
      alert('Please enter valid subjects for the course!');
    } else {
      // console.log(this.new_course_form.value);
      if(this.new_course_form.value.subjects.length == 0 ){
        const ok = confirm('Are you sure to create the course with no subjects?');
        if(!ok)
          return;
      } else {
        const ok = confirm('Are you sure to create the course?');
        if(!ok)
          return;
      }

      this._loaderService.show();
      this._academicService.create_course(this.new_course_form.value).subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success) {
          this.courseSaved = true;
          alert('New Course added successfully!');
          this.clear_new_course_form();
        } else {
          alert('Error while adding new course!');
          console.log(data);
        }
      }, (err) => {
        this._loaderService.hide();
        alert('Error while adding new course!');
        console.log(err);
      })
      console.log(this.new_course_form.value);
    }
  }

  invalidSubjects(subjects: any[]) {
    if (subjects.length > 0) {     
      return subjects.some(subject => {
        return subject.subject === null || subject.subject_code === null || subject.subject_duration === null
          || subject.subject === '' || subject.subject_code === '' || subject.subject_duration === '';
      });
    } else {
      return false;
    }
  }

  cancel() {
    this.hideNewCourseForm.emit(this.courseSaved);
  }

  clear_new_course_form() {
    // <FormArray>this.new_course_form.get("subjects") = new FormArray([]);
    this.new_course_form.setControl('subjects', new FormArray([]));
    this.new_course_form.reset();
  }

  getAwardingBodies() {
    this._academicService.get_awardingbodies().subscribe((data: any) => {
      if (data.success) {
        this.awardingbodies = data.data;
        console.log(this.awardingbodies);
      } else {
        this.awardingbodies = [];
        console.log('Error while getting awarding bodies');
        console.log(data.data);
      }
    }, (err) => {
      this.awardingbodies = [];
      console.log('Error while getting awarding bodies');
      console.log(err);
    })
  }

  getAcademicDepartments() {
    this._academicService.get_academicdepartments().subscribe((data: any) => {
      if (data.success) {
        this.academicDepartments = data.data;
        console.log(this.academicDepartments);
      } else {
        this.academicDepartments = [];
        console.log('Error while getting academic departments');
        console.log(data.data);
      }
    }, (err) => {
      this.academicDepartments = [];
      console.log('Error while getting academic departments');
      console.log(err);
    })
  }

  getStaffDetailsFromStaffId(staff_id: number) {
    this._loaderService.show();
    this._staffService.get_staff(staff_id).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success && data.data) {
        this.new_course_form.patchValue({
          course_in_charge_staffid: data.data.id_staff,
          course_in_charge: data.data.name
        })
      } else if (data.success && !data.data) {
        alert('No Staff found for the entered staff id!');
        this.new_course_form.patchValue({
          course_in_charge_staffid: null,
          course_in_charge: null
        })
      } else {
        alert('Error while getting staff details!');
      }
    }, (err) => {
      console.log(err);
      alert('Error while getting staff details!');
      this._loaderService.hide();
    });
  }


  read_document_master() {
    this._academicService.read_document_master().subscribe((data: any ) => {
      if(data.success) {
        this.documents = data.data;
      } else {
        console.log('Error reading document master');
        console.log(data);
      }
    }, (err) => {
      console.log('Error reading document master');
      console.log(err);
    })
  }

}
