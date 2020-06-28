import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { saveAs } from 'file-saver';
import { LoaderServiceService } from '../services/loader-service.service';
import { NgForm } from '@angular/forms';
import { FileService } from '../services/file.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  constructor(private _fileService: FileService,
     private _loaderService: LoaderServiceService,
     private _userService: UserService) { }
  policyname: string = null;
  file: any;
  policies: any[] = [];
  form: NgForm;
  isAdmin: boolean = true;
  perm: any = {}
  @ViewChild('fileinput') fileinput: ElementRef;

  bShowPolicyList: boolean = true;
  bShowUploadForm: boolean = false;
  allowedPDF = ['pdf'];
  isPolicyAdded: boolean = false;

  
  ngOnInit() {
    this.perm = this._userService.get_permission();
    this.read_all_policy();
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
    // console.log(this.fileinput);
    if (this.file) {
      this.fileinput.nativeElement.value = null;
    }
  }


  showDocumentUpload() {
    this.bShowPolicyList = false;
    this.bShowUploadForm = true;
  }
  hideDocumentUpload() {
    if(this.isPolicyAdded)
      this.read_all_policy();
    this.bShowPolicyList = true;
    this.bShowUploadForm = false;
    this.isPolicyAdded = false;
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

      formData.append('identifier', this.policyname);
    formData.append('id_staff', '0');
    formData.append('flag', 'policy');
    this._loaderService.show();
    this._fileService.upload(formData).subscribe((response: any) => {
      this._loaderService.hide();
      if (response.success) {
        this.isPolicyAdded = true;
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
        saveAs(blob, 'samet_policy_' + identifier);
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
        alert('Policy removed successfully!');
        this.read_all_policy();
      } else {
        alert('Error while removing policy!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while removing policy!');
      console.log(err);
    })
  }

  read_all_policy() {
    this._loaderService.show();
    this._fileService.read_policies().subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        this.policies = data.data;
        console.log(this.policies);
      } else {
        console.log('Error in reading policies');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      this.policies = [];
      console.log('Error in reading policies');
      console.log(err);
    })
  }


}
