import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VerificationService, VerificationResult } from '../../shared/services/verification.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-third-party-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-party-verification.component.html',
  styleUrls: ['./third-party-verification.component.scss']
})
export class ThirdPartyVerificationComponent implements OnInit {
  isScanning = false;
  scanResult: VerificationResult | null = null;
  scanProgress = 0;
  scanStartTime: number = 0;
  documentStats = {
    verified: 1247,
    fraudulent: 89,
    processingTime: 2.8
  };
  qrCodeInput = '';

  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeScanner();
  }

  initializeScanner(): void {
    // Initialisation du scanner de documents
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      console.log('Scanner initialisé - prêt à vérifier les documents');
    }
  }

  startDocumentScan(): void {
    this.isScanning = true;
    this.scanProgress = 0;
    this.scanStartTime = Date.now();
    this.scanResult = null;

    // Simulation du scan de document en 3 secondes
    const scanInterval = setInterval(() => {
      this.scanProgress += 33.33;
      
      if (this.scanProgress >= 100) {
        clearInterval(scanInterval);
        this.completeScan();
      }
    }, 1000);
  }

  completeScan(): void {
    const scanTime = (Date.now() - this.scanStartTime) / 1000;

    // Utiliser le VerificationService pour une vraie vérification
    const testHash = this.generateHash();
    this.verificationService.verifyDocument(testHash).subscribe({
      next: (result) => {
        this.scanResult = {
          ...result,
          verificationTime: scanTime * 1000 // Convertir en millisecondes
        };
        this.isScanning = false;
        this.updateStatistics(result.authentic);

        if (result.authentic) {
          this.notificationService.success('Document authentifié avec succès');
        } else {
          this.notificationService.error('Document non authentique détecté');
        }
      },
      error: (error) => {
        console.error('Erreur de vérification:', error);
        this.notificationService.error('Erreur lors de la vérification');
        this.isScanning = false;
      }
    });
  }

  updateStatistics(isAuthentic: boolean): void {
    if (isAuthentic) {
      this.documentStats.verified++;
    } else {
      this.documentStats.fraudulent++;
    }

    // Mise à jour du temps moyen de traitement
    const totalTime = this.scanResult?.verificationTime || 0;
    this.documentStats.processingTime =
      ((this.documentStats.processingTime * (this.documentStats.verified + this.documentStats.fraudulent - 1)) +
       totalTime / 1000) /
      (this.documentStats.verified + this.documentStats.fraudulent);
  }

  getRandomDocumentType(): string {
    const types = ['Carte d\'identité', 'Passeport', 'Permis de conduire', 'Certificat de naissance'];
    return types[Math.floor(Math.random() * types.length)];
  }

  generateDocumentNumber(): string {
    const prefix = 'GN';
    const numbers = Math.floor(Math.random() * 900000000) + 100000000;
    return `${prefix}${numbers}`;
  }

  generateRandomDate(start: Date = new Date(2010, 0, 1), end: Date = new Date(2024, 0, 1)): string {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('fr-FR');
  }

  generateRandomName(): string {
    const firstNames = ['Mohamed', 'Fatoumata', 'Abdoulaye', 'Aïssatou', 'Mamadou', 'Mariam'];
    const lastNames = ['Diallo', 'Bah', 'Keïta', 'Sow', 'Bangoura', 'Camara'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  generateHash(): string {
    return '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
  }

  resetScan(): void {
    this.scanResult = null;
    this.scanProgress = 0;
  }

  /**
   * Vérification par hash blockchain (API publique pour tiers)
   */
  verifyByHash(hash: string): void {
    if (!hash.trim()) {
      this.notificationService.warning('Veuillez entrer un hash blockchain');
      return;
    }

    this.isScanning = true;
    this.scanStartTime = Date.now();

    this.verificationService.verifyByHash(hash).subscribe({
      next: (result) => {
        this.scanResult = result;
        this.isScanning = false;
        this.updateStatistics(result.authentic);

        if (result.authentic) {
          this.notificationService.success('Document authentifié avec succès');
        } else {
          this.notificationService.error('Document non authentique détecté');
        }
      },
      error: (error) => {
        console.error('Erreur de vérification:', error);
        this.notificationService.error('Erreur lors de la vérification');
        this.isScanning = false;
      }
    });
  }

  /**
   * Vérification par code QR
   */
  verifyByQR(qrCode: string): void {
    if (!qrCode.trim()) {
      this.notificationService.warning('Veuillez entrer un code QR');
      return;
    }

    this.isScanning = true;
    this.scanStartTime = Date.now();

    this.verificationService.verifyDocument(qrCode).subscribe({
      next: (result) => {
        this.scanResult = result;
        this.isScanning = false;
        this.updateStatistics(result.authentic);

        if (result.authentic) {
          this.notificationService.success('Document authentifié avec succès');
        } else {
          this.notificationService.error('Document non authentique détecté');
        }
      },
      error: (error) => {
        console.error('Erreur de vérification:', error);
        this.notificationService.error('Erreur lors de la vérification');
        this.isScanning = false;
      }
    });
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  calculateEconomicImpact(): any {
    const avgBribeCost = 50000; // 50 000 GNF par pot-de-vin
    const documentsVerified = this.documentStats.verified + this.documentStats.fraudulent;
    const bribesAvoided = documentsVerified * 0.3; // 30% des cas évitent un pot-de-vin
    const totalSavings = bribesAvoided * avgBribeCost;
    
    return {
      bribesAvoided: Math.floor(bribesAvoided),
      totalSavings: totalSavings.toLocaleString('fr-FR') + ' GNF',
      citizensHelped: documentsVerified,
      fraudDetectionRate: ((this.documentStats.fraudulent / documentsVerified) * 100).toFixed(1) + '%'
    };
  }
}
