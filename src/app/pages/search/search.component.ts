import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {

  selectedTab: 'all' | 'books' | 'authors' | 'subject' = 'all';

  terminoBusqueda: string = '';


  allBooks: any[] = [];
  books: any[] = [];

  constructor(private bookService: BookService) {}

  buscar(texto: string): void {

    this.terminoBusqueda = texto.trim();

    if (!this.terminoBusqueda) {
      this.allBooks = [];
      this.books = [];
      return;
    }

    if (this.selectedTab === 'subject') {

      this.bookService.searchBySubject(this.terminoBusqueda)
        .subscribe({
          next: (response: any) => {
            this.books = response.docs || [];
          },
          error: (err) => {
            console.error('Error buscando por género:', err);
            this.books = [];
          }
        });

      return;
    }

    this.bookService.searchBooks(this.terminoBusqueda)
      .subscribe({
        next: (response: any) => {

          this.allBooks = response.docs || [];

          this.aplicarFiltros();
        },
        error: (err) => {
          console.error('Error en búsqueda:', err);
          this.allBooks = [];
          this.books = [];
        }
      });
  }

  setTab(tab: 'all' | 'books' | 'authors' | 'subject'): void {
    this.selectedTab = tab;

    if (this.terminoBusqueda) {
      this.buscar(this.terminoBusqueda);
    }
  }

  aplicarFiltros(): void {

    const texto = this.terminoBusqueda.toLowerCase();

    this.books = this.allBooks.filter((book: any) => {

      const titulo = book.title?.toLowerCase() || '';
      const autores = book.author_name?.join(' ').toLowerCase() || '';

      let matchesTab = true;

      if (this.selectedTab === 'authors') {
        matchesTab = autores.includes(texto);
      }

      if (this.selectedTab === 'books') {
        matchesTab = titulo.includes(texto);
      }

      return (
        (titulo.includes(texto) || autores.includes(texto))
        && matchesTab
      );
    });
  }



  agregarABiblioteca(book: any): void {
    this.bookService.addToLibrary(book, 'Pendientes');
    alert('¡Agregado a tu biblioteca! 📚');
  }

  getRating(book: any): string {

    if (book.ratings_average) {
      return (
        Math.round(book.ratings_average * 10) / 10
      ).toFixed(1) + ' ★';
    }

    const tituloLength = book.title ? book.title.length : 10;
    const ratingSimulado = (tituloLength % 16) + 35;

    return (ratingSimulado / 10).toFixed(1) + ' ★';
  }
}