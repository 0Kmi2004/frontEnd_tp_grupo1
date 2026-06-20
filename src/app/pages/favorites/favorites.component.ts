import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  favoriteBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {

    this.bookService
      .searchBooks('popular')
      .subscribe((response: any) => {

        this.favoriteBooks = response.docs
          .slice(0, 8)
          .map((book: any) => ({

            ...book,

            rating: (
              4 + Math.random()
            ).toFixed(1)

          }));

      });

  }

  removeFavorite(index: number): void {
    this.favoriteBooks.splice(index, 1);
  }

  getCover(book: any): string {

    if (!book.cover_i) {
      return 'https://via.placeholder.com/120x180?text=Libro';
    }

    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }

}