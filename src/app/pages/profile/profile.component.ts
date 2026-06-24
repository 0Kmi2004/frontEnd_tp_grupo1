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

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const nombreFormateado = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);

    this.user = {
      name: nombreFormateado,
      email: `${currentUser}@correo.com`,
    };

    const storageKey = `biblioteca_${currentUser}`;
    const biblioteca = JSON.parse(localStorage.getItem(storageKey) || '[]');
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