import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private _http: HttpClient) { }
  url = "http://localhost:3000";

  create_student(student) {
    return this._http.post(this.url + '/student', student);
  }
  get_students() {
    return this._http.get(this.url + '/students');
  }
  get_student(student_id) {
    return this._http.get(this.url + '/student?student_id=' + student_id);
  }
  update_student(id_student, updated_student) {
    return this._http.patch(this.url + '/student/' + id_student, updated_student);
  }

  get_all_documents(id_staff) {
    return this._http.get(this.url + '/student/documents/' + id_staff);
  }
  check_avatar(id) {
    return this._http.get(this.url + '/avatar/check/student/' + id);
  }
  download_file(uniqid) {
    return this._http.get(this.url + '/download/' + uniqid);
  }

  get_payment_modes() {
    return this._http.get(this.url + '/paymentmodes');
  }

  get_payment_units() {
    return this._http.get(this.url + '/paymentunits');
  }

  add_payment(payment) {
    return this._http.post(this.url + '/payment', payment);
  }

  get_student_payment(id_student) {
    return this._http.get(this.url + '/payment' + '?id_student=' + id_student);
  }

  delete_student_payment(delete_payement) {
    return this._http.post(this.url + '/paymentdelete', delete_payement);
  }

  get_student_course(id_student) {
    return this._http.get(this.url + '/studentcourse?id_student=' + id_student);
  }
  add_student_course_mapping(student_course_batch) {
    return this._http.post(this.url + '/studentcourse', student_course_batch);
  }

  remove_student_course_mapping(demap) {
    return this._http.patch(this.url + '/studentcoursedemap', demap);
  }


  create_enquiry(enquiry) {
    return this._http.post(this.url + '/enquiry', enquiry);
  }

  get_enquiries() {
    return this._http.get(this.url + '/enquiry');
  }

  get_enquiry_details(id_enquiry) {
    return this._http.get(this.url + '/enquirydetails?id_enquiry=' + id_enquiry)
  }

  update_enquiry(updated_enquiry) {
    return this._http.patch(this.url + '/enquiry', updated_enquiry);
  }
  delete_enquiry(deleted_enquiry) {
    return this._http.patch(this.url + '/deleteenquiry', deleted_enquiry);
  }

}
