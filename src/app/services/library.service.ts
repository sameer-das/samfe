import { Injectable } from '@angular/core';
import { Global } from 'src/global';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private _http: HttpClient) { }
  URL: string = 'http://localhost:3000';

  add_book(book) {
    return this._http.post(this.URL + '/book', book);
  }

  get_book_fromid(book_id) {
    return this._http.get(this.URL + '/book/' + book_id);
  }

  get_book_search(search) {
    return this._http.get(this.URL + '/book/search/' + search);
  }


  get_transaction_active(id_user,user_type = 'student') {
    const queryString = `?id_user=${id_user}&user_type=${user_type}`;
    return this._http.get(this.URL + '/transaction/active' + queryString);
  }

  add_transactions(transaction) {
    return this._http.post(this.URL + '/transaction/issuebook', transaction);
  }

  return_book(return_book_data) {
    return this._http.post(this.URL + '/transaction/returnbook', return_book_data);
  }

  get_books_transaction_history(book_id, status = 'active') {
    const queryString = `?book_id=${book_id}&status=${status}`;
    return this._http.get(this.URL + '/transaction/book' + queryString);
  }

  update_book_details(updated_book) {
    return this._http.patch(this.URL + '/book', updated_book);
  }

  delete_book(delete_book) {
    return this._http.patch(this.URL+ '/book/delete', delete_book);
  }

  
  fetch_book_report(report) {
    return this._http.post(this.URL+ '/libraryreport/book', report);
  }
  fetch_user_report(report) {
    return this._http.post(this.URL+ '/libraryreport/user', report);
  }
}
