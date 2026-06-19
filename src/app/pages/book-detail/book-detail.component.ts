import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {

  book: any = null;
  authorName = 'Autor desconocido';
  description = 'No hay descripción disponible.';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.bookService
      .getBookDetails(`/works/${id}`)
      .subscribe({

        next: (data: any) => {

          this.book = data;

          // Descripción
          if (typeof data.description === 'object') {
            this.description = data.description.value;
          } else if (typeof data.description === 'string') {
            this.description = data.description;
          }

          // Autor
          if (data.authors?.length > 0) {

            const authorKey = data.authors[0].author.key;

            this.bookService
              .getAuthor(authorKey)
              .subscribe({

                next: (author: any) => {
                  this.authorName = author.name;
                },

                error: () => {
                  this.authorName = 'Autor desconocido';
                }

              });

          }

        },

        error: (error) => {
          console.error('Error al obtener el libro:', error);
        }

      });

  }

  volver(): void {
    this.location.back();
  }

  agregarFavorito(): void {
    console.log('Libro agregado a favoritos');
  }

  agregarBiblioteca(): void {
    console.log('Libro agregado a biblioteca');
  }

  leerLibro(): void {
    console.log('Abrir lector');
  }

  getSubjects(): string {
    if (!this.book?.subjects?.length) {
      return 'General';
    }

    return this.book.subjects.slice(0, 5).join(', ');
  }

}