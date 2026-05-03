import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DemandeService } from '../demande.service';

interface RendezvousData {
  date: string;
  time: string;
  center: {
    id: string;
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
    private demandeService: DemandeService
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
    const link = document.createElement('a');
    link.href = this.getQRCodeUrl();
    link.download = `qr-code-${this.referenceNumber()}.png`;
    link.click();
  }

  printConfirmation() {
    window.print();
  }

  goHome() {
    // Navigation vers la page d'accueil
    window.location.href = '/';
  }
}
