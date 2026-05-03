import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passeport',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './passeport.html',
  styleUrl: './passeport.css',
})
export class Passeport {
  
  nom: string = '';
  prenoms: string = '';
  dateNaissance: string = '';
  lieuNaissance: string = '';
  nationalite: string = 'guineenne';
  profession: string = '';
  telephone: string = '';
  email: string = '';
  adresse: string = '';
  motifVoyage: string = '';
  paysDestination: string = '';
  dateDepart: string = '';
  dateRetour: string = '';
  urgenceNom: string = '';
  urgenceTelephone: string = '';
  typePasseport: string = 'standard';
  delai: string = 'normal';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Validation
    if (!this.nom || !this.prenoms || !this.dateNaissance || !this.lieuNaissance || 
        !this.telephone || !this.email || !this.adresse || !this.motifVoyage || 
        !this.paysDestination || !this.dateDepart || !this.urgenceNom || !this.urgenceTelephone) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.isLoading = false;
      return;
    }

    // Simulation de demande de passeport
    setTimeout(() => {
      console.log('Demande de passeport soumise:', {
        nom: this.nom,
        prenoms: this.prenoms,
        type: this.typePasseport,
        delai: this.delai
      });
      
      // Rediriger vers la page de confirmation
      this.router.navigate(['/demande/confirmation'], {
        queryParams: {
          type: 'passeport',
          reference: 'GP-' + Date.now()
        }
      });
    }, 2000);
  }

  calculerPrix(): number {
    let prix = 0;
    
    // Tarifs en Franc Guinéen (GNF)
    if (this.typePasseport === 'standard') {
      if (this.delai === 'express') { // 2 minutes, option euro/franc guinéen
        prix = 350000; // ~50 EUR
      } else if (this.delai === 'urgent') { // 5 ans
        prix = 500000;
      } else { // normal, 10 ans
        prix = 1000000;
      }
    } else if (this.typePasseport === 'diplomatique') {
      if (this.delai === 'express') {
        prix = 700000; // ~100 EUR
      } else if (this.delai === 'urgent') {
        prix = 750000;
      } else {
        prix = 1500000;
      }
    } else if (this.typePasseport === 'service') {
      if (this.delai === 'express') {
        prix = 525000; // ~75 EUR
      } else if (this.delai === 'urgent') {
        prix = 625000;
      } else {
        prix = 1250000;
      }
    }
    return prix;
  }

  getDelaiText(): string {
    switch (this.delai) {
      case 'express': return '2 minutes (Express)';
      case 'urgent': return '5 ans';
      default: return '10 ans';
    }
  }

  getDelaiAnnees(): number {
    switch (this.delai) {
      case 'express': return 2;
      case 'urgent': return 5;
      default: return 10;
    }
  }

  goBack() {
    this.router.navigate(['/services']);
  }
}
