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

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
  ) {}

  ratingAverage: number = 0;
  ratingCount: number = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.bookService.getBookDetails(`/works/${id}`).subscribe({
      next: (data: any) => {
        this.book = data;

        this.bookService.getBookRatings(`/works/${id}`).subscribe({
  next: (ratingData: any) => {
    if (ratingData && ratingData.summary) {
      this.ratingAverage = ratingData.summary.average 
        ? parseFloat(ratingData.summary.average.toFixed(1)) 
        : 0;
      
      this.ratingCount = ratingData.summary.count || 0;
    }
  },
  error: () => {
    console.log('No se encontraron calificaciones para este libro.');
  }
});

        if (typeof data.description === 'object') {
          this.description = data.description.value;
        } else if (typeof data.description === 'string') {
          this.description = data.description;
        }

        if (data.authors?.length > 0) {
          const authorKey = data.authors[0].author.key;

          this.bookService.getAuthor(authorKey).subscribe({
            next: (author: any) => {
              this.authorName = author.name;
            },
            error: () => {
              this.authorName = 'Autor desconocido';
            },
          });
        }
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
    if (!this.book?.subjects?.length) {
      return 'General';
    }

    return this.book.subjects.slice(0, 5).join(', ');
  }

  agregarBiblioteca(): void {
    if (!this.book) return;

    const biblioteca = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    const existe = biblioteca.find((b: any) => b.key === this.book.key);

    if (!existe) {
      biblioteca.push({
        ...this.book,
        authorName: this.authorName,
      });

      localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
      alert('Libro agregado a biblioteca');
    } else {
      alert('El libro ya está en biblioteca');
    }
  }
}