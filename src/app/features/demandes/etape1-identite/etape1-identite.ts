import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../demande.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-etape1-identite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etape1-identite.html',
  styleUrls: ['./etape1-identite.css']
})
export class Etape1IdentiteComponent {
  formData = signal({
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    nationalite: 'Guinéenne',
    profession: '',
    adresse: '',
    telephone: '',
    email: '',
    nomPere: '',
    nomMere: '',
    taille: '',
    teint: '',
    signesParticuliers: ''
  });

  errors = signal<Record<string, string>>({});
  isSubmitting = signal(false);

  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  updateField(field: string, value: string) {
    this.formData.update(data => ({ ...data, [field]: value }));
    // Clear error when user starts typing
    if (this.errors()[field]) {
      this.errors.update(errs => {
        const newErrs = { ...errs };
        delete newErrs[field];
        return newErrs;
      });
    }
  }

  validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    const data = this.formData();

    if (!data.nom.trim()) newErrors['nom'] = 'Le nom est obligatoire';
    if (!data.prenom.trim()) newErrors['prenom'] = 'Le prénom est obligatoire';
    if (!data.dateNaissance) newErrors['dateNaissance'] = 'La date de naissance est obligatoire';
    if (!data.lieuNaissance.trim()) newErrors['lieuNaissance'] = 'Le lieu de naissance est obligatoire';
    if (!data.sexe) newErrors['sexe'] = 'Le sexe est obligatoire';
    if (!data.telephone.trim()) newErrors['telephone'] = 'Le téléphone est obligatoire';
    if (!data.email.trim()) newErrors['email'] = 'L\'email est obligatoire';
    else if (!this.isValidEmail(data.email)) newErrors['email'] = 'L\'email n\'est pas valide';

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      await this.demandeService.submitDemande({
        ...this.formData(),
        etape: 1,
        timestamp: new Date().toISOString()
      });
      
      // Navigate to next step
      this.router.navigate(['/demande/etape2-documents']);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goToPreviousStep() {
    this.router.navigate(['/passeport']);
  }

  getProgressPercentage(): number {
    return 25; // Étape 1 sur 4
  }
}
