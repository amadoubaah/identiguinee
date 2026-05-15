import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DemandeService } from '../demande.service';
import { VerificationService } from '../../../shared/services/verification.service';

interface RendezvousData {
  date: string;
  time: string;
  center: {id: string;
    name: string;
    address: string;
    capacity: number;
  };
}

interface PersonData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: string;
  telephone: string;
  email: string;
  adresse: string;
  nationalite: string;
  nomPere: string;
  nomMere: string;
  profession: string;
}

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class ConfirmationComponent implements OnInit {
  qrCodeData = signal('');
  rendezvousData = signal<RendezvousData | null>(null);
  personData = signal<PersonData | null>(null);
  isLoading = signal(true);
  referenceNumber = signal('');

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandeService,
    private verificationService: VerificationService
  ) {}

  ngOnInit() {
    this.loadConfirmationData();
  }

  private loadConfirmationData() {
    // Simuler la récupération des données du rendez-vous
    this.rendezvousData.set({
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      center: {
        id: 'centre1',
        name: 'Centre Principal Conakry',
        address: 'Kaloum, Conakry',
        capacity: 50
      }
    });

    // Simuler la récupération des données de la personne
    this.personData.set({
      nom: 'Doe',
      prenom: 'John',
      dateNaissance: '1990-01-15',
      lieuNaissance: 'Conakry',
      sexe: 'M',
      telephone: '+224 622 33 44 55',
      email: 'john.doe@example.com',
      adresse: 'Kaloum, Conakry',
      nationalite: 'Guinéenne',
      nomPere: 'Doe Senior',
      nomMere: 'Doe Senior',
      profession: 'Ingénieur'
    });

    // Générer un numéro de référence unique
    this.referenceNumber.set(this.generateReferenceNumber());

    // Générer les données pour le QR code
    this.generateQRCodeData();

    // Ajouter ce document au VerificationService pour qu'il soit vérifiable
    this.addDocumentToVerificationService();

    this.isLoading.set(false);
  }

  private generateReferenceNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ID-${timestamp}-${random}`.toUpperCase();
  }

  private generateQRCodeData() {
    const data = {
      reference: this.referenceNumber(),
      person: this.personData(),
      rendezvous: this.rendezvousData(),
      timestamp: new Date().toISOString()
    };

    this.qrCodeData.set(JSON.stringify(data));
  }

  private addDocumentToVerificationService() {
    const person = this.personData();
    if (!person) return;

    // Créer un document authentique pour la vérification
    const document = {
      nom: person.nom,
      prenom: person.prenom,
      numeroCNI: this.referenceNumber(), // Utiliser le numéro de référence comme numéro CNI
      dateEmission: new Date().toISOString().split('T')[0],
      dateExpiration: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 ans
      lieuEmission: person.lieuNaissance,
      hashBlockchain: this.referenceNumber(), // Utiliser le numéro de référence comme hash blockchain
      statut: 'actif' as const
    };

    // Ajouter au VerificationService
    this.verificationService.addDocument(document);
  }

  getQRCodeUrl(): string {
    const data = encodeURIComponent(this.qrCodeData());
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-GN', options);
  }

  downloadQRCode() {
    this.createOptimizedQRCodeImage();
  }

  private createOptimizedQRCodeImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Impossible d\'obtenir le contexte de rendu 2D');
    }
    
    // Dimensions du canvas (augmentées pour toutes les informations)
    canvas.width = 450;
    canvas.height = 1200;
    
    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Charger et dessiner le QR code
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      let currentY = 20;
      
      // Header - Rendez-vous Confirmé
      this.drawHeader(ctx, canvas, currentY);
      currentY += 80;
      
      // Numéro de référence
      this.drawReferenceNumber(ctx, canvas, currentY);
      currentY += 60;
      
      // QR code
      const qrSize = 200;
      const qrX = (canvas.width - qrSize) / 2;
      ctx.drawImage(qrImg, qrX, currentY, qrSize, qrSize);
      
      // Cadre autour du QR code
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 3;
      ctx.strokeRect(qrX - 5, currentY - 5, qrSize + 10, qrSize + 10);
      
      currentY += qrSize + 20;
      
      // Instructions QR
      ctx.fillStyle = '#666';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scannez ce code pour accéder à vos informations', canvas.width / 2, currentY);
      currentY += 25;
      
      // Informations personnelles
      currentY = this.drawPersonInfo(ctx, canvas, currentY);
      
      // Détails du rendez-vous
      currentY = this.drawRendezvousInfo(ctx, canvas, currentY);
      
      // Informations importantes
      currentY = this.drawImportantInfo(ctx, canvas, currentY);
      
      // Footer
      this.drawFooter(ctx, canvas, canvas.height - 30);
      
      // Télécharger l'image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `confirmation-${this.referenceNumber()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    
    qrImg.src = this.getQRCodeUrl();
  }

  private drawHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, startY: number) {
    // Icône de succès
    ctx.fillStyle = '#4CAF50';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✅', canvas.width / 2, startY + 25);
    
    // Titre principal
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Rendez-vous Confirmé!', canvas.width / 2, startY + 55);
    
    // Sous-titre
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Votre rendez-vous a été enregistré avec succès', canvas.width / 2, startY + 75);
  }

  private drawReferenceNumber(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, startY: number) {
    // Titre
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Numéro de Référence', canvas.width / 2, startY);
    
    // Numéro de référence
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(this.referenceNumber(), canvas.width / 2, startY + 25);
  }

  private drawPersonInfo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, startY: number) {
    const person = this.personData();
    
    if (!person) return startY;
    
    // Titre section
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤 Informations Personnelles', canvas.width / 2, startY);
    
    // Ligne de séparation
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, startY + 25);
    ctx.lineTo(canvas.width - 30, startY + 25);
    ctx.stroke();
    
    // Informations personnelles
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const infoLines = [
      `Nom complet: ${person.nom} ${person.prenom}`,
      `Date de naissance: ${person.dateNaissance}`,
      `Lieu de naissance: ${person.lieuNaissance}`,
      `Sexe: ${person.sexe === 'M' ? 'Masculin' : 'Féminin'}`,
      `Téléphone: ${person.telephone}`,
      `Email: ${person.email}`,
      `Adresse: ${person.adresse}`,
      `Nationalité: ${person.nationalite}`,
      `Profession: ${person.profession}`
    ];
    
    let currentY = startY + 45;
    infoLines.forEach(line => {
      ctx.fillText(line, 30, currentY);
      currentY += 18;
    });
    
    return currentY + 20;
  }

  private drawRendezvousInfo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, startY: number) {
    const rendezvous = this.rendezvousData();
    
    if (!rendezvous) return startY;
    
    // Titre section
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📅 Détails du Rendez-vous', canvas.width / 2, startY);
    
    // Ligne de séparation
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, startY + 25);
    ctx.lineTo(canvas.width - 30, startY + 25);
    ctx.stroke();
    
    // Carte de rendez-vous
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(30, startY + 35, canvas.width - 60, 120);
    
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, startY + 35, canvas.width - 60, 120);
    
    // Informations du rendez-vous
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const rendezvousInfo = [
      { icon: '📅', label: 'Date', value: this.formatDate(rendezvous.date) },
      { icon: '🕐', label: 'Heure', value: rendezvous.time },
      { icon: '🏢', label: 'Centre', value: rendezvous.center.name },
      { icon: '📍', label: 'Adresse', value: rendezvous.center.address }
    ];
    
    let currentY = startY + 55;
    rendezvousInfo.forEach(info => {
      ctx.fillStyle = '#667eea';
      ctx.font = '14px Arial';
      ctx.fillText(info.icon, 45, currentY);
      
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(info.label, 70, currentY);
      
      ctx.fillStyle = '#666';
      ctx.font = '11px Arial';
      ctx.fillText(info.value, 70, currentY + 15);
      
      currentY += 35;
    });
    
    return startY + 35 + 120 + 20;
  }

  private drawImportantInfo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, startY: number) {
    // Titre section
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ℹ️ Informations Importantes', canvas.width / 2, startY);
    
    // Ligne de séparation
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, startY + 25);
    ctx.lineTo(canvas.width - 30, startY + 25);
    ctx.stroke();
    
    // Cartes d'information
    const infoCards = [
      { icon: '📋', title: 'Documents requis', text: 'Pièce d\'identité originale et tous les documents soumis' },
      { icon: '⏰', title: 'Présence', text: 'Soyez présent 15 minutes avant l\'heure du rendez-vous' },
      { icon: '📱', title: 'Code QR', text: 'Gardez ce code QR pour un accès rapide à vos informations' }
    ];
    
    let currentY = startY + 45;
    infoCards.forEach((card, index) => {
      // Carte
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(30, currentY, canvas.width - 60, 70);
      
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, currentY, canvas.width - 60, 70);
      
      // Icône
      ctx.fillStyle = '#667eea';
      ctx.font = '20px Arial';
      ctx.fillText(card.icon, 50, currentY + 35);
      
      // Texte
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(card.title, 80, currentY + 25);
      
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.fillText(card.text, 80, currentY + 45);
      
      currentY += 80;
    });
    
    return currentY;
  }

  private drawFooter(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, y: number) {
    ctx.fillStyle = '#999';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('IdentiGuinée - Service de demande d\'identité', canvas.width / 2, y);
  }

  printConfirmation() {
    window.print();
  }

  goHome() {
    // Navigation vers la page d'accueil
    window.location.href = '/';
  }
}
