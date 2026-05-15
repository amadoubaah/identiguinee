import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  // Informations utilisateur
  userInfo = signal({
    photo: '👤',
    fullName: 'Doe John',
    birthDate: '1990-01-15',
    birthNumber: 'GN-BN-1990-0147',
    phone: '+224 622 22 22 22',
    email: 'john.doe@identiguinee.gn',
    address: 'Kaloum, Conakry, Guinée',
    profession: 'Ingénieur',
    nationality: 'Guinéenne',
    birthPlace: 'Conakry',
    sex: 'Masculin',
    height: '175 cm',
    bloodType: 'O+',
    emergencyContact: '+224 623 33 33 33',
    birthChainId: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f'
  });

  // États pour l'édition
  isEditing = signal(false);
  isChangingPassword = signal(false);
  showNotifications = signal(false);
  showHistory = signal(false);
  showSettings = signal(false);
  showDemandes = signal(false);

  // Mot de passe
  passwordForm = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications
  notifications = signal([
    {
      id: 1,
      type: 'success',
      title: 'Document validé',
      message: 'Votre CNI a été validée avec succès',
      time: 'Il y a 2 heures',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Rappel de rendez-vous',
      message: 'Votre rendez-vous est prévu pour demain à 10h00',
      time: 'Il y a 5 heures',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Document expirant',
      message: 'Votre certificat de résidence expire dans 30 jours',
      time: 'Hier',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Mise à jour système',
      message: 'Nouvelles fonctionnalités disponibles sur IdentiGuinée',
      time: 'Il y a 2 jours',
      read: true
    }
  ]);

  // Demandes de l'utilisateur
  userDemandes = signal([
    {
      id: 'CNI-12345678',
      type: 'CNI',
      status: 'validated',
      submittedDate: '2026-05-01',
      validationDate: '2026-05-02',
      appointmentDate: '2026-05-03',
      appointmentTime: '10:00',
      center: 'Centre Administratif de Conakry',
      name: 'Doe John',
      blockchainId: '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      documents: {
        photo: 'photo_id.jpg',
        acteNaissance: 'acte_naissance.pdf',
        cniParent: null,
        justificatif: 'facture_eau.pdf'
      },
      price: 55000,
      currency: 'GNF'
    },
    {
      id: 'GP-98765432',
      type: 'Passeport',
      status: 'processing',
      submittedDate: '2026-05-10',
      validationDate: null,
      appointmentDate: '2026-05-15',
      appointmentTime: '14:00',
      center: 'Centre Administratif de Conakry',
      name: 'Doe John',
      blockchainId: null,
      documents: {
        photo: 'passport_photo.jpg',
        acteNaissance: 'acte_naissance.pdf',
        cniParent: 'cni_mere.jpg',
        justificatif: null
      },
      price: 500000,
      currency: 'GNF',
      validity: '5 ans'
    },
    {
      id: 'CNI-11223344',
      type: 'CNI',
      status: 'pending',
      submittedDate: '2026-05-15',
      validationDate: null,
      appointmentDate: null,
      appointmentTime: null,
      center: null,
      name: 'Doe John',
      blockchainId: null,
      documents: {},
      price: 55000,
      currency: 'GNF'
    }
  ]);

  // Navigation
  goToPortal() {
    this.router.navigate(['/']);
  }

  goToMyDocuments() {
    this.router.navigate(['/mes-documents']);
  }

  goToSupport() {
    this.router.navigate(['/support']);
  }

  // Édition du profil
  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  saveProfile() {
    // Simuler la sauvegarde
    this.isEditing.set(false);
    this.notificationService.success('Profil mis à jour avec succès');
  }

  cancelEdit() {
    this.isEditing.set(false);
    // Réinitialiser les valeurs originales
  }

  // Changement de mot de passe
  togglePasswordChange() {
    this.isChangingPassword.set(!this.isChangingPassword());
  }

  changePassword() {
    const form = this.passwordForm();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      this.notificationService.warning('Veuillez remplir tous les champs');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      this.notificationService.warning('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.newPassword.length < 8) {
      this.notificationService.warning('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Simuler le changement de mot de passe
    this.isChangingPassword.set(false);
    this.passwordForm.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.notificationService.success('Mot de passe changé avec succès');
  }

  // Notifications
  toggleNotifications() {
    this.showNotifications.set(!this.showNotifications());
  }

  markAsRead(notificationId: number) {
    const notifs = this.notifications().map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications.set(notifs);
  }

  deleteNotification(notificationId: number) {
    const notifs = this.notifications().filter(n => n.id !== notificationId);
    this.notifications.set(notifs);
  }

  unreadCount = computed(() => {
    return this.notifications().filter(n => !n.read).length;
  });

  // Photo de profil
  uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Simuler l'upload de photo
      const reader = new FileReader();
      reader.onload = (e) => {
        // Ici vous enverriez l'image au serveur
        this.notificationService.success('Photo téléchargée avec succès');
      };
      reader.readAsDataURL(file);
    }
  }

  // Contact support
  contactSupport() {
    const message = encodeURIComponent(`Bonjour, je suis ${this.userInfo().fullName} et j'ai besoin d'aide avec mon profil.`);
    window.open(`mailto:support@identiguinee.gn?subject=Aide Profil - ${this.userInfo().fullName}&body=${message}`);
  }

  // Déconnexion
  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Simuler la déconnexion
      alert('Déconnexion réussie');
      this.router.navigate(['/']);
    }
  }

  // Getters
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return '#00c851';
      case 'warning': return '#ffbb33';
      case 'error': return '#ff4444';
      default: return '#0066cc';
    }
  }

  // Validation du formulaire
  validatePasswordForm(): boolean {
    const form = this.passwordForm();
    return !!(form.currentPassword && form.newPassword && form.confirmPassword && 
           form.newPassword.length >= 8 && form.newPassword === form.confirmPassword);
  }

  // Gestion de l'historique
  showHistorySection() {
    return this.showHistory();
  }

  displayHistory() {
    this.showHistory.set(true);
    this.showSettings.set(false);
  }

  hideHistory() {
    this.showHistory.set(false);
  }

  // Gestion des paramètres
  showSettingsSection() {
    return this.showSettings();
  }

  displaySettings() {
    this.showSettings.set(true);
    this.showHistory.set(false);
  }

  hideSettings() {
    this.showSettings.set(false);
  }

  saveSettings() {
    // Simuler la sauvegarde des paramètres
    this.showSettings.set(false);
    alert('Paramètres sauvegardés avec succès');
  }

  // Gestion des demandes
  toggleDemandes() {
    this.showDemandes.set(!this.showDemandes());
  }

  showDemandesSection() {
    return this.showDemandes();
  }

  displayDemandes() {
    this.showDemandes.set(true);
    this.showHistory.set(false);
    this.showSettings.set(false);
  }

  hideDemandes() {
    this.showDemandes.set(false);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'validated': return 'Validé';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'validated': return '#00c851';
      case 'processing': return '#ffbb33';
      case 'pending': return '#ff6b35';
      default: return '#666666';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'validated': return '✅';
      case 'processing': return '⏳';
      case 'pending': return '⏸️';
      default: return '❓';
    }
  }

  trackDemande(demandeId: string) {
    this.router.navigate(['/suivi'], { queryParams: { ref: demandeId } });
  }

  downloadDocument(demandeId: string) {
    if (confirm('Télécharger le document ?')) {
      alert('Téléchargement du document ' + demandeId + ' initié');
    }
  }

  getDemandeStats() {
    const demandes = this.userDemandes();
    return {
      total: demandes.length,
      validated: demandes.filter(d => d.status === 'validated').length,
      processing: demandes.filter(d => d.status === 'processing').length,
      pending: demandes.filter(d => d.status === 'pending').length
    };
  }
}
