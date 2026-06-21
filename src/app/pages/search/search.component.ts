import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  selectedTab: 'all' | 'books' | 'authors' | 'genres' = 'all';

  allBooks: any[] = [];
  books: any[] = [];

  constructor(private bookService: BookService) {}

  // ======================
  // BUSCAR
  // ======================
  buscar(texto: string): void {

    if (!texto.trim()) {
      this.books = [];
      return;
    }

    this.bookService.searchBooks(texto)
      .subscribe((response: any) => {

        this.allBooks = response.docs || [];

        if (
          this.selectedTab === 'all' ||
          this.selectedTab === 'books'
        ) {
          this.books = this.allBooks;
        }

        if (this.selectedTab === 'authors') {

          this.books = this.allBooks.filter(
            (book: any) =>
              book.author_name &&
              book.author_name.join(' ')
                .toLowerCase()
                .includes(texto.toLowerCase())
          );

        }

        if (this.selectedTab === 'genres') {

          this.books = this.allBooks.filter(
            (book: any) =>
              book.subject &&
              book.subject.join(' ')
                .toLowerCase()
                .includes(texto.toLowerCase())
          );

        }

      });

  }

  // ======================
  // CAMBIAR TAB
  // ======================
  setTab(tab: 'all' | 'books' | 'authors' | 'genres'): void {

    this.selectedTab = tab;

    if (
      tab === 'all' ||
      tab === 'books'
    ) {
      this.books = this.allBooks;
    }

  }

}