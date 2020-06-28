import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { StaffService } from 'src/app/services/staff.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { EditStaffDetailsDialogComponent } from './edit-staff-details-dialog/edit-staff-details-dialog.component';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { UserService } from 'src/app/services/user.service';
import { AcademicService } from 'src/app/services/academic.service';


@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.css']
})

export class StaffDetailsComponent implements OnInit, OnChanges {

  constructor(private _matDialog: MatDialog,
    private _staffService: StaffService,
    private _loaderService: LoaderServiceService,
    private _http: HttpClient,
    private _academicService: AcademicService,
    private _userService: UserService) { }
  bShowStudentDetailCloseButton: boolean = true;
  perm: any = {};
  staffs: any[] = [];
  bShowDocumentDetails: boolean = false;
  bShowNewUploadForm: boolean = false;
  bShowStaffDetails: boolean = false;
  bShowDocumentUpload: boolean = false;
  bShowStaffList: boolean = false;
  isProfilePic: boolean = false;
  showingStaff: any;
  showingDocuments: any[] = [];
  showingCourses: any[] = [];
  
  isStaffEdited: boolean = false;

  filename: string;
  uploadform: NgForm;
  file: any;
  allowedPictureFormats = ['jpg', 'jpeg', 'png'];
  allowedPDF = ['pdf'];
  avatarLink = "../../../assets/avatar.png";
  isNewDocumentAdded: boolean = false;
  @ViewChild('fileinput') fileinput: ElementRef;
  @Input('indexOfTab') indexOfTab: number;
  
  ngOnChanges(change) {
    // console.log(this.indexOfTab)
    if (this.indexOfTab == 0) {
      // console.log(this.perm)
      if (+this.perm.permission_staff >= 1) {
        this.showStaffList();
        this.bShowStaffDetails = false;
        this.bShowDocumentUpload = false;
        this.isNewDocumentAdded = false;
        this.getStaffs();
      }
      // if (this.perm.permission_staff === '0.2') {
      //   this.bShowStudentDetailCloseButton = false;
      //   this.get_staff(this._userService.userDetails.staff_id);
      // }
      
    }
  }

  getStaffs() {
    this._loaderService.show();
    this._staffService.get_staffs().subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this._loaderService.hide();
        this.staffs = data.data;
        console.log(this.staffs);
        if (this.isStaffEdited) {
          const id = this.showingStaff.id_staff;
          console.log(id);
          this.showingStaff = this.staffs.filter(cur => cur.id_staff === id)[0];
          console.log(this.showingStaff);
          this.isStaffEdited = false;
        }
      } else {
        console.log(data);
        this._loaderService.hide();
      }
    }, err => {
      console.log(err);
      this._loaderService.hide()
    });

  }

  ngOnInit() {
    this.bShowStaffDetails = false;
    this.bShowDocumentUpload = false;
    this.isNewDocumentAdded = false;

    this.perm = this._userService.get_permission();
    if (this.perm.permission_staff >= 1) {
      this.showStaffList();
      this.getStaffs();
    }
    if (this.perm.permission_staff === '0.2') {
      this.bShowStudentDetailCloseButton = false;
      this.get_staff(this._userService.userDetails.staff_id)
    }
  }
  // Step 1
  showStaffList() {
    this.bShowStaffList = true;
  }
  hideStaffList() {
    this.bShowStaffList = false;
  }

  // Step 2
  showStaffDetails(staff) {
    console.log(staff);
    this.bShowStaffList = false;
    this.bShowDocumentUpload = false;
    this.showingStaff = staff;
    this.avatarLink = "../../../assets/avatar.png";
    this.checkAvatar(this.showingStaff.id_staff);
    this.bShowStaffDetails = true;
  }

  hideStaffDetails() {
    this.bShowStaffDetails = false;
    this.bShowDocumentUpload = false;
    this.bShowStaffList = true;
    this.showingStaff = null;
  }
  // Step 3
  showDocumentUpload() {
    this.isProfilePic = false;
    this.filename = null;

    this.bShowStaffDetails = false;
    this.bShowDocumentUpload = true;

  }

  hideDocumentUpload() {
    this.isProfilePic = false;
    this.filename = null;

    this.bShowDocumentUpload = false;
    this.bShowStaffDetails = true;

    if (this.isNewDocumentAdded) {
      this.checkAvatar(this.showingStaff.id_staff);
    }
    this.isNewDocumentAdded = false;
  }


  onSliderChange(e: MatSlideToggleChange) {
    console.log(e.checked);
    this.isProfilePic = e.checked;
  }
  hideDocumentDetails() {
    this.hideUploadForm();
    this.bShowDocumentDetails = false;
  }

  showDocumentDetails(staff: any) {
    this.showingStaff = staff;
    // this.get_all_documents(this.showingStaff.id_staff);
    console.log('Show document details for ', this.showingStaff);
    this.bShowDocumentDetails = true;
  }

  showUploadForm() {
    this.bShowNewUploadForm = true;
  }
  hideUploadForm() {

    this.bShowNewUploadForm = false;
  }

  convert_to_kb(val) {
    return Math.ceil(val / 1024);
  }

  get_gender(g) {
    return g === 'm' ? 'Male' : g === 'f' ? 'Female' : 'Other';
  }

  openEditStaffDetailPopup() {
    const dialogRef = this._matDialog.open(EditStaffDetailsDialogComponent,
      { disableClose: true, data: this.showingStaff });

    dialogRef.afterClosed().subscribe(datafrommodal => {
      console.log
      if (datafrommodal.data) {
        this.getStaffs();
        this.isStaffEdited = datafrommodal.data;
      }
    });
  }

  loadDocuments() {
    this.get_all_documents(this.showingStaff.id_staff);
  }

  loadCourses(){
    this.get_staff_mapped_courses(this.showingStaff.staff_id);
  }

  get_all_documents(id_staff) {
    this._staffService.get_all_documents(id_staff).subscribe((data: any) => {
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
  
  get_staff_mapped_courses(staff_id) {
    this._academicService.get_staff_map_course(staff_id).subscribe((data: any) => {
      if (data.success) {
        this.showingCourses = data.data;
        console.log(this.showingCourses);
      } else {
        console.log(data)
      }
    }, (err) => {
      console.log(err);
    })
  }

  onFileChange(e, f) {
    this.uploadform = f;
    console.log(e.target.files[0]);
    if (e.target.files.length > 0)
      this.file = e.target.files[0];
  }

  clear(f: NgForm) {
    f.reset();
    if (this.file) {
      this.fileinput.nativeElement.value = null;
    }
    this.file = null;
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
    formData.append('id_staff', this.showingStaff.id_staff);
    formData.append('flag', 'staff');
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
    this._staffService.download_file(uniqid).subscribe((respnse: any) => {
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
    this._staffService.check_avatar(id).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.avatarLink = 'http://localhost:3000/avatar/staff/' + this.showingStaff.id_staff;
      }
      console.log(this.avatarLink);
    }, err => {
      this.avatarLink = "../../../assets/avatar.png";
      console.log(err);
    })
  }

  get_staff(staff_id) {
    this._loaderService.show();
    this._staffService.get_staff(staff_id.toLowerCase()).subscribe((data: any) => {
      this._loaderService.hide();
      console.log(data);
      if (data.success) {
        this.showStaffDetails(data.data);
      } else {
        console.log('Error getting staff details');
        console.log(data)
      }
    }, (err) => {
      this._loaderService.hide();
      console.log('Error getting staff details');
      console.log(err)
    })
  }


}


