import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private searchUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?q=${encodeURIComponent(query)}`);
  }

  getBookDetails(workKey: string): Observable<any> {
    return this.http.get<any>(`https://openlibrary.org${workKey}.json`);
  }

  getAuthor(authorKey: string): Observable<any> {
    return this.http.get<any>(`https://openlibrary.org${authorKey}.json`);
  }

  getRecommendedBooks(): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?q=bestseller&limit=12`);
  }

  getNewBooks(): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?q=technology&limit=12`);
  }

  getBooksByCategory(category: string) {
    return this.http.get<any>(`https://openlibrary.org/search.json?subject=${category}`);
  }

  getPopularCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?subject=${encodeURIComponent(category)}&sort=rating&limit=12`);
  }

  getCoverUrl(coverId: number): string {
    if (!coverId) {
      return 'https://via.placeholder.com/150x220?text=Sin+Portada';
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

  searchAuthors(query: string) {
    return this.http.get<any>(`https://openlibrary.org/search/authors.json?q=${query}`);
  }

  searchBySubject(subject: string) {
    return this.http.get<any>(`https://openlibrary.org/search.json?subject=${subject}`);
  }

  getFavorites(): any[] {
    return JSON.parse(localStorage.getItem('favoritos') || '[]');
  }

  addFavorite(book: any): void {
    let favs = this.getFavorites();
    if (!favs.find(f => f.key === book.key)) {
      favs.push(book);
      localStorage.setItem('favoritos', JSON.stringify(favs));
    }
  }

  removeFavorite(index: number): void {
    let favs = this.getFavorites();
    favs.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favs));
  }

  getLibrary(): any[] {
    return JSON.parse(localStorage.getItem('biblioteca') || '[]');
  }

  addToLibrary(book: any, status: string = 'Pendientes'): void {
    let lib = this.getLibrary();
    if (!lib.find(b => b.key === book.key)) {
      const bookForLibrary = { 
        ...book, 
        status: status, 
        progress: 0 
      };
      lib.push(bookForLibrary);
      localStorage.setItem('biblioteca', JSON.stringify(lib));
    }
  }
}