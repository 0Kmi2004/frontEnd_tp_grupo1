import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?q=${query}`
    );
  }

  getBookDetails(workKey: string) {
    return this.http.get(`https://openlibrary.org${workKey}.json`);
  }

  getAuthor(authorKey: string) {
    return this.http.get(
      `https://openlibrary.org${authorKey}.json`);
  }
}