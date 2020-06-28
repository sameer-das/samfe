import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { AcademicService } from 'src/app/services/academic.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnChanges {

  constructor(private _loaderService: LoaderServiceService,
    private _academicService: AcademicService,
    private _staffService: StaffService,
    private _userService: UserService,
    private fb: FormBuilder) { }
  @Output() hideCourseDetails = new EventEmitter();
  @Input('course') course;
  showEditForm: boolean = false;
  isEdited: boolean = false;
  editCourseForm: FormGroup;
  mapStaffForm: FormGroup;
  formBoundAcademicDepartments: any[] = [];

  awardingbodies: any[] = [];
  academicDepartments: any[] = [];


  subjects = [];
  documents = []
  mapped_documents = [];
  bShowMapStaffForm: boolean = false;
  bSearchStaffForEdit: boolean = true;

  mapped_staffs: any[] = [];
  perm: any = {}
  ngOnInit() {
    this.perm = this._userService.get_permission();
  }
  ngOnChanges() {
    console.log(this.course);
    if(this.perm.permission_academics >= 2) {
      this.getAwardingBodies();
      this.getAcademicDepartments();

    }
    this.read_document_master();
    this.getMappedSubjects();
    this.getMappedDocuments();
    this.getMappingCourseStaff();
  }

  cancel() {
    this.hideCourseDetails.emit(this.isEdited);
  }
  onEditCancel() {
    this.showEditForm = false;
    this.bShowMapStaffForm = false;
  }
  onAwardingbodyChange() {
    this.formBoundAcademicDepartments = this.academicDepartments
      .filter(current => current.awardingbody._id === this.editCourseForm.value.awarding_body);
  }

  onEdit() {
    this.bSearchStaffForEdit = true;
    this._loaderService.show();
    this.initialize_editCourseForm();
    this.bShowMapStaffForm = false;
    this.showEditForm = true;
    this.editCourseForm.patchValue({
      course_name: this.course.name,
      department: this.course.id_department,
      course_in_charge: this.course.course_incharge_name,
      course_in_charge_staffid: this.course.course_incharge_id,
      awarding_body: this.course.id_awarding_body,
      course_duration: this.course.course_duration,
      course_duration_unit: this.course.course_duration_unit,
      course_fee: this.course.course_fee,
      course_fee_unit: this.course.course_fee_unit,
      required_documents: this.getDocumentIds()
    });

    this.formBoundAcademicDepartments = this.academicDepartments
      .filter(current => current.id_awarding_body === this.editCourseForm.value.awarding_body);

    this.editCourseForm.setControl('subjects', this.setSubjectsArray());
    this._loaderService.hide();
  }

  getDocumentIds() {
    let darr = [];
    this.mapped_documents.forEach(curr => {
      darr.push(curr.id_document);
    });
    return darr;
  }
  setSubjectsArray() {
    let faray = new FormArray([]);
    this.subjects.forEach(current => {
      let fg = this.fb.group({
        subject_name: current.subject_name,
        subject_code: current.subject_code,
        subject_duration: current.subject_duration
      });
      faray.push(fg);
    });
    return faray;
  }

  add_new_subject(): void {
    (<FormArray>this.editCourseForm.get("subjects")).push(
      this.new_subject_row()
    );
  }

  new_subject_row(): FormGroup {
    return new FormGroup({
      subject_name: new FormControl(),
      subject_code: new FormControl(),
      subject_duration: new FormControl(),
    });
  }

  delete_subject(i: number): void {
    (<FormArray>this.editCourseForm.get("subjects")).removeAt(i);
  }


  initialize_editCourseForm() {

    this.editCourseForm = new FormGroup({
      course_name: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      course_in_charge: new FormControl(null, Validators.required),
      course_in_charge_staffid: new FormControl(),
      awarding_body: new FormControl(null, Validators.required),
      required_documents: new FormControl(),
      course_duration: new FormControl(null, Validators.required),
      course_duration_unit: new FormControl(null, Validators.required),
      course_fee: new FormControl(null, Validators.required),
      course_fee_unit: new FormControl(null, Validators.required),
      subjects: new FormArray([]),
    })
  }

  onUpdate() {
    this._loaderService.show();
    if (this.editCourseForm.value.course_in_charge === null
      || this.editCourseForm.value.course_in_charge === ''
      || this.editCourseForm.value.course_in_charge_staffid === null
      || this.editCourseForm.value.course_in_charge_staffid === ''
    ) {
      alert('Please assign a valid staff as course in charge!');
    } else if (this.invalidSubjects(this.editCourseForm.value.subjects)) {
      alert('Please enter valid subjects for the course!');
    } else {
      console.log(this.editCourseForm.value);

      this._academicService.update_course(this.course.id_course, this.editCourseForm.value).subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success) {
          alert('Course Updated Successfully!');
          this.isEdited = true;
          this.cancel();
        } else {
          alert('Error while updating course!');
          console.log(data);
        }
      }, err => {
        this._loaderService.hide();
        alert('Error while updating course!');
        console.log(err);
      })
    }
  }

  invalidSubjects(subjects: any[]) {
    if (subjects.length === 0) {
      return true;
    } else {
      return subjects.some(subject => {
        return subject.subject === null || subject.subject_code === null || subject.subject_duration === null
          || subject.subject === '' || subject.subject_code === '' || subject.subject_duration === '';
      });
    }
  }

  onSearchStaff() {
    // console.log(this.new_course_form.value);
    this.bSearchStaffForEdit = true;
    if (this.editCourseForm.value.course_in_charge === null || this.editCourseForm.value.course_in_charge === "") {
      alert('Please enter valid staff id and search!');
    } else {
      this.getStaffDetailsFromStaffId(this.editCourseForm.value.course_in_charge);
    }
  }

  show_map_staff_form() {
    this.mapStaffForm = new FormGroup({
      staff_name: new FormControl(null),
      staff_id: new FormControl(null),
      id_staff: new FormControl(null)
    })
    this.bShowMapStaffForm = true;
  }
  hide_map_staff_form() {
    this.bShowMapStaffForm = false;
  }

  onSearchStaffForMapping() {
    this.bSearchStaffForEdit = false;
    if (this.mapStaffForm.value.staff_id === null) {
      alert('Please enter valid staff id and search for mapping!');
    } else {
      this.getStaffDetailsFromStaffId(this.mapStaffForm.value.staff_id);
    }
  }

  mapStaff() {
    if (this.mapStaffForm.value.staff_id == null
      || this.mapStaffForm.value.staff_name == null
      || this.mapStaffForm.value.id_staff == null) {
      return alert('Please search valid staff!');
    }

    const ok = confirm(`Are you sure to map the staff ${this.mapStaffForm.value.staff_id} (${this.mapStaffForm.value.staff_name}) to this course?`);
    if (!ok)
      return;
    const mapping_staff = {
      id_staff: this.mapStaffForm.value.id_staff,
      id_course: this.course.id_course,
      remarks: null
    }
    console.log(mapping_staff);
    this._loaderService.show();
    this._academicService.map_course_staff(mapping_staff).subscribe((data: any) => {
      console.log(data);
      this._loaderService.hide();
      if (data.success) {
        alert('Staff mapped successfully!');
        this.getMappingCourseStaff();
        this.mapStaffForm.reset();
      } else {
        alert('Error mapping staff to the course!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error mapping staff to the course!');
      console.log(err);
    })
  }

  remove_staff_course_mapping(id_mapping) {
    const ok = confirm('Are you sure to remove the staff mapping?');
    if(!ok)
      return;
    this._loaderService.show();
    this._academicService.remove_course_staff_mapping(id_mapping).subscribe((data: any) => {
      this._loaderService.hide();
      if(data.success) {
        alert('Staff mapping removed successfuly!');
        this.getMappingCourseStaff();
      } else {
        alert('Error while removing mapping staff to the course!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while removing mapping staff to the course!');
      console.log(err);
    })
  }

  getMappingCourseStaff() {
    this._academicService.get_map_course_staff(this.course.id_course).subscribe((data: any) => {
      if (data.success) {
        this.mapped_staffs = data.data;
        console.log(this.mapped_staffs);
      } else {
        this.mapped_staffs = [];
        console.log('Error getting mapped staffs');
        console.log(data);
      }
    }, (err) => {
      console.log('Error getting mapped staffs');
      this.mapped_staffs = [];
      console.log(err);
    })
  }


  getStaffDetailsFromStaffId(staff_id: number) {
    this._loaderService.show();
    this._staffService.get_staff(staff_id).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success && data.data) {
        if (this.bSearchStaffForEdit) {
          this.editCourseForm.patchValue({
            course_in_charge_staffid: data.data.id_staff,
            course_in_charge: data.data.name
          })
        } else {
          this.mapStaffForm.patchValue({
            staff_id: data.data.name,
            id_staff: data.data.id_staff,
            staff_name: data.data.staff_id
          });
        }
      } else if (data.success && !data.data) {
        alert('No Staff found for the entered staff id!');
        this.editCourseForm.patchValue({
          course_in_charge_staffid: null,
          course_in_charge: null
        })
      } else {
        alert('Error while getting staff details!');
        if (this.bSearchStaffForEdit) {

        } else {
          this.mapStaffForm.patchValue({
            staff_id: null,
            staff_name: null,
            id_staff: null
          });
        }
      }
    }, (err) => {
      console.log(err);
      alert('Error while getting staff details!');
      this._loaderService.hide();
      if (this.bSearchStaffForEdit) {

      } else {
        this.mapStaffForm.patchValue({
          staff_id: null,
          staff_name: null,
          id_staff: null
        });
      }
    });
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

  getMappedSubjects() {
    this._academicService.get_mapped_subjects(this.course.id_course).subscribe((data: any) => {
      if (data.success) {
        // console.log(data)
        this.subjects = data.data;
      } else {
        console.log('Error while getting mapped subjects');
        console.log(data);
      }
    }, (err) => {
      console.log('Error while getting mapped subjects');
      console.log(err);
    })
  }

  getMappedDocuments() {
    this._academicService.get_mapped_documents(this.course.id_course).subscribe((data: any) => {
      if (data.success) {
        // console.log(data)
        this.mapped_documents = data.data;
      } else {
        console.log('Error while getting mapped documents');
        console.log(data);
      }
    }, (err) => {
      console.log('Error while getting mapped documents');
      console.log(err);
    })
  }


  read_document_master() {
    this._academicService.read_document_master().subscribe((data: any) => {
      if (data.success) {
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
