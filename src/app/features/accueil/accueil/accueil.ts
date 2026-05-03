import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, Navbar],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  
  constructor(private router: Router) {}

  commencerDemande() {
    this.router.navigate(['/demande/etape1-identite']);
  }

  consulterDossier() {
    this.router.navigate(['/suivi']);
  }
}
