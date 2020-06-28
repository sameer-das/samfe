import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LibraryService } from 'src/app/services/library.service';
import * as moment from 'moment';
@Component({
  selector: 'app-issuebookform',
  templateUrl: './issuebookform.component.html',
  styleUrls: ['./issuebookform.component.css']
})
export class IssuebookformComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<IssuebookformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _libraryService: LibraryService) { }
  showBookDetail: boolean = false;
  searchBookId: string = null;
  bookDetail: any = null;
  startDate: Date;
  endDate: Date;
  display_message: string = null;
  bShowMessage: boolean = false;
  ngOnInit() {
    console.log(this.data)
  }

  closeModal() {
    this.dialogRef.close({ data: null });
  }

  onSearchBook() {
    console.log('Searched')
    if (this.searchBookId) {
      this._libraryService.get_book_fromid(this.searchBookId.toLowerCase()).subscribe((data: any) => {
        if (data.success && data.data.length) {
          this.bookDetail = data.data[0];
          this.showBookDetail = true;
          this.startDate = new Date();
          this.endDate = moment(new Date()).add(7,'days').toDate();
          this.display_message = null;
          this.bShowMessage = false;
        } else if (data.success && !data.data.length) {
          this.display_message = 'No Books found with above ID!';
          this.bShowMessage = true;
          this.showBookDetail = false;
          this.bookDetail = null;
        } else {
          this.bShowMessage = false;
          console.log('Error while getting book details from book id!');
          console.log(data)
        }
      }, err => {
        this.bShowMessage = false;
        console.log('Error while getting book details from book id!');
        console.log(err);
      })

    }
  }
  onClearBookSearch() {
    this.showBookDetail = false;
    this.bShowMessage = false;
    this.display_message = null;
  }
  AddBook() {
    console.log(this.bookDetail, this.startDate, this.endDate);
    this.bookDetail.issued_on = moment(this.startDate).format('YYYY-MM-DD');
    this.bookDetail.issued_till = moment(this.endDate).format('YYYY-MM-DD');
    this.bookDetail.isNewlyAdded = true;
    this.dialogRef.close({ data: this.bookDetail });
  }
}
