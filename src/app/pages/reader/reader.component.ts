import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {

  book: any = null;
  authorName = 'Autor desconocido';

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
    private location: Location
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const savedProgress = localStorage.getItem(`reader-${id}`);

    if (savedProgress) {
      this.progress = Number(savedProgress);
    }

    this.bookService
      .getBookDetails(`/works/${id}`)
      .subscribe((data: any) => {

        this.book = data;

        if (data.authors?.length) {

          const authorKey = data.authors[0].author.key;

          this.bookService
            .getAuthor(authorKey)
            .subscribe((author: any) => {

              this.authorName = author.name;

            });

        }

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

  disminuirFuente(): void {

    if (this.fontSize > 14) {
      this.fontSize -= 2;
    }

  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  avanzarLectura(): void {

    if (this.progress < 100) {

      this.progress += 5;

      const id = this.route.snapshot.paramMap.get('id');

      localStorage.setItem(
        `reader-${id}`,
        this.progress.toString()
      );

    }

  }

  getCover(): string {

    if (!this.book?.covers?.[0]) {
      return 'https://via.placeholder.com/200x300?text=Libro';
    }

    return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`;
  }

}