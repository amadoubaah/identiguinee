import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Simulation de connexion
    setTimeout(() => {
      if (this.email && this.password) {
        console.log('Connexion réussie:', this.email);
        // TODO: Implémenter la vraie authentification
        this.router.navigate(['/profil']);
      } else {
        this.errorMessage = 'Veuillez remplir tous les champs';
      }
      this.isLoading = false;
    }, 1500);
  }

  goToInscription() {
    this.router.navigate(['/inscription']);
  }
}
