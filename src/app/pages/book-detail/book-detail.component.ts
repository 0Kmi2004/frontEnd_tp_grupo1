import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  book: any = null;
  authorName = 'Autor desconocido';
  description = 'No hay descripción disponible.';

  ratingAverage: number = 0;
  ratingCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.bookService.getBookDetails(id).subscribe({
      next: (data: any) => {
        if (!data) return;
        this.book = data;

        // Asignación de autor desde la respuesta mapeada de Google Books
        if (Array.isArray(data.author_name) && data.author_name.length > 0) {
          this.authorName = data.author_name.join(', ');
        } else if (typeof data.author_name === 'string') {
          this.authorName = data.author_name;
        }

        // Asignación de descripción
        if (data.description) {
          this.description = data.description;
        }

        // Asignación de valoraciones (Google Books entrega rating nativo)
        this.ratingAverage = data.ratings_average || 0;
        this.ratingCount = data.ratings_count || 0;
      },
      error: (error) => {
        console.error('Error al obtener el libro:', error);
      },
    });
  }

  volver(): void {
    this.location.back();
  }

  getSubjects(): string {
    if (!this.book?.subject?.length) {
      return 'General';
    }
    return this.book.subject.slice(0, 5).join(', ');
  }

  agregarBiblioteca(): void {
    if (!this.book) return;

    this.bookService.addToLibrary(
      {
        ...this.book,
        authorName: this.authorName,
      },
      'Pendientes'
    );

    alert('¡Libro agregado a tu biblioteca!');
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = null;
      imgElement.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" fill="%23ccc"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="12">Sin portada</text></svg>';
    }
  }
}