import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
  };
  message?: string;
}

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  credentials = signal<LoginCredentials>({
    email: '',
    password: ''
  });

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.login(this.credentials()).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          // Stocker le token dans localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));

          // Rediriger vers le tableau de bord approprié
          this.redirectBasedOnRole(response.user?.role || 'citizen');
        } else {
          this.errorMessage.set(response.message || 'Échec de la connexion');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erreur lors de la connexion. Veuillez réessayer.');
        this.isLoading.set(false);
        console.error('Login error:', error);
      }
    });
  }

  private login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Simulation d'un appel API (remplacer par vrai appel HTTP)
    const mockResponse: AuthResponse = {
      success: credentials.email === 'admin@identiguinee.gn' && credentials.password === 'admin123',
      token: credentials.email === 'admin@identiguinee.gn' && credentials.password === 'admin123' 
        ? 'mock-jwt-token-' + Date.now() 
        : undefined,
      user: credentials.email === 'admin@identiguinee.gn' && credentials.password === 'admin123'
        ? {
            id: '1',
            email: credentials.email,
            nom: 'Admin',
            prenom: 'Système',
            role: 'admin'
          }
        : undefined,
      message: credentials.email === 'admin@identiguinee.gn' && credentials.password === 'admin123'
        ? 'Connexion réussie'
        : 'Email ou mot de passe incorrect'
    };

    return of(mockResponse).pipe(
      delay(1000), // Simuler le délai réseau
      catchError(error => {
        console.error('Login API error:', error);
        return throwError(() => error);
      })
    );

    // Pour l'implémentation réelle avec HTTP:
    // return this.http.post<AuthResponse>('https://api.identiguinee.gn/auth/login', credentials).pipe(
    //   catchError(error => {
    //     console.error('Login API error:', error);
    //     return throwError(() => error);
    //   })
    // );
  }

  private validateForm(): boolean {
    const { email, password } = this.credentials();

    if (!email || !email.trim()) {
      this.errorMessage.set('L\'email est obligatoire');
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage.set('L\'email n\'est pas valide');
      return false;
    }

    if (!password || password.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'agent':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/accueil']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  goToInscription(): void {
    this.router.navigate(['/inscription']);
  }

  goToForgotPassword(): void {
    // Implémenter la récupération de mot de passe
    console.log('Forgot password functionality to be implemented');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}
