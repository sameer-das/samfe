import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail-department-dialog',
  templateUrl: './detail-department-dialog.component.html',
  styleUrls: ['./detail-department-dialog.component.css']
})
export class DetailDepartmentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetailDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }

  close(){
    this.dialogRef.close();
  }
}
