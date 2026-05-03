import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  
  nom: string = '';
  prenoms: string = '';
  email: string = '';
  telephone: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Validation
    if (!this.nom || !this.prenoms || !this.email || !this.telephone || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isLoading = false;
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      this.isLoading = false;
      return;
    }

    // Simulation d'inscription
    setTimeout(() => {
      console.log('Inscription réussie:', this.email);
      // TODO: Implémenter la vraie inscription
      this.router.navigate(['/connexion']);
    }, 1500);
  }

  goToConnexion() {
    this.router.navigate(['/connexion']);
  }
}
