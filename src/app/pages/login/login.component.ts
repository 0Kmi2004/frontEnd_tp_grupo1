import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE para los inputs
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = ''; 

  constructor(private router: Router) {}

  iniciarSesion() {
    if (!this.email) {
      alert('Por favor, ingresa un correo para continuar.');
      return;
    }

    const nombreUsuario = this.email.split('@')[0].toLowerCase();

    localStorage.setItem('currentUser', nombreUsuario);
    
    this.router.navigate(['/home']); 
  }
}