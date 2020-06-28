import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { StudentsService } from 'src/app/services/students.service';
import { FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { MatSlideToggleChange } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { AcademicService } from 'src/app/services/academic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, OnChanges {

  constructor(private _strudentsService: StudentsService,
    private _loaderService: LoaderServiceService,
    private _academicService: AcademicService,
    private _http: HttpClient,
    private _userService: UserService) { }

  perm: any = {};
  bShowStudentDetailCloseButton = true;
  createStudentForm: FormGroup;
  editStudentForm: FormGroup;
  paymentForm: FormGroup;
  student_academic_form: FormGroup;

  bShowCreateStudentForm: boolean = false;
  bShowStudentList: boolean = true;
  bShowStudentDetails: boolean = false;
  bShowDocumentUpload: boolean = false;
  bShowEditForm: boolean = false;
  bShowAddPayment: boolean = false;

  isNewStudentCreated: boolean = false;
  isStudentDetailUpdated: boolean = false;
  isNewPayemtAdded: boolean = false;

  students: any[] = [];
  showingStudent: any;
  showingDocuments: any[] = [];
  avatarLink: string = '../../../assets/avatar.png';

  isProfilePic: boolean = false;
  filename: string = null;
  file: any;
  allowedPictureFormats = ['jpg', 'jpeg', 'png'];
  allowedPDF = ['pdf'];
  isNewDocumentAdded: boolean = false;
  uploadform: NgForm;


  paymentmodes: any[] = [];
  paymentunits: any[] = [];
  studentPayment: any[] = [];

  courses: any[] = [];
  batches: any[] = [];
  formBoundBatch: any[] = [];
  showingStudentCourseDetails: any[] = [];
  @Input('indexOfTab') indexOfTab;
  @ViewChild('fileinput') fileinput: ElementRef;
  @Output() loadPayment: EventEmitter<string>;


  ngOnInit() {
    this.perm = this._userService.get_permission();
    console.log(this.perm);
    this.bShowCreateStudentForm = false;
    this.bShowStudentDetails = false;
    this.bShowStudentList = true;

    if (this.perm.permission_student === '0.2') {
      // Only Show own student details
      this.showStudentDetails(this._userService.userDetails.student_id);
      this.bShowStudentDetailCloseButton = false;

    }
    if (this.perm.permission_student >= '1') {
      this.get_students();
    }
    if (this.perm.permission_student >= '2') {
      this.get_payment_modes();
      this.get_payment_units();
      this.getCourses();
      this.getBatches();
      this.initialize_createStudentForm();
    }
  }

  ngOnChanges(change) {
    this.bShowCreateStudentForm = false;
    this.bShowStudentDetails = false;
    this.bShowStudentList = true;

    if (this.indexOfTab === 0) {
      this.get_students();
    }
  }

  showCreateStudentForm() {
    this.bShowCreateStudentForm = true;
    this.bShowStudentDetails = false;
    this.bShowStudentList = false;
  }
  hideCreateStudentForm() {
    this.bShowCreateStudentForm = false;
    this.bShowStudentDetails = false;
    this.bShowStudentList = true;

    if (this.isNewStudentCreated)
      this.get_students();
    this.isNewStudentCreated = false;
    // this.clearForm();
  }

  showDocumentUpload() {
    this.isProfilePic = false;
    this.filename = null;

    this.bShowStudentDetails = false;
    this.bShowDocumentUpload = true;

  }


  hideDocumentUpload() {
    this.isProfilePic = false;
    this.filename = null;

    this.bShowDocumentUpload = false;
    this.bShowStudentDetails = true;

    if (this.isNewDocumentAdded) {
      this.checkAvatar(this.showingStudent.id_student);
    }
    this.isNewDocumentAdded = false;
  }



  clear(f: NgForm) {
    f.reset();
    if (this.file) {
      this.fileinput.nativeElement.value = null;
    }
    this.file = null;
  }

  onSliderChange(e: MatSlideToggleChange) {
    console.log(e.checked);
    this.isProfilePic = e.checked;
  }


  showStudentDetails(student_id) {
    console.log(student_id);
    this._loaderService.show();
    this._strudentsService.get_student(student_id).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.showingStudent = data.data[0];
        console.log(this.showingStudent);
        this.bShowStudentDetails = true;
        this.bShowCreateStudentForm = false;
        this.bShowStudentList = false;
        this.get_student_course_batch();
        this.checkAvatar(this.showingStudent.id_student);
      } else {
        console.log('Error while fetching student data!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log('Error while fetching student data!');
      console.log(err);
    })


  }

  hideStudentDetails() {
    this.bShowCreateStudentForm = false;
    this.bShowStudentList = true;
    this.bShowStudentDetails = false;
    if (this.isStudentDetailUpdated)
      this.get_students();
    this.isStudentDetailUpdated = false;
  }

  showEditForm() {
    this.initialize_editStudentForm();
    this.bShowStudentDetails = false;
    this.bShowEditForm = true;
    this.initialize_student_academic_form();
  }

  hideEditForm() {
    this.bShowStudentDetails = true;
    this.bShowEditForm = false;
  }

  showAddPayment() {
    this.initialize_paymentform();
    this.get_payments();
    this.bShowStudentDetails = false;
    this.bShowPaymentForm = false;
    this.bShowAddPayment = true;
  }

  hideAddPayment() {
    this.bShowStudentDetails = true;
    this.bShowAddPayment = false;
  }

  get_gender(g: string) {
    return g === 'm' ? 'Male' : g === 'f' ? 'Female' : 'Other';
  }

  bShowPaymentForm: boolean = false;

  show_payment_form() {
    this.paymentForm.reset();
    this.bShowPaymentForm = true;
  }

  hide_payment_form() {
    this.bShowPaymentForm = false;
  }

  edit_payment(payment) {

  }


  onCourseChange() {
    this.student_academic_form.patchValue({ batch: null })
    this.formBoundBatch = this.batches.filter(current => this.student_academic_form.value.course === current.id_course)
  }

  delete_payment(payment, i) {
    const ok = confirm('Are you sure to delete the payment?');
    if (!ok)
      return;
    this._loaderService.show();
    const delete_payment = {
      id_student_payment: payment.id_student_payment,
      modified_by: 'Admin'
    }
    this._strudentsService.delete_student_payment(delete_payment).subscribe((response: any) => {
      this._loaderService.hide();
      if (response.success) {
        alert('Payment deleted successfully!');
        this.studentPayment.splice(i, 1);
      } else {
        alert('Error deleting payment!');
        console.log(response);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err)
      alert('Error deleting payment!');
    });
  }

  initialize_student_academic_form() {
    this.student_academic_form = new FormGroup({
      course: new FormControl(null),
      batch: new FormControl(null),
    })
  }



  initialize_createStudentForm() {
    this.createStudentForm = new FormGroup({
      student_id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      bloodgroup: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      doj: new FormControl(null, Validators.required),
      nationality: new FormControl(null, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      email_p: new FormControl(null),
      permanent_address: new FormControl(null, Validators.required),
      current_address: new FormControl(null, Validators.required)
    })
  }

  initialize_editStudentForm() {
    this.editStudentForm = new FormGroup({
      student_id: new FormControl(this.showingStudent.student_id.toLowerCase(), Validators.required),
      name: new FormControl(this.showingStudent.name, Validators.required),
      gender: new FormControl(this.showingStudent.gender, Validators.required),
      bloodgroup: new FormControl(this.showingStudent.bloodgroup, Validators.required),
      dob: new FormControl(new Date(this.showingStudent.dob), Validators.required),
      doj: new FormControl(new Date(this.showingStudent.doj), Validators.required),
      nationality: new FormControl(this.showingStudent.nationality, Validators.required),
      phone: new FormControl(this.showingStudent.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      email_p: new FormControl(this.showingStudent.email_p),
      email_o: new FormControl(this.showingStudent.email_o),
      permanent_address: new FormControl(this.showingStudent.permanent_address, Validators.required),
      current_address: new FormControl(this.showingStudent.current_address, Validators.required)
    })
  }

  initialize_paymentform() {
    this.paymentForm = new FormGroup({
      transaction_id: new FormControl(),
      invoice_no: new FormControl(null, Validators.required),
      payment_mode: new FormControl(null, Validators.required),
      payment_amount: new FormControl(null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      payment_unit: new FormControl(null, Validators.required),
      payment_date: new FormControl(null, Validators.required),
      remarks: new FormControl(null, Validators.required)
    })
  }



  onSaveStudent() {
    this.createStudentForm.value.dob = moment(this.createStudentForm.value.dob).format('YYYY-MM-DD');
    this.createStudentForm.value.doj = moment(this.createStudentForm.value.doj).format('YYYY-MM-DD');
    this.createStudentForm.value.student_id = this.createStudentForm.value.student_id.toLowerCase();
    console.log(this.createStudentForm.value);
    const newStudent = { ...this.createStudentForm.value, created_by: this._userService.userDetails.staff_id }
    this._loaderService.show();
    this._strudentsService.create_student(newStudent).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.isNewStudentCreated = true;
        alert('Student created successfully!')
        this.clearForm();
      } else {
        alert('Error while creating student!')
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err);
      alert('Error while creating student!');
    })
  }

  updateStudent() {
    this.editStudentForm.value.dob = moment(this.editStudentForm.value.dob).format('YYYY-MM-DD');
    this.editStudentForm.value.doj = moment(this.editStudentForm.value.doj).format('YYYY-MM-DD');
    this.editStudentForm.value.student_id = this.editStudentForm.value.student_id.toLowerCase();
    const student_id = this.editStudentForm.value.student_id;
    console.log(this.editStudentForm.value);
    const updatedStudent = { ...this.editStudentForm.value, modified_by: this._userService.userDetails.staff_id }
    this._loaderService.show();
    this._strudentsService.update_student(this.showingStudent.id_student, updatedStudent)
      .subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success) {
          this.isStudentDetailUpdated = true;
          alert('Student details updated successfully!');

          this._strudentsService.get_student(student_id).subscribe((data: any) => {
            if (data.success) {
              this.showingStudent = data.data[0];
              console.log(this.showingStudent);
              this.checkAvatar(this.showingStudent.id_student);
            } else {
              console.log('Error while fetching student data after update!');
              console.log(data);
            }
          }, (err) => {
            console.log('Error while fetching student data after update!');
            console.log(err);
          });

        } else {
          // alert('Error while updating student details!')
          console.log(data);
        }
      }, (err) => {
        this._loaderService.hide();
        console.log(err);
        alert('Error while updating student details!');
      })
  }

  AddStudentCourseMapping() {
    console.log(this.student_academic_form.value);

    if (!this.student_academic_form.value.course || !this.student_academic_form.value.batch)
      return alert('Please select course and batch!');

    const ok = confirm('Are you sure to map the course and batch?');
    if (!ok)
      return;
    const student_course_batch = {
      course: this.student_academic_form.value.course,
      batch: this.student_academic_form.value.batch,
      id_student: this.showingStudent.id_student
    }
    this._loaderService.show();
    this._strudentsService.add_student_course_mapping(student_course_batch).subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        this.get_student_course_batch();
        alert('Academic details added successfully!');
      } else {
        alert('Error while adding academic details!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while adding academic details!');
      console.log(err);
    })
  }

  RemoveStudentCourseMapping(id) {
    console.log(id);
    const ok = confirm('Are you sure to remove?')
    if (!ok)
      return;
    this._loaderService.show();
    this._strudentsService.remove_student_course_mapping({ id: id }).subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        this.get_student_course_batch();
        alert('Academic details removed successfully!');
      } else {
        alert('Error while removing academic details!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while removing academic details!');
      console.log(err);
    })

  }


  clearForm() {
    this.createStudentForm.reset();
  }
  clearEditForm() {
    this.editStudentForm.reset();
  }

  convert_to_kb(val) {
    return Math.ceil(val / 1024);
  }

  onFileChange(e, f) {
    this.uploadform = f;
    console.log(e.target.files[0]);
    if (e.target.files.length > 0)
      this.file = e.target.files[0];
  }

  get_students() {
    this._loaderService.show();
    this._strudentsService.get_students().subscribe((data: any) => {
      if (data.success) {
        console.log(data)
        this._loaderService.hide();
        this.students = data.data;
        console.log(this.students);
      } else {
        console.log('Error while reading students!');
        console.log(data);
      }
    }, (err) => {
      console.log('Error while reading students!');
      console.log(err);
    })
  }


  loadDocuments() {
    this.get_all_documents(this.showingStudent.id_student);
  }


  get_all_documents(id_staff) {
    this._strudentsService.get_all_documents(id_staff).subscribe((data: any) => {
      if (data.success) {
        this.showingDocuments = data.data;
        console.log(this.showingDocuments);
      } else {
        console.log(data)
      }
    }, (err) => {
      console.log(err);
    })
  }

  uploadFile() {
    console.log('Upload File to backend');
    if (!this.file) {
      return alert('Please select a file');
    }

    if (this.isProfilePic) {
      if (!this.allowedPictureFormats.includes(this.file.type.split('/')[1]))
        return alert('Please select a valid JPG/PNG file!');
    } else {
      if (!this.allowedPDF.includes(this.file.type.split('/')[1]))
        return alert('Please select a valid PDF file!');
    }

    console.log(this.file);
    const formData = new FormData();
    console.log(this.file);
    formData.append('upload', this.file);
    if (this.isProfilePic)
      formData.append('identifier', 'Avatar');
    else
      formData.append('identifier', this.filename);
    formData.append('id_staff', this.showingStudent.id_student);
    formData.append('flag', 'student');
    this._loaderService.show();
    this._http.post('http://localhost:3000/upload', formData).subscribe((response: any) => {
      this._loaderService.hide();
      if (response.success) {
        this.isNewDocumentAdded = true;
        alert('File uploaded successfully!');
        this.clear(this.uploadform);
      } else {
        alert('Error in uploading file!');
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err)
      alert('Error in uploading file!');
    });
  }


  download(uniqid) {
    console.log('downloading doc with uniqid :: ' + uniqid);
    this._strudentsService.download_file(uniqid).subscribe((respnse: any) => {
      console.log(respnse);
      if (respnse.success) {
        let blob = new Blob([new Uint8Array(respnse.data.data)], { type: respnse.mimetype });
        saveAs(blob, respnse.originalname);
      } else {
        alert('Unable to download the file, File not found!');
        console.log(respnse);
      }
    }, (err) => {
      if (err.status === 404)
        alert('Unable to download the file, File not found!')
      console.log(err, err.status);
    })
  }

  checkAvatar(id) {
    this._strudentsService.check_avatar(id).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.avatarLink = 'http://localhost:3000/avatar/student/' + this.showingStudent.id_student;
      }
      console.log(this.avatarLink);
    }, err => {
      this.avatarLink = "../../../assets/avatar.png";
      console.log(err);
    })
  }

  get_payment_modes() {
    this._strudentsService.get_payment_modes().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.paymentmodes = data.data;
        console.log(data);
      } else {

        console.log('Error while getting payment modes!');
        console.log(data);
      }
    }, err => {
      console.log('Error while getting payment modes!');
      console.log(err);
    })
  }

  get_payment_units() {
    this._strudentsService.get_payment_units().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.paymentunits = data.data;
        console.log(data);
      } else {

        console.log('Error while getting payment units!');
        console.log(data);
      }
    }, err => {
      console.log('Error while getting payment units!');
      console.log(err);
    })
  }

  save_payment() {
    const payment = { ...this.paymentForm.value };
    payment.payment_date = moment(payment.payment_date).format('YYYY-MM-DD');
    payment.created_by = 'Admin';
    payment.id_student = this.showingStudent.id_student;
    console.log(payment);

    this._loaderService.show();
    this._strudentsService.add_payment(payment).subscribe((response: any) => {
      this._loaderService.hide();
      if (response.success) {
        this.isNewPayemtAdded = true;
        this.get_payments();
        alert('Payment added successfully!');
        // this.hide_payment_form();
        this.paymentForm.reset();
      } else {
        alert('Error adding payment!');
        console.log(response);
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err)
      alert('Error adding payment!');
    });
  }

  clear_payment_form() {
    this.paymentForm.reset();
  }

  get_payments() {
    this._strudentsService.get_student_payment(this.showingStudent.id_student).subscribe((data: any) => {
      if (data.success) {
        this.studentPayment = data.data;
        console.log(data);
      } else {
        console.log('Error while getting strudent payment!');
        this.studentPayment = [];
      }
    }, err => {
      console.log('Error while getting payment payment!');
      console.log(err);
      this.studentPayment = [];
    })
  }

  get_student_course_batch() {
    this._strudentsService.get_student_course(this.showingStudent.id_student)
      .subscribe((data: any) => {
        if (data.success) {
          this.showingStudentCourseDetails = data.data;
          console.log(this.showingStudentCourseDetails);
        } else {
          console.log('Error while getting get_student_course_batch!');
          this.showingStudentCourseDetails = [];
        }
      }, err => {
        console.log('Error while getting get_student_course_batch!');
        console.log(err);
        this.showingStudentCourseDetails = [];
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
