import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GutenbergService {

  private apiUrl = 'https://gutendex.com/books';

  constructor(private http: HttpClient) {}

  searchBooks(query: string) {
    return this.http.get<any>(
      `${this.apiUrl}?search=${query}`
    );
  }

  getBookText(id: number) {
    return this.http.get(
      `/gutenberg/cache/epub/${id}/pg${id}.txt`,
      { responseType: 'text' }
    );
  }

  getText(url: string) {
    return this.http.get(url, { responseType: 'text' });
  }
}