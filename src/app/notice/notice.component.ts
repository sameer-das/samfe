import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoaderServiceService } from '../services/loader-service.service';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { FileService } from '../services/file.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {


  constructor(private _fileService: FileService, 
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }
  noticename: string = null;
  file: any;
  notices: any[] = [];
  form: NgForm;
  isAdmin: boolean = true;

  @ViewChild('fileinput') fileinput: ElementRef;

  bShowNoticeList: boolean = true;
  bShowUploadForm: boolean = false;
  allowedPDF = ['pdf'];
  isNoticeAdded: boolean = false;
  perm: any = {};
  ngOnInit() {
    this.perm = this._userService.get_permission();
    this.read_all_notices();
  }

  convert_to_kb(val) {
    return Math.ceil(val / 1024);
  }

  onFileChange(e, f) {
    this.form = f;
    console.log(e);
    if (e.target.files.length > 0)
      this.file = e.target.files[0];
  }

  clear(f: NgForm) {
    f.reset();
    if (this.file) {
      this.fileinput.nativeElement.value = null;
    }
  }


  showDocumentUpload() {
    this.bShowNoticeList = false;
    this.bShowUploadForm = true;
  }
  hideDocumentUpload() {
    if (this.isNoticeAdded)
      this.read_all_notices();
    this.bShowNoticeList = true;
    this.bShowUploadForm = false;
    this.isNoticeAdded = false;
  }

  uploadFile() {
    console.log('Upload File to backend');
    if (!this.file) {
      return alert('Please select a file');
    }

    if (!this.allowedPDF.includes(this.file.type.split('/')[1]))
      return alert('Please select a valid PDF file!');


    console.log(this.file);
    const formData = new FormData();
    console.log(this.file);
    formData.append('upload', this.file);
    formData.append('identifier', this.noticename);
    formData.append('id_staff', '0');
    formData.append('flag', 'notice');
    this._loaderService.show();
    this._fileService.upload(formData).subscribe((response: any) => {
      this._loaderService.hide();
      if (response.success) {
        this.isNoticeAdded = true;
        alert('File uploaded successfully!');
        this.clear(this.form);
      } else {
        alert('Error in uploading file!');
      }
    }, (err) => {
      this._loaderService.hide();
      console.log(err)
      alert('Error in uploading file!');
    });
  }


  download(uniqid, identifier) {
    console.log('downloading doc with uniqid :: ' + uniqid);
    this._fileService.download(uniqid).subscribe((respnse: any) => {
      console.log(respnse);
      if (respnse.success) {
        let blob = new Blob([new Uint8Array(respnse.data.data)], { type: respnse.mimetype });
        saveAs(blob, 'samet_notice_' + identifier);
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

  delete_file(uniqid) {
    this._loaderService.show();
    this._fileService.delete(uniqid).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Notice removed successfully!');
        this.read_all_notices();
      } else {
        alert('Error while removing notice!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while removing notice!');
      console.log(err);
    })
  }

  read_all_notices() {
    this._loaderService.show();
    this._fileService.read_notices().subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.notices = data.data;
        console.log(this.notices);
      } else {
        console.log('Error in reading notices');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      this.notices = [];
      console.log('Error in reading notices');
      console.log(err);
    })
  }


}
