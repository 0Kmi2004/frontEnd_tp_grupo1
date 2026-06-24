import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  libraryBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadLibrary();
  }

loadLibrary(): void {
    const savedBooks = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    
    this.libraryBooks = savedBooks.filter((book: any) => book && book.title);
    
    localStorage.setItem('biblioteca', JSON.stringify(this.libraryBooks));
  }

  getCover(book: any): string {
    if (book.covers?.length) {
      return `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`;
    }

    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }

    return 'https://via.placeholder.com/120x180?text=Libro';
  }

  removeBook(index: number): void {
    this.libraryBooks.splice(index, 1);
    localStorage.setItem('biblioteca', JSON.stringify(this.libraryBooks));
  }
}