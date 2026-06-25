import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  menuOpen = false;

  recommendedBooks: any[] = [];
  newBooks: any[] = [];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getRecommendedBooks().subscribe({
      next: (response: any) => {
        console.log('Recommended OK', response);
        this.recommendedBooks = response.docs || [];
      },
      error: (err) => {
        console.error('Recommended ERROR', err);
      },
    });

    this.bookService.getNewBooks().subscribe({
      next: (response: any) => {
        console.log('NewBooks OK', response);
        this.newBooks = response.docs || [];
      },
      error: (err) => {
        console.error('NewBooks ERROR', err);
      },
    });
  }

  selectedCategory: string | null = null;

  selectCategory(category: string): void {
    this.selectedCategory = category;

    this.bookService.getBooksByCategory(category).subscribe((response: any) => {
      this.recommendedBooks = response.docs;
    });
  }
}
