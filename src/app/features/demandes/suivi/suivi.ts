import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Dossier {
  id: string;
  reference: string;
  nom: string;
  prenom: string;
  dateDemande: string;
  statut: 'en_attente' | 'en_traitement' | 'en_revision' | 'approuve' | 'rejete' | 'complet';
  type: 'CNI' | 'PASSEPORT' | 'ACTE_NAISSANCE';
  centre: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
  documents: {
    acteNaissance: boolean;
    cniParent: boolean;
    justificatifDomicile: boolean;
    photoIdentite: boolean;
  };
  qrCode?: string;
  blockchainId?: string;
  progression: number;
  derniereMiseAJour: string;
}

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suivi.html',
  styleUrls: ['./suivi.css']
})
export class Suivi {
  searchTerm = signal('');
  selectedDossier = signal<Dossier | null>(null);
  isScanning = signal(false);
  scanResult = signal('');
  showDetails = signal(false);
  
  // Dossiers de démonstration
  dossiers = signal<Dossier[]>([
    {
      id: '1',
      reference: 'GN-CNI-2026-00847',
      nom: 'Diallo',
      prenom: 'Mamadou',
      dateDemande: '2026-05-01',
      statut: 'en_traitement',
      type: 'CNI',
      centre: 'Centre Principal Conakry',
      dateRendezVous: '2026-05-15',
      heureRendezVous: '10:00',
      documents: {
        acteNaissance: true,
        cniParent: true,
        justificatifDomicile: true,
        photoIdentite: true
      },
      qrCode: 'QR-CODE-PLACEHOLDER-1',
      blockchainId: '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1',
      progression: 75,
      derniereMiseAJour: '2026-05-02T14:30:00Z'
    },
    {
      id: '2',
      reference: 'GN-PASS-2026-00321',
      nom: 'Sow',
      prenom: 'Aminata',
      dateDemande: '2026-04-28',
      statut: 'approuve',
      type: 'PASSEPORT',
      centre: 'Centre Ratoma',
      dateRendezVous: '2026-05-10',
      heureRendezVous: '14:30',
      documents: {
        acteNaissance: true,
        cniParent: true,
        justificatifDomicile: true,
        photoIdentite: true
      },
      qrCode: 'QR-CODE-PLACEHOLDER-2',
      blockchainId: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
      progression: 100,
      derniereMiseAJour: '2026-05-02T09:15:00Z'
    },
    {
      id: '3',
      reference: 'GN-ACTE-2026-00156',
      nom: 'Bangoura',
      prenom: 'Ibrahim',
      dateDemande: '2026-05-02',
      statut: 'en_attente',
      type: 'ACTE_NAISSANCE',
      centre: 'Centre Matam',
      documents: {
        acteNaissance: false,
        cniParent: false,
        justificatifDomicile: false,
        photoIdentite: false
      },
      progression: 25,
      derniereMiseAJour: '2026-05-02T11:00:00Z'
    }
  ]);

  constructor(private router: Router) {}

  // Scanner QR Code
  startQRScan() {
    this.isScanning.set(true);
    
    // Simuler le scan QR code
    setTimeout(() => {
      // Simuler la lecture d'un QR code
      const scannedDossier = this.dossiers()[0];
      this.scanResult.set(scannedDossier.reference);
      this.selectedDossier.set(scannedDossier);
      this.showDetails.set(true);
      this.isScanning.set(false);
    }, 2000);
  }

  // Recherche de dossier
  searchDossier() {
    const term = this.searchTerm().toLowerCase().trim();
    
    if (!term) {
      this.selectedDossier.set(null);
      this.showDetails.set(false);
      return;
    }

    const found = this.dossiers().find(dossier => 
      dossier.reference.toLowerCase().includes(term) ||
      dossier.nom.toLowerCase().includes(term) ||
      dossier.prenom.toLowerCase().includes(term)
    );

    if (found) {
      this.selectedDossier.set(found);
      this.showDetails.set(true);
    } else {
      this.selectedDossier.set(null);
      this.showDetails.set(false);
      alert('Aucun dossier trouvé pour cette recherche');
    }
  }

  // Obtenir la liste filtrée pour l'affichage
  getFilteredDossiers(): Dossier[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.dossiers();
    
    return this.dossiers().filter(dossier => 
      dossier.reference.toLowerCase().includes(term) ||
      dossier.nom.toLowerCase().includes(term) ||
      dossier.prenom.toLowerCase().includes(term)
    );
  }

  // Obtenir le libellé du statut
  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'en_traitement': return 'En traitement';
      case 'en_revision': return 'En révision';
      case 'approuve': return 'Approuvé';
      case 'rejete': return 'Rejeté';
      case 'complet': return 'Complet';
      default: return statut;
    }
  }

  // Obtenir la couleur du statut
  getStatutColor(statut: string): string {
    switch (statut) {
      case 'en_attente': return '#f39c12';
      case 'en_traitement': return '#3498db';
      case 'en_revision': return '#9b59b6';
      case 'approuve': return '#27ae60';
      case 'rejete': return '#e74c3c';
      case 'complet': return '#2ecc71';
      default: return '#95a5a6';
    }
  }

  // Obtenir le type de document
  getTypeLabel(type: string): string {
    switch (type) {
      case 'CNI': return 'Carte Nationale d\'Identité';
      case 'PASSEPORT': return 'Passeport';
      case 'ACTE_NAISSANCE': return 'Acte de Naissance';
      default: return type;
    }
  }

  // Sélectionner un dossier
  selectDossier(dossier: Dossier) {
    this.selectedDossier.set(dossier);
    this.showDetails.set(true);
    this.searchTerm.set(dossier.reference);
  }

  // Fermer les détails
  closeDetails() {
    this.showDetails.set(false);
    this.selectedDossier.set(null);
  }

  // Naviguer vers le téléchargement
  goToDownload(dossier: Dossier) {
    if (dossier.statut === 'approuve' || dossier.statut === 'complet') {
      this.router.navigate(['/telechargement']);
    } else {
      alert('Le dossier doit être approuvé avant de pouvoir télécharger le document');
    }
  }

  // Formater la date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-GN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Formater l'heure
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-GN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtenir les étapes de progression
  getProgressionSteps(dossier: Dossier): { label: string; completed: boolean }[] {
    const steps = [
      { label: 'Soumission', completed: dossier.progression >= 25 },
      { label: 'Vérification', completed: dossier.progression >= 50 },
      { label: 'Traitement', completed: dossier.progression >= 75 },
      { label: 'Finalisation', completed: dossier.progression >= 100 }
    ];
    return steps;
  }

  // Effacer la recherche
  clearSearch() {
    this.searchTerm.set('');
    this.selectedDossier.set(null);
    this.showDetails.set(false);
  }
}
