import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  selectedTab: 'all' | 'books' | 'authors' | 'subject' = 'all';
  terminoBusqueda: string = '';
  books: any[] = [];
  isLoading: boolean = false;

  private searchSubject = new Subject<{ texto: string; tab: string }>();
  private searchSubscription!: Subscription;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => prev.texto === curr.texto && prev.tab === curr.tab),
        switchMap(({ texto, tab }) => {
          const queryLimpia = texto.trim();
          if (!queryLimpia) {
            this.isLoading = false;
            this.books = [];
            return of({ docs: [] });
          }

          this.isLoading = true;
          let queryFinal = queryLimpia;

          if (tab === 'authors') {
            queryFinal = `inauthor:${queryLimpia}`;
          } else if (tab === 'subject') {
            queryFinal = `subject:${queryLimpia}`;
          } else if (tab === 'books') {
            queryFinal = `intitle:${queryLimpia}`;
          }

          return this.bookService.searchBooks(queryFinal).pipe(
            catchError((err) => {
              console.error('Error al realizar la búsqueda:', err);
              this.isLoading = false;
              return of({ docs: [] });
            })
          );
        })
      )
      .subscribe({
        next: (response: any) => {
          this.books = response?.docs || [];
          this.isLoading = false;
        },
      });
  }

  buscar(texto: string): void {
    this.terminoBusqueda = texto;
    if (!texto.trim()) {
      this.books = [];
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.searchSubject.next({ texto, tab: this.selectedTab });
  }

  setTab(tab: 'all' | 'books' | 'authors' | 'subject'): void {
    if (this.selectedTab === tab) return;
    this.selectedTab = tab;

    if (this.terminoBusqueda.trim()) {
      this.isLoading = true;
      this.searchSubject.next({ texto: this.terminoBusqueda, tab: this.selectedTab });
    }
  }

  agregarABiblioteca(book: any): void {
    this.bookService.addToLibrary(book, 'Leídos');
    alert('¡Agregado a tu biblioteca! 📚');
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = null;
      imgElement.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" fill="%23ccc"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="12">Sin portada</text></svg>';
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}