import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  activeTab = 'Todos';
  allBooks: any[] = [];
  filteredBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.allBooks = this.bookService.getLibrary();
    this.setTab(this.activeTab);
  }

  setTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'Todos') {
      this.filteredBooks = [...this.allBooks];
      return;
    }

    this.filteredBooks = this.allBooks.filter(
      book => book.status === tab
    );
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
}