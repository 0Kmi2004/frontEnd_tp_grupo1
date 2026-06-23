import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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

  // ID del libro para enviarlo al Reader
  bookId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    // Guardamos el ID para usarlo después
    this.bookId = id;

    this.bookService.getBookDetails(`/works/${id}`).subscribe({
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

  leerLibro(): void {
    this.router.navigate(['/reader', this.bookId]);
  }

  getSubjects(): string {
    if (!this.book?.subjects?.length) {
      return 'General';
    }

    return this.book.subjects.slice(0, 5).join(', ');
  }

  agregarFavorito(): void {
    if (!this.book) return;

    const favoritos = JSON.parse(localStorage.getItem('favorites') || '[]');

    const existe = favoritos.find((b: any) => b.key === this.book.key);

    if (!existe) {
      favoritos.push({
        ...this.book,
        authorName: this.authorName,
      });

      localStorage.setItem('favorites', JSON.stringify(favoritos));

      alert('Libro agregado a favoritos');
    } else {
      alert('El libro ya está en favoritos');
    }
  }

  agregarBiblioteca(): void {
    if (!this.book) return;

    const biblioteca = JSON.parse(localStorage.getItem('biblioteca') || '[]');

    const existe = biblioteca.find((b: any) => b.key === this.book.key);

    if (!existe) {
      biblioteca.push({
        ...this.book,
        authorName: this.authorName,
      },'Pendientes');

      localStorage.setItem('biblioteca', JSON.stringify(biblioteca));

      alert('Libro agregado a biblioteca');
    } else {
      alert('El libro ya está en biblioteca');
    }
  }

  
}