import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apropos',
  imports: [CommonModule],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css'
})
export class Apropos {
  constructor(private router: Router) {}

  goToPortal() {
    this.router.navigate(['/']);
  }

  goToSupport() {
    this.router.navigate(['/support']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }
}
