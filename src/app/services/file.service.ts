import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private _http: HttpClient) { }
  URL: string = 'http://localhost:3000';

  upload(formdata: FormData) {
    return this._http.post(this.URL + '/upload', formdata);
  }

  download(uniqid: string) {
    return this._http.get(this.URL + '/download/' + uniqid);
  }

  delete(uniqid: string) {
    return this._http.delete(this.URL + '/deletedocument/' + uniqid);
  }

  read_policies() {
    return this._http.get(this.URL + '/policy');
  }

  read_notices() {
    return this._http.get(this.URL + '/notice');
  }

}
