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
  selectedCategory: string = '';

  allBooks: any[] = [];
  books: any[] = [];

  constructor(private bookService: BookService) {}

  // 🔎 BÚSQUEDA
  buscar(texto: string): void {

    this.terminoBusqueda = texto;

    if (!texto.trim()) {
      this.allBooks = [];
      this.books = [];
      return;
    }

    this.bookService.searchBooks(texto)
      .subscribe((response: any) => {

        this.allBooks = response.docs || [];

        // 🔥 ENRIQUECER CON SUBJECTS REALES
        this.allBooks.forEach(book => {

          if (!book.key) return;

          this.bookService.getBookDetails(book.key)
            .subscribe(detail => {

              book.subjects = Array.isArray(detail.subjects)
                ? detail.subjects
                : [];

            });
        });

        this.aplicarFiltros();
      });
  }

  // 🎯 TAB
  setTab(tab: 'all' | 'books' | 'authors' | 'subject'): void {
    this.selectedTab = tab;
    this.aplicarFiltros();
  }

  // 🧠 FILTROS COMBINADOS
  aplicarFiltros(): void {

    const texto = this.terminoBusqueda.toLowerCase();

    this.books = this.allBooks.filter((book: any) => {

      const subjects: string[] = Array.isArray(book.subjects)
        ? book.subjects
        : [];

      // 🔎 MATCH TEXTO
      const matchesText =
        book.title?.toLowerCase().includes(texto) ||
        book.author_name?.join(' ')?.toLowerCase().includes(texto) ||
        subjects.some((s: string) =>
          s.toLowerCase().includes(texto)
        );

      // 🎯 MATCH CATEGORÍA
      const matchesCategory =
        !this.selectedCategory ||
        subjects.some((s: string) =>
          s.toLowerCase().includes(this.selectedCategory.toLowerCase())
        );

      // 🧭 TAB LOGIC
      let matchesTab = true;

      if (this.selectedTab === 'authors') {
        matchesTab =
          book.author_name &&
          book.author_name.join(' ').toLowerCase().includes(texto);
      }

      if (this.selectedTab === 'subject') {
        matchesTab =
          subjects.some((s: string) =>
            s.toLowerCase().includes(texto)
          );
      }

      return matchesText && matchesCategory && matchesTab;
    });
  }

  // 🎯 FILTRO POR CATEGORÍA
  filtrarPorCategoria(categoria: string): void {
    this.selectedCategory = categoria;
    this.aplicarFiltros();
  }

  // ❤️ FAVORITOS
  agregarAFavoritos(book: any): void {
    this.bookService.addFavorite(book);
    alert('¡Agregado a favoritos! ❤️');
  }

  // 📚 BIBLIOTECA
  agregarABiblioteca(book: any): void {
    this.bookService.addToLibrary(book, 'Pendientes');
    alert('¡Agregado a tu biblioteca! 📚');
  }

  // ⭐ RATING
  getRating(book: any): string {

    if (book.ratings_average) {
      return (Math.round(book.ratings_average * 10) / 10).toFixed(1) + ' ★';
    }

    const tituloLength = book.title ? book.title.length : 10;
    const ratingSimulado = (tituloLength % 16) + 35;

    return (ratingSimulado / 10).toFixed(1) + ' ★';
  }
}