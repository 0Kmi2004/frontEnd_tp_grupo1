import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { GutenbergService } from '../../services/gutenberg.service';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
})
export class ReaderComponent implements OnInit {
  book: any = null;
  authorName = 'Autor desconocido';

  bookContent = '';
  loadingContent = true;

  progress = 0;
  fontSize = 18;
  darkMode = false;

  constructor(
    private router: Router,
    private gutenbergService: GutenbergService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    let stateBook: any = null;

    const nav = this.router.getCurrentNavigation();
    stateBook = nav?.extras?.state;

    if (!stateBook) {
      const saved = localStorage.getItem('currentBook');
      if (saved) {
        stateBook = JSON.parse(saved);
      }
    }

    if (!stateBook) {
      this.bookContent = 'No se puede cargar el libro.';
      this.loadingContent = false;
      return;
    }

    this.book = stateBook;
    this.authorName = stateBook.authors?.[0]?.name || 'Autor desconocido';

    const savedProgress = localStorage.getItem(`reader-${stateBook.id}`);
    if (savedProgress) {
      this.progress = Number(savedProgress);
    }

    this.loadBookContent(stateBook);
  }

  // ======================
  // CARGA DEL LIBRO
  // ======================
  loadBookContent(book: any): void {
    this.gutenbergService.searchBooks(book.title).subscribe({
      next: (response: any) => {
        const results = response?.results ?? [];

        if (!results.length) {
          this.bookContent =
            'No se encontró una versión gratuita en Project Gutenberg.';
          this.loadingContent = false;
          return;
        }

        // Elegimos el mejor match con formatos disponibles
        const selectedBook =
          results.find((b: any) => {
            const f = b.formats || {};
            return (
              f['text/plain; charset=utf-8'] ||
              f['text/plain'] ||
              f['text/html']
            );
          }) || results[0];

        const formats = selectedBook?.formats || {};

        // 🔥 FIX: selección correcta de URL
        const url =
          formats['text/plain; charset=utf-8'] ||
          formats['text/plain'] ||
          formats['text/html'];

        if (!url) {
          this.bookContent =
            'Este libro no tiene texto disponible en formatos compatibles.';
          this.loadingContent = false;
          return;
        }

        // Si es Gutenberg directo, usamos proxy Angular
        const proxiedUrl = url.startsWith('https://www.gutenberg.org')
          ? url.replace('https://www.gutenberg.org', '/gutenberg')
          : url;

        this.loadText(proxiedUrl);
      },
      error: () => {
        this.bookContent = 'Error consultando Project Gutenberg.';
        this.loadingContent = false;
      },
    });
  }

  // ======================
  // DESCARGA TEXTO
  // ======================
  async loadText(url: string): Promise<void> {
    try {
      console.log('Cargando URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const text = await response.text();

      this.bookContent = text;
      this.loadingContent = false;
    } catch (err) {
      console.error(err);
      this.bookContent = 'No se pudo cargar el contenido del libro.';
      this.loadingContent = false;
    }
  }

  // ======================
  // UI
  // ======================
  volver(): void {
    this.location.back();
  }

  aumentarFuente(): void {
    if (this.fontSize < 28) this.fontSize += 2;
  }

  disminuirFuente(): void {
    if (this.fontSize > 14) this.fontSize -= 2;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  avanzarLectura(): void {
    if (this.progress < 100) {
      this.progress += 5;

      if (this.book?.id) {
        localStorage.setItem(
          `reader-${this.book.id}`,
          this.progress.toString(),
        );
      }
    }
  }
}