import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [RouterLink, CommonModule, FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
books: any[] = [];

  constructor(private bookService: BookService) {}

  buscar(texto: string) {

    this.bookService.searchBooks(texto)
      .subscribe(response => {

        this.books = response.docs;

      });

  }
}
