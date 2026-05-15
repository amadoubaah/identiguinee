import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

interface DemandeData {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  sexe?: string;
  nationalite?: string;
  profession?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  nomPere?: string;
  nomMere?: string;
  taille?: string;
  teint?: string;
  signesParticuliers?: string;
  documents?: any[];
  otpVerified?: boolean;
  rendezvous?: {
    date: string;
    time: string;
    center: any;
  };
  etape?: number;
  timestamp?: string;
}

interface DemandeStatus {
  id: string;
  reference: string;
  statut: 'en_attente' | 'en_traitement' | 'en_revision' | 'approuve' | 'rejete' | 'complet';
  progression: number;
  derniereMiseAJour: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'https://api.identiguinee.gn'; // URL de l'API (à configurer)
  private demandeStorage = new Map<string, DemandeData>();

  constructor(private http: HttpClient) { }

  /**
   * Soumet une demande d'identité
   */
  submitDemande(data: DemandeData): Observable<any> {
    // Simulation d'un appel API (remplacer par vrai appel HTTP)
    const demandeId = this.generateDemandeId();
    this.demandeStorage.set(demandeId, data);

    return of({ success: true, demandeId, message: 'Demande soumise avec succès' }).pipe(
      delay(500), // Simuler le délai réseau
      catchError(error => {
        console.error('Erreur lors de la soumission:', error);
        return throwError(() => new Error('Erreur lors de la soumission de la demande'));
      })
    );

    // Pour l'implémentation réelle avec HTTP:
    // return this.http.post(`${this.apiUrl}/demandes`, data).pipe(
    //   catchError(this.handleError)
    // );
  }

  /**
   * Récupère le statut d'une demande
   */
  getDemandeStatus(id: string): Observable<DemandeStatus> {
    // Simulation d'un appel API
    const mockStatus: DemandeStatus = {
      id,
      reference: `GN-CNI-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      statut: 'en_traitement',
      progression: 50,
      derniereMiseAJour: new Date().toISOString()
    };

    return of(mockStatus).pipe(
      delay(300),
      catchError(error => {
        console.error('Erreur lors de la récupération du statut:', error);
        return throwError(() => new Error('Erreur lors de la récupération du statut'));
      })
    );

    // Pour l'implémentation réelle avec HTTP:
    // return this.http.get<DemandeStatus>(`${this.apiUrl}/demandes/${id}/status`).pipe(
    //   catchError(this.handleError)
    // );
  }

  /**
   * Récupère les détails complets d'une demande
   */
  getDemandeDetails(id: string): Observable<DemandeData | null> {
    const data = this.demandeStorage.get(id);
    return of(data || null).pipe(
      delay(200),
      catchError(error => {
        console.error('Erreur lors de la récupération des détails:', error);
        return throwError(() => new Error('Erreur lors de la récupération des détails'));
      })
    );
  }

  /**
   * Met à jour une demande existante
   */
  updateDemande(id: string, data: Partial<DemandeData>): Observable<any> {
    const existingData = this.demandeStorage.get(id);
    if (existingData) {
      this.demandeStorage.set(id, { ...existingData, ...data });
    }

    return of({ success: true, message: 'Demande mise à jour avec succès' }).pipe(
      delay(300),
      catchError(error => {
        console.error('Erreur lors de la mise à jour:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour de la demande'));
      })
    );
  }

  /**
   * Vérifie un code OTP
   */
  verifyOtp(phoneNumber: string, code: string): Observable<boolean> {
    // Simulation de vérification OTP
    const isValid = code === '123456'; // Code de test

    return of(isValid).pipe(
      delay(1000),
      catchError(error => {
        console.error('Erreur lors de la vérification OTP:', error);
        return throwError(() => new Error('Erreur lors de la vérification OTP'));
      })
    );
  }

  /**
   * Envoie un nouveau code OTP
   */
  resendOtp(phoneNumber: string): Observable<any> {
    return of({ success: true, message: 'Code OTP renvoyé avec succès' }).pipe(
      delay(500),
      catchError(error => {
        console.error('Erreur lors du renvoi OTP:', error);
        return throwError(() => new Error('Erreur lors du renvoi du code OTP'));
      })
    );
  }

  /**
   * Récupère les créneaux disponibles pour un rendez-vous
   */
  getAvailableSlots(date: string, centerId: string): Observable<string[]> {
    // Simulation des créneaux disponibles
    const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

    return of(slots).pipe(
      delay(200),
      catchError(error => {
        console.error('Erreur lors de la récupération des créneaux:', error);
        return throwError(() => new Error('Erreur lors de la récupération des créneaux'));
      })
    );
  }

  /**
   * Annule une demande
   */
  cancelDemande(id: string): Observable<any> {
    this.demandeStorage.delete(id);

    return of({ success: true, message: 'Demande annulée avec succès' }).pipe(
      delay(300),
      catchError(error => {
        console.error('Erreur lors de l\'annulation:', error);
        return throwError(() => new Error('Erreur lors de l\'annulation de la demande'));
      })
    );
  }

  /**
   * Génère un ID de demande unique
   */
  private generateDemandeId(): string {
    return `DEM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: any) {
    console.error('Erreur HTTP:', error);
    return throwError(() => error);
  }
}
