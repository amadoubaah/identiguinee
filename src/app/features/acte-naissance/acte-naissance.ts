import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acte-naissance',
  imports: [CommonModule],
  templateUrl: './acte-naissance.html',
  styleUrl: './acte-naissance.css'
})
export class ActeNaissance {
  constructor(private router: Router) {}

  // Données de l'acte de naissance
  birthCertificateData = signal({
    id: 'GN-AN-2026-00847',
    birthChainId: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
    qrCode: 'QR-AN-PLACEHOLDER',
    status: 'certified',
    issuedDate: '2026-05-02',
    registrationDate: '1990-01-15',
    name: 'Doe John',
    birthDate: '1990-01-15',
    birthTime: '14:30',
    birthPlace: 'Maternité de Conakry',
    birthRegion: 'Conakry',
    sex: 'Masculin',
    fatherName: 'Doe Robert',
    fatherOccupation: 'Enseignant',
    motherName: 'Doe Marie',
    motherOccupation: 'Infirmière',
    address: 'Kaloum, Conakry',
    nationality: 'Guinéenne',
    registrationNumber: 'REG-1990-0147'
  });

  // États pour les fonctionnalités
  isVerifying = signal(false);
  isDownloading = signal(false);
  isGeneratingShareLink = signal(false);
  verificationStatus = signal<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  shareLink = signal('');

  // Navigation
  goToPortal() {
    this.router.navigate(['/']);
  }

  // Vérification NaissanceChain
  async verifyBirthCertificate() {
    this.isVerifying.set(true);
    this.verificationStatus.set('verifying');

    try {
      // Simuler vérification blockchain NaissanceChain
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

  // Téléchargement PDF de l'acte
  downloadBirthCertificate() {
    this.isDownloading.set(true);
    
    setTimeout(() => {
      const pdfContent = this.generateBirthCertificatePDF();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Acte_Naissance_${this.birthCertificateData().id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      this.isDownloading.set(false);
    }, 1500);
  }

  // Génération du contenu PDF
  generateBirthCertificatePDF(): string {
    const data = this.birthCertificateData();
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
<< /Length 300 >>
stream
BT
/F1 14 Tf
72 720 Td
(RÉPUBLIQUE DE GUINÉE) Tj
0 -20 Td
(MINISTÈRE DE LA SANTÉ) Tj
0 -30 Td
(DIRECTION NATIONALE DE L'ÉTAT CIVIL) Tj
0 -40 Td
(ACTE DE NAISSANCE) Tj
0 -30 Td
/F1 10 Tf
(Numéro: ${data.id}) Tj
0 -15 Td
(Nom: ${data.name}) Tj
0 -15 Td
(Né le: ${data.birthDate} à ${data.birthTime}) Tj
0 -15 Td
(À: ${data.birthPlace}, ${data.birthRegion}) Tj
0 -15 Td
(Sexe: ${data.sex}) Tj
0 -15 Td
(Père: ${data.fatherName} - ${data.fatherOccupation}) Tj
0 -15 Td
(Mère: ${data.motherName} - ${data.motherOccupation}) Tj
0 -15 Td
(Adresse: ${data.address}) Tj
0 -15 Td
(Nationalité: ${data.nationality}) Tj
0 -15 Td
(Date d'enregistrement: ${data.registrationDate}) Tj
0 -15 Td
(NaissanceChain ID: ${data.birthChainId}) Tj
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

  // Génération de lien de partage
  async generateShareLink() {
    this.isGeneratingShareLink.set(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const link = `https://identiguinee.gn/verify-birth/${this.birthCertificateData().id}`;
      this.shareLink.set(link);
      
      // Copier dans le presse-papiers
      await navigator.clipboard.writeText(link);
    } catch (error) {
      console.error('Erreur lors de la génération du lien:', error);
    } finally {
      this.isGeneratingShareLink.set(false);
    }
  }

  // Impression de l'acte
  printBirthCertificate() {
    const data = this.birthCertificateData();
    const printContent = `
      <html>
        <head>
          <title>Acte de Naissance - ${data.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0066cc; }
            .subtitle { font-size: 18px; color: #666; }
            .content { margin: 20px 0; }
            .section { margin: 15px 0; }
            .section-title { font-weight: bold; font-size: 16px; color: #0066cc; margin-bottom: 10px; }
            .field { margin: 8px 0; display: flex; }
            .label { font-weight: bold; width: 200px; }
            .value { flex: 1; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .blockchain { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 10px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🇬🇳 RÉPUBLIQUE DE GUINÉE</div>
            <div class="subtitle">MINISTÈRE DE LA SANTÉ - DIRECTION NATIONALE DE L'ÉTAT CIVIL</div>
            <div class="title">ACTE DE NAISSANCE</div>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">INFORMATIONS DE L'ACTE</div>
              <div class="field"><span class="label">Numéro d'acte:</span> <span class="value">${data.id}</span></div>
              <div class="field"><span class="label">Date d'enregistrement:</span> <span class="value">${data.registrationDate}</span></div>
              <div class="field"><span class="label">Numéro d'immatriculation:</span> <span class="value">${data.registrationNumber}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMATIONS PERSONNELLES</div>
              <div class="field"><span class="label">Nom complet:</span> <span class="value">${data.name}</span></div>
              <div class="field"><span class="label">Date de naissance:</span> <span class="value">${data.birthDate} à ${data.birthTime}</span></div>
              <div class="field"><span class="label">Lieu de naissance:</span> <span class="value">${data.birthPlace}, ${data.birthRegion}</span></div>
              <div class="field"><span class="label">Sexe:</span> <span class="value">${data.sex}</span></div>
              <div class="field"><span class="label">Nationalité:</span> <span class="value">${data.nationality}</span></div>
              <div class="field"><span class="label">Adresse:</span> <span class="value">${data.address}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMATIONS PARENTALES</div>
              <div class="field"><span class="label">Père:</span> <span class="value">${data.fatherName} - ${data.fatherOccupation}</span></div>
              <div class="field"><span class="label">Mère:</span> <span class="value">${data.motherName} - ${data.motherOccupation}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">VALIDATION BLOCKCHAIN</div>
              <div class="field"><span class="label">Statut:</span> <span class="value">✅ Certifié par NaissanceChain</span></div>
              <div class="field"><span class="label">Date de certification:</span> <span class="value">${data.issuedDate}</span></div>
            </div>
            
            <div class="blockchain">
              <strong>ID NaissanceChain:</strong><br>${data.birthChainId}
            </div>
          </div>
          
          <div class="footer">
            <p>Cet acte est authentifié par la blockchain NaissanceChain et est reconnu officiellement par l'État guinéen.</p>
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

  // Getters pour l'UI
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
      case 'verifying': return 'Vérification NaissanceChain en cours...';
      case 'valid': return 'Acte authentifié par NaissanceChain ✅';
      case 'invalid': return 'Acte invalide ❌';
      default: return "Vérifier l'authenticité";
    }
  }
}
