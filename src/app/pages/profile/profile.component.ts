import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user = {
    name: 'Cargando...',
    email: '',
  };

  totalLibros: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = {
        name: currentUser.charAt(0).toUpperCase() + currentUser.slice(1),
        email: `${currentUser}@correo.com`,
      };
    }

    const biblioteca = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    this.totalLibros = biblioteca.length;
  }

  get avatarUrl(): string {
    return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(this.user.name)}`;
  }

  cerrarSesion(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}