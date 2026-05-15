import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  // Formulaire de contact
  contactForm = signal({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    documentType: '',
    documentNumber: ''
  });

  // État du formulaire
  isSubmitting = signal(false);
  isSubmitted = signal(false);

  // Types de documents
  documentTypes = [
    { value: 'cni', label: 'Carte Nationale d\'Identité' },
    { value: 'birth-certificate', label: 'Acte de Naissance' },
    { value: 'residence-certificate', label: 'Certificat de Résidence' },
    { value: 'passport', label: 'Passeport' },
    { value: 'other', label: 'Autre' }
  ];

  // Sujets prédéfinis
  subjects = [
    { value: 'technical-issue', label: 'Problème Technique' },
    { value: 'document-issue', label: 'Problème de Document' },
    { value: 'account-issue', label: 'Problème de Compte' },
    { value: 'information', label: 'Demande d\'Information' },
    { value: 'complaint', label: 'Réclamation' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'other', label: 'Autre' }
  ];

  goToPortal() {
    this.router.navigate(['/']);
  }

  goToApropos() {
    this.router.navigate(['/apropos']);
  }

  goToSupport() {
    this.router.navigate(['/support']);
  }

  // Soumettre le formulaire
  async submitForm() {
    const form = this.contactForm();
    
    // Validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      this.notificationService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!this.isValidEmail(form.email)) {
      this.notificationService.warning('Veuillez entrer une adresse email valide');
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.isSubmitted.set(true);
      
      // Réinitialiser le formulaire
      this.contactForm.set({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        documentType: '',
        documentNumber: ''
      });

    } catch (error) {
      this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Validation email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.contactForm.set({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      documentType: '',
      documentNumber: ''
    });
    this.isSubmitted.set(false);
  }

  // Getters pour le template
  get form() {
    return this.contactForm();
  }
}
