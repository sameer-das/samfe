import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IssuebookformComponent } from './issuebookform/issuebookform.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LibraryService } from '../services/library.service';
import { LoaderServiceService } from '../services/loader-service.service';
import { StudentsService } from '../services/students.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { StaffService } from '../services/staff.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  constructor(private _matDialog: MatDialog,
    private _libraryService: LibraryService,
    private _loaderService: LoaderServiceService,
    private _studentService: StudentsService,
    private _staffService: StaffService) { }

  bShowAddNewBookForm: boolean = false;
  bShowIssueForm: boolean = false;
  bShowReturnForm: boolean = false;
  bShowSearchBook: boolean = true;
  bShowBookEditForm: boolean = false;
  bShowReport: boolean = false;

  currentEditBook: any = null;
  avatarLink: string = '../../assets/avatar.png';
  bShowUserForIssue: boolean = false;

  bShowBookDetailForReturn: boolean = false;

  @ViewChild('refInputReturn') refInputReturn: ElementRef;

  bookSearchValue: string = null;
  bookSearchResult: any[] = [];

  searchUserBy: string = 'student';
  userSearchValue: string = null;
  userSearchResult: any = null;

  searchBookIdReturn: string = null;
  searchBookIdReturnResult: any = null;

  add_book_form: FormGroup;
  edit_book_form: FormGroup;
  issuing_book_array: any[] = [];
  return_remark: string = null;

  report_book: FormGroup;
  report_user: FormGroup;
  report_book_result: any[] = [];
  report_user_result: any[] = [];

  ngOnInit() {
    this.initialize_add_book_form();
    // this.getCookieBackend();
  }

  showAddNewBookForm() {
    this.bShowSearchBook = false;
    this.bShowAddNewBookForm = true;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;
    this.bShowReport = false;
  }

  hideAddNewBookForm() {
    this.bShowSearchBook = true;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;


  }

  showIssueForm() {
    this.bShowSearchBook = false;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = true;
    this.bShowReturnForm = false;
    this.bShowReport = false;
  }

  hideIssueForm() {
    this.bShowSearchBook = true;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;

    this.bShowUserForIssue = false;
  }

  showReturnForm() {
    this.bShowSearchBook = false;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = true;
    this.bShowReport = false;

    this.searchBookIdReturn = null;
    this.searchBookIdReturnResult = null;
    this.return_remark = null;
  }

  hideReturnForm() {
    this.bShowSearchBook = true;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;

    this.bShowBookDetailForReturn = false;
    this.searchBookIdReturn = null;
    this.searchBookIdReturnResult = null;
  }

  showEditBookForm(book) {
    console.log(book);
    this.currentEditBook = book;
    this.initialize_edit_book_form();
    this.bShowSearchBook = false;
    this.bShowBookEditForm = true;
    this.bShowReport = false;
  }
  hideEditBookForm() {

    this.bShowBookEditForm = false;
    this.bShowSearchBook = true;
    this.currentEditBook = null;
  }

  showReport() {
    this.initialize_report_forms();
    this.bShowReport = true;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;
    this.bShowSearchBook = false;
    this.bShowBookEditForm = false;
  }

  hideReport() {

    this.bShowReport = false;
    this.bShowAddNewBookForm = false;
    this.bShowIssueForm = false;
    this.bShowReturnForm = false;
    this.bShowSearchBook = true;
    this.bShowBookEditForm = false;
  }

  reportTabChanged(e) {
    // console.log(e);

  }

  initialize_report_forms() {
    this.report_book = new FormGroup({
      book_id: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required),
    });

    this.report_user = new FormGroup({
      user_id: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required),
      user_type: new FormControl('student'),
    });

    this.report_user_result = [];
    this.report_book_result = [];
  }

  fetch_report_book() {
    this.report_book_result = [];
    const report = {
      book_id: this.report_book.value.book_id,
      start_date: moment(this.report_book.value.start_date).format("YYYY-MM-DD"),
      end_date: moment(this.report_book.value.end_date).format("YYYY-MM-DD")
    };
    // console.log(report);
    this._loaderService.show();
    this._libraryService.fetch_book_report(report).subscribe((data: any) => {
      this._loaderService.hide();
      // console.log(data.data);
      if (data.success) {
        if (data.data.length > 0)
          this.report_book_result = data.data;
        else
          return alert('No records found with below search criteria!');
      } else {
        alert('Error While fetching the report!');
        console.log(data);
        this.report_book_result = [];
      }
    }, err => {
      this._loaderService.hide();
      console.log(err);
      alert('Error While fetching the report!');
      this.report_book_result = [];
    })
  }

  fetch_report_user() {
    this.report_user_result = [];
    const report = {
      user_id: this.report_user.value.user_id,
      start_date: moment(this.report_user.value.start_date).format("YYYY-MM-DD"),
      end_date: moment(this.report_user.value.end_date).format("YYYY-MM-DD"),
      user_type: this.report_user.value.user_type,
    };
    this._loaderService.show();
    this._libraryService.fetch_user_report(report).subscribe((data: any) => {
      // console.log(data.data);
      this._loaderService.hide();
      if (data.success) {
        if (data.data.length > 0)
        this.report_user_result = data.data;
        else
          return alert('No records found with below search criteria!');        
      } else {
        alert('Error While fetching the report!');
        console.log(data);
        this.report_user_result = [];
      }
    }, err => {
      this._loaderService.hide();
      console.log(err);
      alert('Error While fetching the report!');
      this.report_user_result = [];
    })
  }

  clear_report_book_form() {
    this.report_book.reset();
    this.report_book_result = [];
  }

  clear_report_user_form() {
    this.report_user.reset();
    this.report_user_result = [];
    this.report_user.patchValue({ user_type: 'student' });
  }




  // Add Book
  initialize_add_book_form() {
    this.add_book_form = new FormGroup({
      book_id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      subject: new FormControl(null),
      isbn: new FormControl(null, Validators.required),
      edition: new FormControl(null, Validators.pattern("^[0-9]*$")),
      author: new FormControl(null, Validators.required),
      publisher: new FormControl(null, Validators.required),
      price: new FormControl(null),
      pages: new FormControl(null),
    });
  }

  clear_add_book_form() {
    this.add_book_form.reset();
  }

  onAddBook() {
    console.log(this.add_book_form.value);
    this._loaderService.show();
    this._libraryService.add_book(this.add_book_form.value).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Book Added Successfully!');
        this.add_book_form.reset();
      } else {
        console.log('Error adding Book :: ', data);
        alert('Error adding Book!');
      }
    }, err => {
      this._loaderService.hide();
      console.log('Error adding Book :: ', err);
    });

  }

  // Issue
  searchUserForIssue() {
    if (!this.userSearchValue) {
      this.bShowUserForIssue = false;
      this.userSearchValue = null;
      this.userSearchResult = null;
      return;
    }

    if (this.searchUserBy == 'student') {
      this._loaderService.show();
      this._studentService.get_student(this.userSearchValue.toLowerCase()).subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success && data.data.length) {
          console.log(data);
          this.userSearchResult = data.data[0];
          this.userSearchResult.person_id = this.userSearchResult.student_id;
          this.userSearchResult.person_name = this.userSearchResult.name;
          this.userSearchResult.person_email = this.userSearchResult.email_o;
          this.userSearchResult.person_phone = this.userSearchResult.phone;
          console.log(this.userSearchResult);
          this.bShowUserForIssue = true;
          this.checkAvatar(data.data[0].id_student, 'student');
          this.getTransaction(data.data[0].id_student);
        } else if (data.success && !data.data.length) {
          alert('Searched user not found!');
          this.userSearchResult = null;
          console.log(data);
          this.bShowUserForIssue = false;
        } else {
          alert('Error While searching student!')
          this.userSearchResult = null;
          this.bShowUserForIssue = false;
          console.log(data);
        }
      }, (err) => {
        this._loaderService.hide();
        alert('Error While searching student!')
        this.userSearchResult = null;
        this.bShowUserForIssue = false;
        console.log(err);
      })
    } else if (this.searchUserBy == 'staff') {
      this._loaderService.show();
      this._staffService.get_staff(this.userSearchValue.toLowerCase()).subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success && data.data) {
          console.log(data);
          this.userSearchResult = data.data;
          this.userSearchResult.person_id = this.userSearchResult.staff_id;
          this.userSearchResult.person_name = this.userSearchResult.name;
          this.userSearchResult.person_email = this.userSearchResult.email;
          this.userSearchResult.person_phone = this.userSearchResult.mobile;
          console.log(this.userSearchResult);
          this.bShowUserForIssue = true;
          this.checkAvatar(this.userSearchResult.id_staff, 'staff');
          this.getTransaction(this.userSearchResult.id_staff, 'staff');
        } else if (data.success && !data.data) {
          alert('Searched user not found!');
          this.userSearchResult = null;
          console.log(data);
          this.bShowUserForIssue = false;
        } else {
          alert('Error While searching student!')
          this.userSearchResult = null;
          this.bShowUserForIssue = false;
          console.log(data);
        }
      }, (err) => {
        this._loaderService.hide();
        alert('Error While searching student!');
        this.userSearchResult = null;
        this.bShowUserForIssue = false;
        console.log(err);
      })
    }


  }

  clearUserSearch() {
    this.bShowUserForIssue = false;
    this.userSearchValue = null;
    this.userSearchResult = null;
    // this.searchUserBy = 'student';
  }

  openAddBookDialog() {
    const dialogRef = this._matDialog.open(IssuebookformComponent,
      { disableClose: true, data: { data: 'data from parent component' } });

    dialogRef.afterClosed().subscribe((datafrommodal: any) => {
      // console.log('Data from modal :: ', datafrommodal);
      if (datafrommodal.data) {
        this.issuing_book_array.unshift(datafrommodal.data);
      }
    });
  }

  removeBook(i) {
    this.issuing_book_array.splice(i, 1);
  }

  saveTransaction() {
    const ok = confirm('Are you sure to save the transaction!');
    if (!ok)
      return;
    let newBookArray = this.issuing_book_array.filter(curr => curr.isNewlyAdded);
    // console.log(newBookArray);
    const newBookArrayRemovedDuplicate = newBookArray.filter((curr, index, array) =>
      index === array.findIndex(t => curr.id_book === t.id_book)
    );
    // console.log(newBookArrayRemovedDuplicate);

    if (newBookArray.length !== newBookArrayRemovedDuplicate.length) {
      return alert('Duplicate entry found for same book! Please remove one!');
    }

    newBookArray = newBookArrayRemovedDuplicate.map(curr => {
      return {
        id_book: curr.id_book,
        id_person: this.searchUserBy === 'student' ? this.userSearchResult.id_student : this.userSearchResult.id_staff,
        issued_on: curr.issued_on,
        issued_till: curr.issued_till,
        issued_by: 'Librarian',
        person_type: this.searchUserBy
      }
    });

    console.log(newBookArray);
    if (newBookArray.length === 0)
      return alert('Please add new book!');
    this._loaderService.show();
    this._libraryService.add_transactions(newBookArray).subscribe((data: any) => {
      this._loaderService.hide();
      console.log(data);
      if (data.success) {
        if (this.searchUserBy == 'staff')
          this.getTransaction(this.userSearchResult.id_staff, 'staff')
        else
          this.getTransaction(this.userSearchResult.id_student, 'student')
        alert('Successfuly mapped books!');
      } else {
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while saving!');
      console.log('Error while saving book tansactions');
      console.log(err);
    })
  }




  // Return
  searchBookForReturn() {
    this.return_remark = null;
    // this.bShowBookDetailForReturn = true;
    console.log(this.searchBookIdReturn);
    if (!this.searchBookIdReturn)
      return;
    this._loaderService.show();
    this._libraryService.get_books_transaction_history(this.searchBookIdReturn).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success && data.data && data.data.length) {
        this.searchBookIdReturnResult = data.data[0];
        this.bShowBookDetailForReturn = true;
        this.checkAvatar(this.searchBookIdReturnResult.id_person, this.searchBookIdReturnResult.person_type);
      } else {
        alert('This book is not mapped to anyone!');
        this.bShowBookDetailForReturn = false;
        this.searchBookIdReturnResult = null;
      }
      console.log(this.searchBookIdReturnResult);
    }, (err) => {
      this._loaderService.hide();
      alert('Error while getting book\'s mapping details!');
      console.log('Error while getting book tansactions');
      console.log(err);
    })



  }

  clearReturnForm() {
    this.searchBookIdReturnResult = null;
    this.searchBookIdReturn = null;
    this.bShowBookDetailForReturn = false;
    this.return_remark = null;
  }

  onBookReturn() {
    let isOk = confirm('Are you sure returning the book?');
    console.log(isOk);
    if (!isOk)
      return;
    this._loaderService.show();
    const return_book_data = {
      id_book: this.searchBookIdReturnResult.id_book,
      id_transaction: this.searchBookIdReturnResult.id_transaction,
      return_remark: this.return_remark,
      returned_to: 'Librarian'
    }
    this._libraryService.return_book(return_book_data).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Book Returned Successfully!');
        this.clearReturnForm();
      } else {
        alert('Error while returning the book!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while returning the book!');
      console.log(err);
    })
  }



  // Edit Book
  initialize_edit_book_form() {
    this.edit_book_form = new FormGroup({
      book_id: new FormControl(this.currentEditBook.book_id, Validators.required),
      name: new FormControl(this.currentEditBook.name, Validators.required),
      subject: new FormControl(this.currentEditBook.subject),
      isbn: new FormControl(this.currentEditBook.isbn, Validators.required),
      edition: new FormControl(this.currentEditBook.edition, Validators.pattern("^[0-9]*$")),
      author: new FormControl(this.currentEditBook.author, Validators.required),
      publisher: new FormControl(this.currentEditBook.publisher, Validators.required),
      price: new FormControl(this.currentEditBook.price),
      pages: new FormControl(this.currentEditBook.pages),
    })
  }

  onDeleteBook(id_book, book_id, i) {
    let ok = confirm('Are you sure to remove the book from Library database?');
    console.log(ok, id_book);
    if (!ok)
      return;
    const delete_book = {
      id_book: id_book,
      book_id: book_id,
      modified_by: 'Librarian'
    }
    this._libraryService.delete_book(delete_book).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Book Deleted Successfully from Library Database!');
        this.bookSearchResult.splice(i, 1);
      } else {
        alert(data.message);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while deleting the book!');
      console.log(err);
    })
  }

  updateBookDetails() {
    let ok = confirm('Are you sure to update the book details in Library database?');
    console.log(ok, this.edit_book_form.value);
    if (!ok)
      return;
    this._loaderService.show();
    const updated_book = {
      ...this.edit_book_form.value,
      id_book: this.currentEditBook.id_book,
      modified_by: 'Librarian'
    }
    this._libraryService.update_book_details(updated_book).subscribe((data: any) => {
      this._loaderService.hide();
      if (data.success) {
        alert('Book Updated Successfully!');
      } else {
        alert('Error while updating the book!');
        console.log(data);
      }
    }, (err) => {
      this._loaderService.hide();
      alert('Error while updating the book!');
      console.log(err);
    })
  }

  // Book Search

  onClearBookSearch() {
    this.bookSearchValue = null;
    this.bookSearchResult = [];
  }

  search_book() {
    if (this.bookSearchValue) {
      this._loaderService.show();
      this._libraryService.get_book_search(this.bookSearchValue).subscribe((data: any) => {
        this._loaderService.hide();
        if (data.success) {
          this.bookSearchResult = data.data;
          console.log(this.bookSearchResult);
        } else {
          console.log('Error searching Book :: ', data);
        }
      }, err => {
        this._loaderService.hide();
        console.log('Error searching Book :: ', err);
      })
    }
  }

  checkAvatar(id_user, type = 'student') {
    this._studentService.check_avatar(id_user).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.avatarLink = `http://localhost:3000/avatar/${type}/${id_user}`;
      }
      console.log(this.avatarLink);
    }, err => {
      this.avatarLink = "../../../assets/avatar.png";
      console.log(err);
    })
  }

  getTransaction(id_user, type = 'active') {
    this.issuing_book_array = [];

    this._libraryService.get_transaction_active(id_user, this.searchUserBy).subscribe((data: any) => {
      console.log(data);
      if (data.success && data.data) {
        this.issuing_book_array = data.data.map(curr => {
          const status = moment(new Date()).isAfter(curr.issued_till) ? 'expired' : 'active';
          return { ...curr, status }
        })
        console.log(this.issuing_book_array);
      } else {
        console.log('Error While get_transaction_active');
        console.log(data);
      }
    }, (err) => {
      this.issuing_book_array = [];
      console.log('Error While get_transaction_active');
      console.log(err);
    })


  }


}
