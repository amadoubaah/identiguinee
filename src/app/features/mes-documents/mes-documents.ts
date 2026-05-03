import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mes-documents',
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-documents.html',
  styleUrl: './mes-documents.css'
})
export class MesDocuments {
  constructor(private router: Router) {}

  // Documents de l'utilisateur
  userDocuments = signal([
    {
      id: 'doc-001',
      type: 'cni',
      name: 'Carte Nationale d\'Identité',
      status: 'valid',
      issuedDate: '2026-05-02',
      expiryDate: '2031-05-02',
      documentNumber: 'GN-CNI-2026-00847',
      blockchainId: '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      qrCode: 'QR-CNI-PLACEHOLDER',
      icon: '🆔',
      size: '2.1 MB',
      format: 'PDF',
      downloadUrl: '#',
      shareUrl: '#'
    },
    {
      id: 'doc-002',
      type: 'birth-certificate',
      name: 'Acte de Naissance',
      status: 'valid',
      issuedDate: '1990-01-20',
      documentNumber: 'GN-AN-1990-0147',
      blockchainId: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
      qrCode: 'QR-AN-PLACEHOLDER',
      icon: '📋',
      size: '1.8 MB',
      format: 'PDF',
      downloadUrl: '#',
      shareUrl: '#'
    },
    {
      id: 'doc-003',
      type: 'residence-certificate',
      name: 'Certificat de Résidence',
      status: 'valid',
      issuedDate: '2025-12-15',
      expiryDate: '2026-12-15',
      documentNumber: 'GN-CR-2025-0234',
      blockchainId: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      qrCode: 'QR-CR-PLACEHOLDER',
      icon: '🏠',
      size: '1.2 MB',
      format: 'PDF',
      downloadUrl: '#',
      shareUrl: '#'
    },
    {
      id: 'doc-004',
      type: 'passport',
      name: 'Passeport Guinéen',
      status: 'valid',
      issuedDate: '2024-08-10',
      expiryDate: '2029-08-10',
      documentNumber: 'GN-PASS-2024-0456',
      blockchainId: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      qrCode: 'QR-PASS-PLACEHOLDER',
      icon: '🛂',
      size: '3.5 MB',
      format: 'PDF',
      downloadUrl: '#',
      shareUrl: '#'
    },
    {
      id: 'doc-005',
      type: 'birth-registry',
      name: 'Registre Naissance Chaîne',
      status: 'verified',
      issuedDate: '1990-01-15',
      documentNumber: 'GN-RNC-1990-0147',
      blockchainId: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      qrCode: 'QR-RNC-PLACEHOLDER',
      icon: '⛓️',
      size: '0.8 MB',
      format: 'PDF',
      downloadUrl: '#',
      shareUrl: '#'
    }
  ]);

  // Filtres et recherche
  selectedFilter = signal('all');
  searchQuery = signal('');
  sortBy = signal('date');

  // Navigation
  goToPortal() {
    this.router.navigate(['/']);
  }

  goToSupport() {
    this.router.navigate(['/support']);
  }

  // Filtrage des documents
  filteredDocuments = computed(() => {
    let docs = this.userDocuments();

    // Filtre par type
    if (this.selectedFilter() !== 'all') {
      docs = docs.filter(doc => doc.type === this.selectedFilter());
    }

    // Recherche
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      docs = docs.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.documentNumber.toLowerCase().includes(query)
      );
    }

    // Tri
    docs.sort((a, b) => {
      switch (this.sortBy()) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return docs;
  });

  // Actions sur les documents
  downloadDocument(document: any) {
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${document.name.replace(/\s+/g, '_')}.pdf`;
    link.click();
  }

  shareDocument(document: any) {
    // Simuler le partage
    if (navigator.share) {
      navigator.share({
        title: document.name,
        text: `Voici mon ${document.name} - ${document.documentNumber}`,
        url: document.shareUrl
      });
    } else {
      // Copier dans le presse-papiers
      navigator.clipboard.writeText(document.shareUrl || document.documentNumber);
      alert('Lien copié dans le presse-papiers');
    }
  }

  verifyDocument(document: any) {
    // Simuler la vérification
    alert(`Vérification du document ${document.name}\nID Blockchain: ${document.blockchainId}`);
  }

  deleteDocument(document: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${document.name} ?`)) {
      // Simuler la suppression
      const docs = this.userDocuments().filter(doc => doc.id !== document.id);
      this.userDocuments.set(docs);
    }
  }

  // Getters pour l'affichage
  getStatusColor(status: string): string {
    switch (status) {
      case 'valid': return '#00c851';
      case 'expired': return '#ff4444';
      case 'pending': return '#ffbb33';
      case 'verified': return '#0066cc';
      default: return '#666666';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'valid': return 'Valide';
      case 'expired': return 'Expiré';
      case 'pending': return 'En attente';
      case 'verified': return 'Vérifié';
      default: return 'Inconnu';
    }
  }

  getDocumentTypeLabel(type: string): string {
    switch (type) {
      case 'cni': return 'Carte d\'identité';
      case 'birth-certificate': return 'Acte de naissance';
      case 'residence-certificate': return 'Certificat de résidence';
      case 'passport': return 'Passeport';
      case 'birth-registry': return 'Registre naissance';
      default: return type;
    }
  }

  // Statistiques
  get documentStats() {
    const docs = this.userDocuments();
    return {
      total: docs.length,
      valid: docs.filter(doc => doc.status === 'valid').length,
      expired: docs.filter(doc => doc.status === 'expired').length,
      pending: docs.filter(doc => doc.status === 'pending').length,
      verified: docs.filter(doc => doc.status === 'verified').length
    };
  }
}
