import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {

  constructor(private _http: HttpClient) { }
  url = 'http://localhost:3000';

  create_awardingbody(awardingbody) {
    return this._http.post(this.url + '/academic/awardingbody', awardingbody);
  }

  get_awardingbodies() {
    return this._http.get(this.url + '/academic/awardingbody');
  }

  create_academicdepartment(academicdepartment) {
    return this._http.post(this.url + '/academic/academicdepartment', academicdepartment);
  }

  get_academicdepartments() {
    return this._http.get(this.url + '/academic/academicdepartment');
  }

  get_mapped_subjects(id) {
    return this._http.get(this.url + '/subjects/' + id);
  }
  get_mapped_documents(id) {
    return this._http.get(this.url + '/documentmapping/' + id);
  }





  create_course(course) {
    return this._http.post(this.url + '/academic/course', course);
  }

  get_courses() {
    return this._http.get(this.url + '/academic/course');
  }

  update_course(id, updatingDoc) {
    return this._http.patch(this.url + '/academic/course/' + id, updatingDoc);
  }
  
  map_course_staff(course_staff) {
    return this._http.post(this.url + '/mapcoursestaff', course_staff);
  }

  get_map_course_staff(id_course) {
    return this._http.get(this.url + '/mapcoursestaff?id_course='+ id_course);
  }
  get_staff_map_course(staff_id) {
    return this._http.get(this.url + '/staffmappedcourse?id_course='+ staff_id);
  }
  remove_course_staff_mapping(id_mapping) {
    return this._http.post(this.url + '/removemapcoursestaff', {id_mapping});
  }




  create_batch(batch) {
    return this._http.post(this.url + '/batch', batch);
  }

  get_batches() {
    return this._http.get(this.url + '/batch');
  }



  read_document_master() {
    return this._http.get(this.url + '/documentmaster');
  }
  get_campus_master() {
    return this._http.get(this.url + '/campus');
  }


  create_room(room) {
    return this._http.post(this.url + '/rooms', room);
  }
  get_rooms() {
    return this._http.get(this.url + '/rooms');
  }
  get_room(id) {
    return this._http.get(this.url + '/rooms/' + id);
  }
  update_room(id, updatedRoom) {
    return this._http.patch(this.url + '/rooms/' + id, updatedRoom);
  }
}
