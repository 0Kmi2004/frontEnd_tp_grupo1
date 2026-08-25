import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  libraryBooks: any[] = [];

  ngOnInit(): void {
    this.loadLibrary();
  }

  loadLibrary(): void {
    const savedBooks = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    this.libraryBooks = savedBooks.filter((book: any) => book && book.title);
    localStorage.setItem('biblioteca', JSON.stringify(this.libraryBooks));
  }

  getCover(book: any): string {
    if (!book) return 'assets/no-cover.png';

    // 1. Si cover_i ya es una URL completa (Google Books)
    if (typeof book.cover_i === 'string' && book.cover_i.startsWith('http')) {
      return book.cover_i;
    }

    // 2. Si es una portada en formato de OpenLibrary (ID numérico)
    if (book.cover_i && !isNaN(Number(book.cover_i))) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }

    if (book.covers?.length) {
      return `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`;
    }

    // 3. Fallback en caso de no tener portada
    return 'assets/no-cover.png';
  }

  getAuthorName(book: any): string {
    if (book.authorName) {
      return book.authorName;
    }
    if (Array.isArray(book.author_name)) {
      return book.author_name.join(', ');
    }
    if (typeof book.author_name === 'string') {
      return book.author_name;
    }
    return 'Autor desconocido';
  }

  removeBook(index: number): void {
    this.libraryBooks.splice(index, 1);
    localStorage.setItem('biblioteca', JSON.stringify(this.libraryBooks));
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = null;
      imgElement.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" fill="%23ccc"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="12">Sin portada</text></svg>';
    }
  }
}