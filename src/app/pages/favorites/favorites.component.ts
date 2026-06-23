import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteBooks = JSON.parse(localStorage.getItem('favorites') || '[]');
  }
  removeFavorite(index: number): void {
    this.favoriteBooks.splice(index, 1);

    localStorage.setItem('favorites', JSON.stringify(this.favoriteBooks));
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