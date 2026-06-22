import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
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
  terminoBusqueda: string = '';

  allBooks: any[] = [];
  books: any[] = [];

  constructor(private bookService: BookService) {}

  buscar(texto: string): void {
    this.terminoBusqueda = texto;

    if (!texto.trim()) {
      this.books = [];
      this.allBooks = [];
      return;
    }

    this.bookService.searchBooks(texto).subscribe((response: any) => {
      this.allBooks = response.docs || [];
      this.aplicarFiltros(); 
    });
  }

  setTab(tab: 'all' | 'books' | 'authors' | 'genres'): void {
    this.selectedTab = tab;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const texto = this.terminoBusqueda.toLowerCase();

    if (this.selectedTab === 'all' || this.selectedTab === 'books') {
      this.books = [...this.allBooks];
    }

    if (this.selectedTab === 'authors') {
      this.books = this.allBooks.filter((book: any) =>
        book.author_name && 
        book.author_name.join(' ').toLowerCase().includes(texto)
      );
    }

    if (this.selectedTab === 'genres') {
      this.books = this.allBooks.filter((book: any) =>
        book.subject && 
        book.subject.join(' ').toLowerCase().includes(texto)
      );
    }
  }

  agregarAFavoritos(book: any): void {
    this.bookService.addFavorite(book);
    alert('¡Agregado a favoritos! ❤️');
  }

  agregarABiblioteca(book: any): void {
    this.bookService.addToLibrary(book, 'Pendientes');
    alert('¡Agregado a tu biblioteca! 📚');
  }

  getRating(book: any): string {
    if (book.ratings_average) {
      return (Math.round(book.ratings_average * 10) / 10).toFixed(1) + ' ★';
    }
    const tituloLength = book.title ? book.title.length : 10;
    const ratingSimulado = (tituloLength % 16) + 35; 
    return (ratingSimulado / 10).toFixed(1) + ' ★';
  }
}