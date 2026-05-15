import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../demande.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-etape4-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etape4-rendezvous.html',
  styleUrls: ['./etape4-rendezvous.css']
})
export class Etape4Rendezvous {
  selectedDate = signal<Date | null>(null);
  selectedTime = signal('');
  selectedCenter = signal('');
  isSubmitting = signal(false);
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  
  centers = signal([
    { id: 'centre1', name: 'Centre Principal Conakry', address: 'Kaloum, Conakry', capacity: 50 },
    { id: 'centre2', name: 'Centre Ratoma', address: 'Ratoma, Conakry', capacity: 30 },
    { id: 'centre3', name: 'Centre Matam', address: 'Matam, Conakry', capacity: 25 },
    { id: 'centre4', name: 'Centre Dixinn', address: 'Dixinn, Conakry', capacity: 35 }
  ]);
  
  constructor(
    private demandeService: DemandeService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  // Calendar Methods
  dayHeaders(): string[] {
    return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  }

  calendarDates(): Date[] {
    const dates: Date[] = [];
    const firstDay = new Date(this.currentYear(), this.currentMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  }

  isDateAvailable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Exclude past dates and weekends
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6;
  }

  isSelected(date: Date): boolean {
    return this.selectedDate()?.toDateString() === date.toDateString();
  }

  selectDate(date: Date) {
    if (this.isDateAvailable(date)) {
      this.selectedDate.set(date);
      this.selectedTime.set('');
    }
  }

  previousMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  previousYear() {
    this.currentYear.set(this.currentYear() - 1);
  }

  nextYear() {
    this.currentYear.set(this.currentYear() + 1);
  }

  getCurrentMonthName(): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[this.currentMonth()];
  }

  getCurrentYear(): number {
    return this.currentYear();
  }

  // Time Methods
  availableTimeSlots(): string[] {
    const times: string[] = [];
    for (let hour = 8; hour <= 16; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 16) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
  }

  // Center Methods
  selectCenter(centerId: string) {
    this.selectedCenter.set(centerId);
  }

  // Validation Methods
  canSubmit(): boolean {
    return !!(this.selectedDate() && this.selectedTime() && this.selectedCenter());
  }

  // Submit Method
  async onSubmit() {
    if (!this.canSubmit()) {
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const center = this.centers().find(c => c.id === this.selectedCenter());
      
      await this.demandeService.submitDemande({
        rendezvous: {
          date: this.selectedDate()!.toISOString(),
          time: this.selectedTime(),
          center: center!
        },
        etape: 4,
        timestamp: new Date().toISOString()
      });
      
      this.router.navigate(['/demande/confirmation']);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.notificationService.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Navigation Methods
  goToPreviousStep() {
    this.router.navigate(['/demande/etape3-otp']);
  }

  getProgressPercentage(): number {
    return 100; // Étape 4 sur 4
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-GN', options);
  }

  getSelectedCenter() {
    return this.centers().find(c => c.id === this.selectedCenter());
  }
}
