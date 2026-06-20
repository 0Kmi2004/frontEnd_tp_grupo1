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

    this.bookService
      .searchBooks('bestseller')
      .subscribe((response: any) => {

        this.allBooks = response.docs
          .slice(0, 12)
          .map((book: any, index: number) => ({

            ...book,

            progress: this.generateProgress(index),

            status: this.generateStatus(index)

          }));

        this.filteredBooks = [...this.allBooks];

      });

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

  generateProgress(index: number): number {

    const values = [15, 30, 45, 52, 68, 75, 90, 100];

    return values[index % values.length];
  }

  generateStatus(index: number): string {

    const statuses = [
      'Leyendo',
      'Pendientes',
      'Completados'
    ];

    return statuses[index % statuses.length];
  }

  getCover(book: any): string {

    if (!book.cover_i) {
      return 'https://via.placeholder.com/120x180?text=Libro';
    }

    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }

}