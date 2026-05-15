import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../demande.service';

@Component({
  selector: 'app-etape3-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etape3-otp.html',
  styleUrls: ['./etape3-otp.css']
})
export class Etape3Otp implements OnDestroy {
  otpCode = signal(['', '', '', '', '', '']);
  isVerifying = signal(false);
  isResending = signal(false);
  verificationStatus = signal<'idle' | 'verifying' | 'success' | 'error'>('idle');
  phoneNumber = signal('+224 620 123 456');
  timeLeft = signal(120);
  timerActive = signal(false);
  private timerInterval: any;

  constructor(
    private demandeService: DemandeService,
    private router: Router
  ) {
    this.startTimer();
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = '';
      return;
    }
    
    const newOtp = [...this.otpCode()];
    newOtp[index] = value.slice(-1);
    this.otpCode.set(newOtp);
    
    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== '')) {
      setTimeout(() => this.verifyOtp(), 100);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpCode()[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  async verifyOtp() {
    const code = this.otpCode().join('');
    
    if (code.length !== 6) {
      this.verificationStatus.set('error');
      return;
    }

    this.isVerifying.set(true);
    this.verificationStatus.set('verifying');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      this.verificationStatus.set('success');
      
      await this.demandeService.submitDemande({
        otpVerified: true,
        etape: 3,
        timestamp: new Date().toISOString()
      });
      
      setTimeout(() => {
        this.router.navigate(['/demande/etape4-rendezvous']);
      }, 1000);
      
    } catch (error) {
      this.verificationStatus.set('error');
      console.error('Erreur de vérification:', error);
    } finally {
      this.isVerifying.set(false);
    }
  }

  async resendOtp() {
    this.isResending.set(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and timer
      this.otpCode.set(['', '', '', '', '', '']);
      this.verificationStatus.set('idle');
      this.timeLeft.set(120);
      this.timerActive.set(true);
      this.startTimer();
      
      // Focus first input
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
      
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
    } finally {
      this.isResending.set(false);
    }
  }

  startTimer() {
    this.timerActive.set(true);
    this.timerInterval = setInterval(() => {
      const current = this.timeLeft();
      if (current <= 0) {
        clearInterval(this.timerInterval);
        this.timerActive.set(false);
      } else {
        this.timeLeft.set(current - 1);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // Nettoyage du timer pour éviter les memory leaks
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  goToPreviousStep() {
    this.router.navigate(['/demande/etape2-documents']);
  }

  getProgressPercentage(): number {
    return 75; // Étape 3 sur 4
  }

  getVerificationMessage(): string {
    switch (this.verificationStatus()) {
      case 'verifying':
        return 'Vérification en cours...';
      case 'success':
        return 'Code vérifié avec succès!';
      case 'error':
        return 'Code incorrect. Veuillez réessayer.';
      default:
        return '';
    }
  }
}
