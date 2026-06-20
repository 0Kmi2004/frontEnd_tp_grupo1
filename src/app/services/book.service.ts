import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private searchUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  // Buscar libros por texto
  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.searchUrl}?q=${encodeURIComponent(query)}`
    );
  }

  // Obtener detalle de un libro
  getBookDetails(workKey: string): Observable<any> {
    return this.http.get<any>(
      `https://openlibrary.org${workKey}.json`
    );
  }

  // Obtener información del autor
  getAuthor(authorKey: string): Observable<any> {
    return this.http.get<any>(
      `https://openlibrary.org${authorKey}.json`
    );
  }

  // Libros recomendados
  getRecommendedBooks(): Observable<any> {
    return this.http.get<any>(
      `${this.searchUrl}?q=bestseller&limit=12`
    );
  }

  // Novedades
  getNewBooks(): Observable<any> {
    return this.http.get<any>(
      `${this.searchUrl}?q=technology&limit=12`
    );
  }

  // Buscar por categoría
  getBooksByCategory(category: string): Observable<any> {
    return this.http.get<any>(
      `${this.searchUrl}?subject=${encodeURIComponent(category)}&limit=12`
    );
  }

  // Libros populares de una categoría
  getPopularCategory(category: string): Observable<any> {
    return this.http.get<any>(
      `${this.searchUrl}?subject=${encodeURIComponent(category)}&sort=rating&limit=12`
    );
  }

  // Obtener portada
  getCoverUrl(coverId: number): string {

    if (!coverId) {
      return 'https://via.placeholder.com/150x220?text=Sin+Portada';
    }

    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

}