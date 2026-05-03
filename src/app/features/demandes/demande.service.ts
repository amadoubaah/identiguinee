import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  constructor() { }

  // Add your service methods here
  submitDemande(data: any) {
    // Implementation for submitting demande
    console.log('Submitting demande:', data);
  }

  getDemandeStatus(id: string) {
    // Implementation for getting demande status
    console.log('Getting status for demande:', id);
  }
}
