import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})

export class ProfileComponent {
  user = {
    name: 'Camilo Marquez',
    email: 'camilo@email.com',
    booksRead: 24,
    favorites: 12,
  };

  get avatarUrl(): string {
    return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(this.user.name)}`;
  }
}
