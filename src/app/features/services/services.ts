import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [CommonModule, Navbar],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  
  constructor(private router: Router) {}

  goToService(service: string) {
    switch(service) {
      case 'cni':
        this.router.navigate(['/demande/etape1-identite']);
        break;
      case 'acte':
        this.router.navigate(['/acte-naissance']);
        break;
      case 'passport':
        this.router.navigate(['/passeport']);
        break;
      case 'suivi':
        this.router.navigate(['/suivi']);
        break;
      case 'documents':
        this.router.navigate(['/mes-documents']);
        break;
    }
  }
}
