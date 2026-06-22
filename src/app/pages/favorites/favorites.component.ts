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
    this.favoriteBooks = this.bookService.getFavorites();
  }

  removeFavorite(index: number): void {
    this.bookService.removeFavorite(index);
    this.loadFavorites();
  }

  getCover(book: any): string {
    return this.bookService.getCoverUrl(book.cover_i || (book.covers ? book.covers[0] : null));
  }
}