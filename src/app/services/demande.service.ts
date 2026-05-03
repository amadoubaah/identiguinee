import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private readonly STORAGE_KEY = 'cni_demande';
  private readonly REF_KEY = 'cni_ref';
  private readonly STATUS_KEY = 'cni_status';

  constructor() {}

  // Sauvegarder les données de la demande
  setData(data: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Récupérer les données de la demande
  getData(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Sauvegarder la référence
  setRef(ref: string): void {
    localStorage.setItem(this.REF_KEY, ref);
  }

  // Récupérer la référence
  getRef(): string {
    return localStorage.getItem(this.REF_KEY) || '';
  }

  // Sauvegarder le statut
  setStatus(status: string): void {
    localStorage.setItem(this.STATUS_KEY, status);
  }

  // Récupérer le statut
  getStatus(): string {
    return localStorage.getItem(this.STATUS_KEY) || '';
  }

  // Effacer toutes les données
  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.REF_KEY);
    localStorage.removeItem(this.STATUS_KEY);
  }
}
