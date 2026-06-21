import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GutenbergService } from '../../services/gutenberg.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menuOpen = false;

  books: any[] = [];
  newBooks: any[] = [];

  constructor(private gutenbergService: GutenbergService) {}

  ngOnInit(): void {
    // Recomendados
    this.gutenbergService.searchBooks('love').subscribe({
      next: (res) => {
        console.log('GUTENBERG RESPONSE:', res);
        this.books = (res.results ?? []).filter(
          (book: any) => book.formats?.['image/jpeg'],
        );
      },
      error: (err) => {
        console.error('ERROR API:', err);
      },
    });


  }

  openBook(book: any) {
  localStorage.setItem('currentBook', JSON.stringify(book));
}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}