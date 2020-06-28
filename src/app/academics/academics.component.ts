import { Component, OnInit } from '@angular/core';
import { LoaderServiceService } from '../services/loader-service.service';
import { AcademicService } from '../services/academic.service';
import { NgForm } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.css']
})
export class AcademicsComponent implements OnInit {

  constructor(private _academicService: AcademicService,
    private _loaderService: LoaderServiceService,
    private _userService: UserService) { }

  showNewAcademicDepartmentForm: boolean;
  showNewAwardingbodyForm: boolean;

  awardingbodies: any[] = [];
  academicDepartments: any[] = [];
  selectedTab: number;
  perm: any = {};

  ngOnInit() {
    this.perm = this._userService.get_permission();
  }
  onTabChange(e: MatTabChangeEvent) {
    // console.log(e);
    this.selectedTab = e.index;
    if (this.selectedTab === 1) {
      console.log('This is department');
      this.showNewAcademicDepartmentForm = false;
      this.showNewAwardingbodyForm = false;
      this.getAwardingBodies();
      this.getAcademicDepartments();
    }
  }
  openCreateNewAcademicDepartment() {
    this.showNewAwardingbodyForm = false;
    this.showNewAcademicDepartmentForm = true;
  }

  openCreateNewAwardingbody() {
    this.showNewAcademicDepartmentForm = false;
    this.showNewAwardingbodyForm = true;
  }

  closeForms() {
    this.showNewAwardingbodyForm = false;
    this.showNewAcademicDepartmentForm = false;
  }


  saveNewAwardingbody(f: NgForm) {
    console.log(f);
    this._loaderService.show();
    this._academicService.create_awardingbody(f.value).subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        alert('New awarding body saved successfully');
        f.reset();
        this.getAwardingBodies();
      } else {
        this._loaderService.hide();
        alert('Error while saving new awarding body!');
        console.log(data.data);
      }
    }, (err) => {
      console.log('Error while saving new awarding body');
      console.log(err);
    });
  }

  saveNewAcademicDepartment(f: NgForm) {
    console.log(f.value);
    // console.log(newAcademicDepartment);
    this._loaderService.show();
    this._academicService.create_academicdepartment(f.value).subscribe((data: any) => {
      if (data.success) {
        this._loaderService.hide();
        alert('New Academic Department saved successfully');
        f.reset();
        this.getAcademicDepartments();
      } else {
        this._loaderService.hide();
        alert('Error while saving new academic department!');
        console.log(data.data);
      }
    }, (err) => {
      console.log('Error while saving new academic department');
      console.log(err);
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

}
