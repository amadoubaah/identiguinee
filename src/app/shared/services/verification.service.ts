import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';

export interface VerificationResult {
  success: boolean;
  authentic: boolean;
  message: string;
  document?: {
    nom: string;
    prenom: string;
    numeroCNI: string;
    dateEmission: string;
    dateExpiration: string;
    lieuEmission: string;
    hashBlockchain: string;
    statut: 'actif' | 'expiré' | 'revoked';
  };
  verificationTime: number;
}

export interface DocumentData {
  nom: string;
  prenom: string;
  numeroCNI: string;
  dateEmission: string;
  dateExpiration: string;
  lieuEmission: string;
  hashBlockchain: string;
  statut: 'actif' | 'expiré' | 'revoked';
}

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  // Base de données simulée de documents authentiques
  private authenticDocuments = new Map<string, DocumentData>();

  constructor() {
    // Initialiser avec des documents de test
    this.initializeTestData();
  }

  /**
   * Vérifie un code QR ou un hash blockchain
   * Temps de vérification garanti < 3 secondes
   */
  verifyDocument(qrCode: string): Observable<VerificationResult> {
    const startTime = Date.now();

    // Simulation de vérification blockchain (remplacer par vrai appel API)
    return of(this.performVerification(qrCode)).pipe(
      delay(Math.random() * 500 + 200), // 200-700ms pour garantir < 3s
      map(result => ({
        ...result,
        verificationTime: Date.now() - startTime
      })),
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la vérification'));
      })
    );

    // Pour l'implémentation réelle avec API:
    // return this.http.get<VerificationResult>(`${this.apiUrl}/verify/${qrCode}`).pipe(
    //   catchError(error => {
    //     return throwError(() => new Error('Erreur lors de la vérification'));
    //   })
    // );
  }

  /**
   * Vérification par hash blockchain (API publique pour tiers)
   */
  verifyByHash(hash: string): Observable<VerificationResult> {
    const startTime = Date.now();

    return of(this.performVerification(hash)).pipe(
      delay(Math.random() * 500 + 200),
      map(result => ({
        ...result,
        verificationTime: Date.now() - startTime
      })),
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la vérification'));
      })
    );
  }

  /**
   * Simulation de la vérification (remplacer par vraie vérification blockchain)
   */
  private performVerification(qrCode: string): VerificationResult {
    const document = this.authenticDocuments.get(qrCode);

    if (!document) {
      return {
        success: true,
        authentic: false,
        message: 'Document non trouvé dans la blockchain NaissanceChain',
        verificationTime: 0
      };
    }

    // Vérifier si le document est expiré
    const isExpired = new Date(document.dateExpiration) < new Date();

    return {
      success: true,
      authentic: !isExpired && document.statut === 'actif',
      message: isExpired
        ? 'Document authentique mais expiré'
        : document.statut === 'revoked'
        ? 'Document authentique mais révoqué'
        : 'Document authentique et valide',
      document: document,
      verificationTime: 0
    };
  }

  /**
   * Initialise les données de test
   */
  private initializeTestData(): void {
    const testDocuments: DocumentData[] = [
      {
        nom: 'Doe',
        prenom: 'John',
        numeroCNI: 'GN-CNI-2026-00847',
        dateEmission: '2026-01-15',
        dateExpiration: '2031-01-15',
        lieuEmission: 'Conakry',
        hashBlockchain: '0x7f9a3b2c1d8e5f6a4b9c0d2e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
        statut: 'actif'
      },
      {
        nom: 'Ah',
        prenom: 'Amadouba',
        numeroCNI: 'GN-CNI-2026-01234',
        dateEmission: '2026-02-01',
        dateExpiration: '2031-02-01',
        lieuEmission: 'Conakry',
        hashBlockchain: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
        statut: 'actif'
      },
      {
        nom: 'Diallo',
        prenom: 'Fatoumata',
        numeroCNI: 'GN-CNI-2025-00567',
        dateEmission: '2025-03-10',
        dateExpiration: '2030-03-10',
        lieuEmission: 'Labé',
        hashBlockchain: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
        statut: 'actif'
      },
      {
        nom: 'Touré',
        prenom: 'Mamadou',
        numeroCNI: 'GN-CNI-2024-00999',
        dateEmission: '2024-01-01',
        dateExpiration: '2029-01-01',
        lieuEmission: 'Kankan',
        hashBlockchain: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
        statut: 'expiré'
      },
      {
        nom: 'Sow',
        prenom: 'Aïcha',
        numeroCNI: 'GN-CNI-2026-01111',
        dateEmission: '2026-04-15',
        dateExpiration: '2031-04-15',
        lieuEmission: 'Nzérékoré',
        hashBlockchain: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
        statut: 'revoked'
      }
    ];

    testDocuments.forEach(doc => {
      this.authenticDocuments.set(doc.hashBlockchain, doc);
      this.authenticDocuments.set(doc.numeroCNI, doc);
    });
  }

  /**
   * Ajoute un document à la base de données (pour tests)
   */
  addDocument(document: DocumentData): void {
    this.authenticDocuments.set(document.hashBlockchain, document);
    this.authenticDocuments.set(document.numeroCNI, document);
  }

  /**
   * Obtient les statistiques de vérification
   */
  getVerificationStats(): Observable<{
    totalVerifications: number;
    authenticDocuments: number;
    fraudulentDocuments: number;
    averageTime: number;
  }> {
    return of({
      totalVerifications: 15423,
      authenticDocuments: 14789,
      fraudulentDocuments: 634,
      averageTime: 2.8
    }).pipe(delay(300));
  }
}
