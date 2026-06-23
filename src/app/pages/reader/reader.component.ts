import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
})
export class ReaderComponent implements OnInit {
  book: any = null;
  description = 'Cargando...';
  title = '';

  progress = 35;
  fontSize = 18;
  darkMode = false;

  demoContent = `
  El objetivo de este libro es mostrar que los pequeños cambios pueden generar resultados extraordinarios.
  Los hábitos son la forma en que mejoramos un 1% cada día.

  La clave está en el sistema, no en las metas.
  Enfócate en crear hábitos que te acerquen a la persona que deseas ser.

  Los cambios pequeños suelen parecer insignificantes porque no producen resultados visibles de inmediato.
  Sin embargo, cuando se repiten diariamente, terminan generando transformaciones enormes a largo plazo.

  Imagina que mejoras solo un 1% cada día.
  Al cabo de un año serás muchas veces mejor que cuando comenzaste.
  `;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.bookService.getBookDetails(`/works/${id}`).subscribe({
      next: (data: any) => {
        console.log('Libro cargado:', data);
        this.book = data;

        if (typeof data.description === 'object') {
          this.description = data.description.value;
        } else if (typeof data.description === 'string') {
          this.description = data.description;
        }

        if (typeof data.title === 'object') {
          this.title = data.title.value;
        } else if (typeof data.title === 'string') {
          this.title = data.title;
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

  aumentarFuente(): void {
    if (this.fontSize < 28) {
      this.fontSize += 2;
    }
  }

  getCover(): string {
    if (!this.book?.covers?.[0]) {
      return 'https://via.placeholder.com/200x300?text=Libro';
    }
    return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`;
  }

  obtenerLibro(): void {
    if (!this.book) return;

    const titulo = encodeURIComponent(this.book.title);
    window.open(`https://openlibrary.org/search?q=${titulo}`, '_blank');
  }
}
