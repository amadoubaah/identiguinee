import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telechargement',
  imports: [CommonModule, FormsModule],
  templateUrl: './telechargement.html',
  styleUrl: './telechargement.css'
})
export class Telechargement {
  constructor(private router: Router) {}

  documentData = signal({
    id: 'GN-CNI-2026-00847',
    blockchainId: '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
    qrCode: 'QR-CODE-PLACEHOLDER',
    status: 'certified',
    issuedDate: '2026-05-02',
    expiryDate: '2031-05-02',
    name: 'Doe John',
    birthDate: '1990-01-15',
    birthPlace: 'Conakry',
    nationality: 'Guinéenne',
    profession: 'Ingénieur',
    address: 'Kaloum, Conakry',
    sex: 'Masculin'
  });

  isVerifying = signal(false);
  isDownloading = signal(false);
  isSendingEmail = signal(false);
  verificationStatus = signal<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  shareLink = signal('');
  isGeneratingShareLink = signal(false);
  verificationInput = signal('');
  isScanning = signal(false);
  scanResult = signal('');

  downloadDocument() {
    this.isDownloading.set(true);
    
    // Simuler génération et téléchargement PDF
    setTimeout(() => {
      const pdfContent = this.generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CNI_${this.documentData().id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      this.isDownloading.set(false);
    }, 1500);
  }

  generatePDFContent(): string {
    // Simuler contenu PDF (en réalité, on utiliserait une librairie comme jsPDF)
    const data = this.documentData();
    return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
72 720 Td
(Carte Nationale d'Identité) Tj
0 -20 Td
(ID: ${data.id}) Tj
0 -20 Td
(Nom: ${data.name}) Tj
0 -20 Td
(Né le: ${data.birthDate}) Tj
0 -20 Td
(À: ${data.birthPlace}) Tj
0 -20 Td
(Nationalité: ${data.nationality}) Tj
0 -20 Td
(Profession: ${data.profession}) Tj
0 -20 Td
(Blockchain ID: ${data.blockchainId}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000204 00000 n
0000000261 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
398
%%EOF`;
  }

  async verifyDocument() {
    this.isVerifying.set(true);
    this.verificationStatus.set('verifying');

    try {
      // Simuler vérification blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler validation réussie
      this.verificationStatus.set('valid');
      
      setTimeout(() => {
        this.verificationStatus.set('idle');
      }, 3000);
    } catch (error) {
      this.verificationStatus.set('invalid');
    } finally {
      this.isVerifying.set(false);
    }
  }

  
  async generateShareLink() {
    this.isGeneratingShareLink.set(true);
    
    try {
      // Simuler génération de lien de partage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const link = `https://identiguinee.gn/verify/${this.documentData().id}`;
      this.shareLink.set(link);
      
      // Copier dans le presse-papiers
      await navigator.clipboard.writeText(link);
    } catch (error) {
      console.error('Erreur lors de la génération du lien:', error);
    } finally {
      this.isGeneratingShareLink.set(false);
    }
  }

  
  goToTracking() {
    this.router.navigate(['/suivi']);
  }

  goToPortal() {
    this.router.navigate(['/']);
  }

  getVerificationStatusIcon(): string {
    switch (this.verificationStatus()) {
      case 'verifying': return '⏳';
      case 'valid': return '✅';
      case 'invalid': return '❌';
      default: return '🔍';
    }
  }

  getVerificationStatusText(): string {
    switch (this.verificationStatus()) {
      case 'verifying': return 'Vérification en cours...';
      case 'valid': return 'Document authentifié ✅';
      case 'invalid': return 'Document invalide ❌';
      default: return "Vérifier l'authenticité";
    }
  }

  // Scanner QR Code
  startQRScan() {
    this.isScanning.set(true);
    
    // Simuler le scan QR code
    setTimeout(() => {
      this.scanResult.set(this.documentData().blockchainId);
      this.isScanning.set(false);
      
      // Démarrer la vérification automatique
      this.verifyDocument();
    }, 2000);
  }

  // Vérification manuelle
  manualVerify() {
    const input = this.verificationInput().trim();
    
    if (!input) {
      alert('Veuillez entrer un ID Blockchain ou un numéro de document');
      return;
    }

    // Vérifier si l'entrée correspond au document actuel
    if (input === this.documentData().blockchainId || input === this.documentData().id) {
      this.verifyDocument();
    } else {
      this.verificationStatus.set('invalid');
      setTimeout(() => {
        this.verificationStatus.set('idle');
      }, 3000);
    }
  }

  // Envoyer par email
  sendEmail() {
    const data = this.documentData();
    const subject = encodeURIComponent('Votre CNI Numérique IdentiGuinée');
    const body = encodeURIComponent(`Bonjour,\n\nVous trouverez ci-joint votre Carte Nationale d'Identité numérique.\n\nNuméro de document: ${data.id}\nDate d'émission: ${data.issuedDate}\nDate d'expiration: ${data.expiryDate}\nID Blockchain: ${data.blockchainId}\n\nCordialement,\nL'équipe IdentiGuinée`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  
  // Partager le document
  shareDocument() {
    const data = this.documentData();
    const shareUrl = `https://identiguinee.gn/verify/${data.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CNI Numérique IdentiGuinée',
        text: `Ma CNI numérique - ${data.id}`,
        url: shareUrl
      });
    } else {
      // Copier dans le presse-papiers
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Lien de partage copié dans le presse-papiers');
      }).catch(() => {
        alert('Impossible de copier le lien');
      });
    }
  }

  // Signaler un problème
  reportProblem() {
    const data = this.documentData();
    const subject = encodeURIComponent('Problème avec CNI Numérique');
    const body = encodeURIComponent(`Bonjour,\n\nJe rencontre un problème avec ma CNI numérique.\n\nNuméro de document: ${data.id}\nDescription du problème: [Veuillez décrire le problème]\n\nMerci de votre aide.\n\nCordialement`);
    
    window.open(`mailto:support@identiguinee.gn?subject=${subject}&body=${body}`);
  }

  // Imprimer le document
  printDocument() {
    const data = this.documentData();
    const printContent = `
      <html>
        <head>
          <title>CNI Numérique - ${data.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .header { border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0066cc; }
            .document-info { margin: 20px 0; text-align: left; }
            .info-row { margin: 10px 0; display: flex; justify-content: space-between; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🇬🇳 RÉPUBLIQUE DE GUINÉE</div>
            <div class="title">CARTE NATIONALE D'IDENTITÉ</div>
          </div>
          
          <div class="document-info">
            <div class="info-row"><strong>Nom:</strong> Mamadou Diallo</div>
            <div class="info-row"><strong>Date de naissance:</strong> 14/03/1995</div>
            <div class="info-row"><strong>Lieu de naissance:</strong> Conakry</div>
            <div class="info-row"><strong>Sexe:</strong> Masculin</div>
            <div class="info-row"><strong>Taille:</strong> 175 cm</div>
            <div class="info-row"><strong>Numéro du document:</strong> ${data.id}</div>
            <div class="info-row"><strong>Date d'émission:</strong> ${data.issuedDate}</div>
            <div class="info-row"><strong>Date d'expiration:</strong> ${data.expiryDate}</div>
            <div class="info-row"><strong>ID Blockchain:</strong> ${data.blockchainId}</div>
          </div>
          
          <div class="footer">
            <p>Ce document est authentifié par la blockchain NaissanceChain</p>
            <p>Fait à Conakry, le ${new Date().toLocaleDateString('fr-GN')}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
