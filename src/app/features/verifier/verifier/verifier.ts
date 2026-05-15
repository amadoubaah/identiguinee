import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerificationService, VerificationResult } from '../../../shared/services/verification.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-verifier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verifier.html',
  styleUrls: ['./verifier.css']
})
export class VerifierComponent implements OnDestroy {
  qrCodeInput = signal('');
  isVerifying = signal(false);
  verificationResult = signal<VerificationResult | null>(null);
  showResult = signal(false);
  verificationTime = signal(0);
  selectedFile = signal<File | null>(null);
  isProcessingFile = signal(false);
  isScanning = signal(false);
  cameraStream: MediaStream | null = null;

  constructor(
    private verificationService: VerificationService,
    private notificationService: NotificationService
  ) {}

  verifyDocument(): void {
    const qrCode = this.qrCodeInput().trim();

    if (!qrCode) {
      this.notificationService.warning('Veuillez entrer ou scanner un code QR');
      return;
    }

    this.isVerifying.set(true);
    this.showResult.set(false);
    this.verificationResult.set(null);

    const startTime = Date.now();

    this.verificationService.verifyDocument(qrCode).subscribe({
      next: (result) => {
        this.verificationResult.set(result);
        this.showResult.set(true);
        this.verificationTime.set(Date.now() - startTime);
        this.isVerifying.set(false);

        if (result.authentic) {
          this.notificationService.success('Document authentifié avec succès');
        } else {
          this.notificationService.error('Document non authentique ou invalide');
        }
      },
      error: (error) => {
        console.error('Erreur de vérification:', error);
        this.notificationService.error('Erreur lors de la vérification du document');
        this.isVerifying.set(false);
      }
    });
  }

  clearResult(): void {
    this.showResult.set(false);
    this.verificationResult.set(null);
    this.qrCodeInput.set('');
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    this.qrCodeInput.set(text);
    this.verifyDocument();
  }

  getVerificationStatusClass(): string {
    const result = this.verificationResult();
    if (!result) return '';

    return result.authentic ? 'authentic' : 'fraudulent';
  }

  getVerificationIcon(): string {
    const result = this.verificationResult();
    if (!result) return '';

    return result.authentic ? '✅' : '❌';
  }

  getVerificationMessage(): string {
    const result = this.verificationResult();
    if (!result) return '';

    return result.message;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-GN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  truncateHash(hash: string, startLength: number = 10, endLength: number = 8): string {
    if (hash.length <= startLength + endLength) return hash;
    return `${hash.substring(0, startLength)}...${hash.substring(hash.length - endLength)}`;
  }

  copyHash(hash: string): void {
    navigator.clipboard.writeText(hash).then(() => {
      this.notificationService.success('Hash blockchain copié dans le presse-papiers');
    }).catch(() => {
      this.notificationService.error('Impossible de copier le hash');
    });
  }

  /**
   * Gestion de l'import de fichier
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Vérifier le format du fichier
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.notificationService.error('Format non supporté. Veuillez utiliser PDF, JPG ou PNG');
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.error('Fichier trop volumineux. Maximum 10MB');
      return;
    }

    this.selectedFile.set(file);
    this.extractQRCodeFromFile(file);
  }

  /**
   * Extrait le QR code du fichier importé
   */
  extractQRCodeFromFile(file: File): void {
    this.isProcessingFile.set(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Simulation de l'extraction de QR code
      // Dans une implémentation réelle, utiliser une librairie comme jsQR pour les images
      // et pdf.js pour les PDFs
      setTimeout(() => {
        // Pour la démo, on simule l'extraction d'un QR code
        // Dans une vraie implémentation, on utiliserait une librairie de lecture de QR code
        // comme jsQR pour extraire le code du fichier image/PDF

        // Pour l'instant, on utilise un code de test aléatoire
        // Dans une vraie implémentation, ce serait le QR code extrait du fichier
        const testCodes = [
          'GN-CNI-2026-00847',
          'GN-CNI-2026-01234',
          'GN-CNI-2025-00567',
          '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3'
        ];

        const extractedQR = testCodes[Math.floor(Math.random() * testCodes.length)];
        this.qrCodeInput.set(extractedQR);

        this.notificationService.success('QR code extrait avec succès');
        this.isProcessingFile.set(false);

        // Lancer automatiquement la vérification
        this.verifyDocument();
      }, 1500); // Simulation de 1.5s pour l'extraction
    };

    reader.onerror = () => {
      this.notificationService.error('Erreur lors de la lecture du fichier');
      this.isProcessingFile.set(false);
    };

    // Lire le fichier
    if (file.type === 'application/pdf') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsDataURL(file);
    }
  }

  /**
   * Réinitialise le fichier sélectionné
   */
  clearFile(): void {
    this.selectedFile.set(null);
    this.qrCodeInput.set('');
  }

  /**
   * Obtient le nom du fichier sélectionné
   */
  getFileName(): string {
    return this.selectedFile()?.name || '';
  }

  /**
   * Obtient la taille du fichier formatée
   */
  getFileSize(): string {
    const file = this.selectedFile();
    if (!file) return '';

    const size = file.size;
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Démarre le scanner de QR code via la caméra
   */
  async startScanner(): Promise<void> {
    try {
      // Vérifier si le navigateur supporte l'accès à la caméra
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.notificationService.error('Votre navigateur ne supporte pas l\'accès à la caméra');
        return;
      }

      this.isScanning.set(true);

      // Demander l'accès à la caméra
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Utiliser la caméra arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.cameraStream = stream;

      // Attacher le flux vidéo à l'élément video
      const videoElement = document.getElementById('camera-preview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }

      // Dans une implémentation réelle, on utiliserait une librairie comme jsQR
      // pour détecter les QR codes dans le flux vidéo
      // Pour cette démo, on simule la détection après 3 secondes
      setTimeout(() => {
        this.simulateQRCodeDetection();
      }, 3000);

      this.notificationService.success('Caméra activée. Scannez un QR code...');

    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      this.notificationService.error('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      this.isScanning.set(false);
    }
  }

  /**
   * Arrête le scanner
   */
  stopScanner(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.isScanning.set(false);
  }

  /**
   * Simule la détection d'un QR code depuis la caméra
   * Dans une implémentation réelle, utiliser jsQR pour détecter le QR code
   */
  simulateQRCodeDetection(): void {
    if (!this.isScanning()) return;

    // Simuler la détection d'un QR code
    // Pour la démo, on utilise un code de test aléatoire
    const testCodes = [
      'GN-CNI-2026-00847',
      'GN-CNI-2026-01234',
      'GN-CNI-2025-00567',
      '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3'
    ];

    const detectedQR = testCodes[Math.floor(Math.random() * testCodes.length)];
    this.qrCodeInput.set(detectedQR);

    this.notificationService.success('QR code détecté!');
    this.stopScanner();

    // Lancer automatiquement la vérification
    this.verifyDocument();
  }

  /**
   * Nettoie les ressources lors de la destruction du composant
   */
  ngOnDestroy(): void {
    this.stopScanner();
  }
}
