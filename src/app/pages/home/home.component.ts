import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  menuOpen = false;
  isLoading = true;
  hasError = false;

  recommendedBooks: any[] = [];
  newBooks: any[] = [];
  selectedCategory: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.hasError = false;

    // Ejecuta la primera llamada (Recomendados)
    this.bookService.getRecommendedBooks().subscribe({
      next: (resRecommended: any) => {
        this.recommendedBooks = resRecommended?.docs || [];

        // Encadena la segunda llamada (Novedades) para evitar ráfagas simultáneas
        this.bookService.getNewBooks().subscribe({
          next: (resNew: any) => {
            this.newBooks = resNew?.docs || [];
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando libros nuevos:', err);
            // Si la segunda falla, mantenemos los recomendados y cerramos la carga
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error cargando recomendados:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.isLoading = true;

    this.bookService.getBooksByCategory(category).subscribe({
      next: (response: any) => {
        this.recommendedBooks = response?.docs || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Error cargando categoría ${category}:`, err);
        this.isLoading = false;
      }
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = null; // Detiene el bucle de eventos si vuelve a fallar
      imgElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" fill="%23ccc"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="12">Sin portada</text></svg>';
    }
  }
}