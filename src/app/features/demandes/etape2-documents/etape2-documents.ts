import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../demande.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-etape2-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etape2-documents.html',
  styleUrls: ['./etape2-documents.css']
})
export class Etape2Documents {
  documents = signal([
    {
      id: 'acteNaissance',
      name: 'Acte de naissance',
      required: true,
      uploaded: false,
      file: null as File | null,
      description: 'Copie certifiée de l\'acte de naissance'
    },
    {
      id: 'cniParent',
      name: 'CNI des parents',
      required: false,
      uploaded: false,
      file: null as File | null,
      description: 'Copie des CNI des parents'
    },
    {
      id: 'justificatifDomicile',
      name: 'Justificatif de domicile',
      required: true,
      uploaded: false,
      file: null as File | null,
      description: 'Facture d\'électricité, eau ou quittance de loyer'
    },
    {
      id: 'photoIdentite',
      name: 'Photo d\'identité',
      required: true,
      uploaded: false,
      file: null as File | null,
      description: 'Photo d\'identité format passeport récente'
    }
  ]);

  isSubmitting = signal(false);
  uploadProgress = signal<Record<string, number>>({});

  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onFileUpload(event: Event, documentId: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.warning('Le fichier ne doit pas dépasser 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.warning('Seuls les fichiers PDF, JPEG et PNG sont acceptés');
        return;
      }

      // Simulate upload progress
      this.simulateUpload(documentId, file);
    }
  }

  simulateUpload(documentId: string, file: File) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update document status
        this.documents.update(docs => 
          docs.map(doc => 
            doc.id === documentId 
              ? { ...doc, uploaded: true, file }
              : doc
          )
        );
        
        // Clear progress
        this.uploadProgress.update(progress => {
          const newProgress = { ...progress };
          delete newProgress[documentId];
          return newProgress;
        });
      } else {
        this.uploadProgress.set({
          ...this.uploadProgress(),
          [documentId]: progress
        });
      }
    }, 200);
  }

  removeDocument(documentId: string) {
    this.documents.update(docs => 
      docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, uploaded: false, file: null }
          : doc
      )
    );
  }

  validateForm(): boolean {
    const requiredDocs = this.documents().filter(doc => doc.required);
    const allRequiredUploaded = requiredDocs.every(doc => doc.uploaded);

    if (!allRequiredUploaded) {
      this.notificationService.warning('Veuillez télécharger tous les documents obligatoires');
      return false;
    }
    
    return true;
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const uploadedDocs = this.documents()
        .filter(doc => doc.uploaded && doc.file)
        .map(doc => ({
          id: doc.id,
          name: doc.name,
          file: doc.file!
        }));
      
      await this.demandeService.submitDemande({
        documents: uploadedDocs,
        etape: 2,
        timestamp: new Date().toISOString()
      });
      
      this.router.navigate(['/demande/etape3-otp']);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goToPreviousStep() {
    this.router.navigate(['/demande/etape1-identite']);
  }

  getProgressPercentage(): number {
    return 50; // Étape 2 sur 4
  }

  getUploadedCount(): number {
    return this.documents().filter(doc => doc.uploaded).length;
  }

  getRequiredUploadedCount(): number {
    return this.documents()
      .filter(doc => doc.required && doc.uploaded)
      .length;
  }

  getTotalRequiredCount(): number {
    return this.documents().filter(doc => doc.required).length;
  }

  getUploadProgress(documentId: string): number {
    const progress = this.uploadProgress()[documentId];
    return progress ? Math.round(progress) : 0;
  }
}
