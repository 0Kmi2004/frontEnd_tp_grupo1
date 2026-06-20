import { Component,OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule  } from '@angular/common';
import { BookService } from '../../services/book.service';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  recommendedBooks: any[] = [];
  newBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {

    this.bookService
      .getRecommendedBooks()
      .subscribe((response: any) => {

        this.recommendedBooks = response.docs;

      });

    this.bookService
      .getNewBooks()
      .subscribe((response: any) => {

        this.newBooks = response.docs;

      });

  }

}
