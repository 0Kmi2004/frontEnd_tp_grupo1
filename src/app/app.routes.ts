import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.component').then(
        (m) => m.SplashComponent
      )
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (m) => m.LoginComponent
      )
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(
        (m) => m.HomeComponent
      )
  },

  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.component').then(
        (m) => m.SearchComponent
      )
  },

  {
    path: 'book/:id',
    loadComponent: () =>
      import('./pages/book-detail/book-detail.component').then(
        (m) => m.BookDetailComponent
      )
  },

  {
    path: 'library',
    loadComponent: () =>
      import('./pages/library/library.component').then(
        (m) => m.LibraryComponent
      )
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      )
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];