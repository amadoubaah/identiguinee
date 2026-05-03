import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal',
  imports: [CommonModule],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal {
  constructor(private router: Router) {}

  // Navigation
  navigateToDemande() {
    this.router.navigate(['/demande']);
  }

  navigateToTracking() {
    this.router.navigate(['/suivi']);
  }

  navigateToDownload() {
    this.router.navigate(['/telechargement']);
  }

  navigateToBirthCertificate() {
    this.router.navigate(['/acte-naissance']);
  }

  navigateToSupport() {
    this.router.navigate(['/support']);
  }

  navigateToMyDocuments() {
    this.router.navigate(['/mes-documents']);
  }

  navigateToProfile() {
    this.router.navigate(['/profil']);
  }

  navigateToApropos() {
    this.router.navigate(['/apropos']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  navigateToSubmission() {
    this.router.navigate(['/demande']);
  }
}
