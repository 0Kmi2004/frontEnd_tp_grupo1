import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, retry, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = environment.googleBooksApiKey;

  constructor(private http: HttpClient) {}

  private buildParams(customParams: Record<string, string>): HttpParams {
    let params = new HttpParams();
    Object.keys(customParams).forEach((key) => {
      params = params.set(key, customParams[key]);
    });

    if (this.apiKey && this.apiKey.trim() !== '') {
      params = params.set('key', this.apiKey);
    }

    return params;
  }

  private get retryStrategy() {
    return retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status === 0 || error.status >= 500) {
          return timer(retryCount * 1000);
        }
        throw error;
      },
    });
  }

  private adaptGoogleBook(item: any): any {
    if (!item) return null;
    const info = item.volumeInfo || {};

    let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
    if (coverUrl.startsWith('http://')) {
      coverUrl = coverUrl.replace('http://', 'https://');
    }

    return {
      key: item.id,
      title: info.title || 'Título desconocido',
      author_name: info.authors || ['Autor desconocido'],
      cover_i: coverUrl || 'assets/no-cover.png',
      first_publish_year: info.publishedDate ? info.publishedDate.substring(0, 4) : 'N/A',
      description: info.description || 'Sin descripción disponible.',
      subject: info.categories || [],
      ratings_average: info.averageRating || null,
      ratings_count: info.ratingsCount || 0,
      page_count: info.pageCount || 0,
      publisher: info.publisher ? [info.publisher] : []
    };
  }

  getRecommendedBooks(): Observable<any> {
    const params = this.buildParams({
      q: 'bestseller',
      maxResults: '12'
    });

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      this.retryStrategy,
      map((res: any) => ({
        docs: (res.items || []).map((item: any) => this.adaptGoogleBook(item))
      })),
      catchError((err: any) => {
        console.error('Error obteniendo recomendados:', err);
        return of({ docs: [] });
      })
    );
  }

  searchBooks(query: string): Observable<any> {
    if (!query || !query.trim()) {
      return of({ docs: [] });
    }

    const params = this.buildParams({
      q: encodeURIComponent(query.trim()),
      maxResults: '20'
    });

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      this.retryStrategy,
      map((res: any) => ({
        docs: (res && res.items && Array.isArray(res.items))
          ? res.items.map((item: any) => this.adaptGoogleBook(item))
          : []
      })),
      catchError((err: HttpErrorResponse) => {
        console.warn('Error o API no disponible en la búsqueda de libros:', err.status || err.message);
        // Devuelve una lista vacía para no bloquear la interfaz del usuario
        return of({ docs: [] });
      })
    );
  }

  getBookDetails(workKey: string): Observable<any> {
    const cleanId = workKey.replace('/works/', '').replace('.json', '');
    const params = this.buildParams({});

    return this.http.get<any>(`${this.baseUrl}/${cleanId}`, { params }).pipe(
      this.retryStrategy,
      map((item: any) => this.adaptGoogleBook(item)),
      catchError((err: any) => {
        console.error('Error al obtener detalles:', err);
        return of(null);
      })
    );
  }

  getNewBooks(): Observable<any> {
    const params = this.buildParams({
      q: 'technology',
      orderBy: 'newest',
      maxResults: '12'
    });

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      this.retryStrategy,
      map((res: any) => ({
        docs: (res.items || []).map((item: any) => this.adaptGoogleBook(item))
      })),
      catchError((err: any) => {
        console.error('Error en libros nuevos:', err);
        return of({ docs: [] });
      })
    );
  }

  getBooksByCategory(category: string): Observable<any> {
    const params = this.buildParams({
      q: `subject:${category}`,
      maxResults: '12'
    });

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      this.retryStrategy,
      map((res: any) => ({
        docs: (res.items || []).map((item: any) => this.adaptGoogleBook(item))
      })),
      catchError((err: any) => {
        console.error(`Error en categoría (${category}):`, err);
        return of({ docs: [] });
      })
    );
  }

  getAuthor(authorKey: string): Observable<any> {
    return of({ name: authorKey, bio: 'Información de autor no disponible' });
  }

  getBookRatings(workId: string): Observable<any> {
    return of({ summary: { average: 4.5, count: 10 } });
  }

  getCoverUrl(coverId: any): string {
    if (!coverId) return 'assets/no-cover.png';
    if (typeof coverId === 'string' && (coverId.startsWith('http://') || coverId.startsWith('https://'))) {
      return coverId;
    }
    return 'assets/no-cover.png';
  }

  getLibrary(): any[] {
    try {
      return JSON.parse(localStorage.getItem('biblioteca') || '[]');
    } catch {
      return [];
    }
  }

  addToLibrary(book: any, status: string = 'Pendientes'): void {
    const lib = this.getLibrary();
    if (!lib.find((b: any) => b.key === book.key)) {
      const bookForLibrary = {
        ...book,
        status: status,
        progress: 0,
      };
      lib.push(bookForLibrary);
      localStorage.setItem('biblioteca', JSON.stringify(lib));
    }
  }
}