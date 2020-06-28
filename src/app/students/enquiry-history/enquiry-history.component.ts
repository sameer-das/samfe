import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StudentsService } from 'src/app/services/students.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AcademicService } from 'src/app/services/academic.service';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-enquiry-history',
  templateUrl: './enquiry-history.component.html',
  styleUrls: ['./enquiry-history.component.css']
})
export class EnquiryHistoryComponent implements OnInit, OnChanges {

  constructor(private _studentService: StudentsService,
    private _academicService: AcademicService,
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }
  perm: any = {};
  enquiries: any[] = [];
  message: string = null;

  bShowEnquiryList: boolean = true;
  bShowEnquiryDetail: boolean = false;
  bShowEnquiryEdit: boolean = false;

  showingEnquiry: any = null;
  edit_enquiry_form: FormGroup;
  enquiryUpdated: boolean = false;

  courses: any[] = [];
  batches: any[] = [];
  formBoundBatches: any[] = [];

  @Input('indexOfTab') indexOfTab;
  ngOnInit() {
    this.message = 'Loading...';
    this.perm = this._userService.get_permission();
    if(this.perm.permission_studentenquiry >= 1) {
      this.get_enquiries();
    }
  }

  ngOnChanges() {
    // console.log(this.indexOfTab);
    // if(this.indexOfTab >= 1)
    if(this.perm.permission_studentenquiry >= 1)
      this.get_enquiries();

    if (this.perm.permission_studentenquiry >= 2) {
      this.getCourses();
      this.getBatches();
    }
  }


  onDetail(id_enquiry) {
    // console.log('Details :: ', id_enquiry);
    this._loaderService.show();
    this._studentService.get_enquiry_details(id_enquiry).subscribe((data: any) => {
      console.log(data);
      this._loaderService.hide();
      if (data.success) {
        this.showingEnquiry = data.data;
        this.bShowEnquiryDetail = true;
        this.bShowEnquiryList = false;
        this.bShowEnquiryEdit = false;
        this.formBoundBatches = this.batches.filter(curr =>
          this.showingEnquiry.enquiry.id_course === curr.id_course
        );
        console.log(this.formBoundBatches);
        if(this.enquiryUpdated) {
          let ind = this.enquiries.findIndex(current => {
            return current.id_enquiry == this.showingEnquiry.enquiry.id_enquiry;
          });
          // console.log(this.enquiries);
          console.log('Index  is ', ind);          
          console.log(this.enquiries);
          this.enquiries.splice(ind,1,{
            batch: this.showingEnquiry.enquiry.batch,
            course: this.showingEnquiry.enquiry.course,
            created_by: this.showingEnquiry.enquiry.created_by,
            created_on: this.showingEnquiry.enquiry.created_on,
            id_enquiry: this.showingEnquiry.enquiry.id_enquiry,
            student_email: this.showingEnquiry.enquiry.student_email,
            student_mobile: this.showingEnquiry.enquiry.student_mobile,
            student_name: this.showingEnquiry.enquiry.student_name,
          });
          this.enquiryUpdated = false;
        }
      } else {
        alert('Error while fetching enquiry details!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while fetching enquiry details!');
      console.log(err);
    })
  }

  hideEnquiryDetail() {
    this.bShowEnquiryDetail = false;
    this.bShowEnquiryList = true;
    this.bShowEnquiryEdit = false;
    this.showingEnquiry = null;
  }

  onEdit() {
    console.log('Editing');
    this.bShowEnquiryDetail = false;
    this.bShowEnquiryList = false;
    this.bShowEnquiryEdit = true;

    this.edit_enquiry_form = new FormGroup({
      student_name: new FormControl(this.showingEnquiry.enquiry.student_name, Validators.required),
      mobile: new FormControl(this.showingEnquiry.enquiry.student_mobile),
      email: new FormControl(this.showingEnquiry.enquiry.student_email),
      course: new FormControl(this.showingEnquiry.enquiry.id_course, Validators.required),
      batch: new FormControl(this.showingEnquiry.enquiry.id_batch, Validators.required),
      source_of_info: new FormControl(this.showingEnquiry.enquiry.information_source),
      remarks: new FormControl(this.showingEnquiry.enquiry.remarks),
      communications: new FormArray([])
    });
  }

  onCourseChange() {
    this.formBoundBatches = this.batches.filter(curr =>
      this.edit_enquiry_form.value.course === curr.id_course
    );
    this.edit_enquiry_form.patchValue({batch: null});
  }

  hideEnquiryEdit() {
    this.bShowEnquiryDetail = true;
    this.bShowEnquiryList = false;
    this.bShowEnquiryEdit = false;
  }


  add_communications_row() {
    (<FormArray>this.edit_enquiry_form.get("communications")).push(
      this.new_communication_row()
    );
  }

  delete_communications_row(i: number) {
    (<FormArray>this.edit_enquiry_form.get("communications")).removeAt(i);
  }

  new_communication_row(): FormGroup {
    return new FormGroup({
      date: new FormControl(),
      message: new FormControl()
    });
  }

  update() {
    console.log(this.edit_enquiry_form.value)
    const updated_enquiry = { ...this.edit_enquiry_form.value };
    updated_enquiry.modified_by = this._userService.userDetails.staff_id;
    updated_enquiry.id_enquiry = this.showingEnquiry.enquiry.id_enquiry;
    if (updated_enquiry.communications.length > 0) {
      updated_enquiry.communications = updated_enquiry.communications.map(current => {
        return {
          date: moment(current.date).format('YYYY-MM-DD'),
          message: current.message,
          comm_by: this._userService.userDetails.staff_id
        }
      })
    }

    console.log(updated_enquiry);
    this._loaderService.show();
    this._studentService.update_enquiry(updated_enquiry).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Enquiry updated successfuly!');
        this.enquiryUpdated = true;
        this.onDetail(this.showingEnquiry.enquiry.id_enquiry);        
      } else {
        console.log('Error updating the enquiry')
        alert('Error updating the enquiry');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log('Error updating the enquiry')
      alert('Error updating the enquiry');
      console.log(err);
    })
  }

  onDelete() {
    const ok = confirm('Are you sure to delete the enquiry?');
    if (!ok)
      return;
    this._loaderService.show();
    const deleted_enquiry = {
      id_enquiry: this.showingEnquiry.enquiry.id_enquiry,
      modified_by: this._userService.userDetails.staff_id
    }
    this._studentService.delete_enquiry(deleted_enquiry).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Enquiry deleted successfuly!');
        this.get_enquiries();
        this.hideEnquiryDetail();
      } else {
        console.log('Error deleting the enquiry!')
        alert('Error deleting the enquiry');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log('Error updating the enquiry')
      alert('Error updating the enquiry');
      console.log(err);
    })

  }

  get_enquiries() {
    this._studentService.get_enquiries().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.enquiries = data.data;
        this.message = null;
        if (this.enquiries.length == 0)
          this.message = 'No Enquiries Found!'
      } else {
        console.log('Error while fetching enquiries.');
        console.log(data);
        this.message = 'Error while fetching enquiries.';
      }
    }, (err) => {
      console.log('Error while fetching enquiries.');
      this.message = 'Error while fetching enquiries.';
      console.log(err);
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
