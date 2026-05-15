import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  dashboardStats = {
    totalDocuments: 15423,
    verifiedDocuments: 14789,
    fraudulentDocuments: 634,
    pendingVerifications: 156,
    activeUsers: 8934,
    systemUptime: '99.8%',
    avgProcessingTime: 2.8,
    blockchainTransactions: 15423
  };

  economicImpact = {
    bribesAvoided: 4627,
    totalSavings: '231 350 000 GNF',
    citizensHelped: 15423,
    fraudDetectionRate: 4.1,
    avgBribeCost: 50000,
    monthlyGrowth: 23.5,
    // Métriques basées sur les données réelles guinéennes
    populationGuinee: 14_000_000, // Population estimée 2024
    tauxCorruption: 0.65, // 60-70% des Guinéens paient des pots-de-vin
    coutMoyenPotDeVin: 200_000, // 200 000 GNF en moyenne par démarche
    demandesTraiteesSansIntermediaire: 15423,
    tempsMoyenVerification: 2.8 // secondes
  };

  recentActivities = [
    {
      id: 1,
      type: 'verification',
      documentType: 'Carte d\'identité',
      status: 'authentic',
      timestamp: new Date(Date.now() - 5 * 60000),
      user: 'Mohamed Diallo',
      processingTime: 2.3
    },
    {
      id: 2,
      type: 'verification',
      documentType: 'Passeport',
      status: 'fraudulent',
      timestamp: new Date(Date.now() - 12 * 60000),
      user: 'Fatoumata Bah',
      processingTime: 3.1
    },
    {
      id: 3,
      type: 'verification',
      documentType: 'Permis de conduire',
      status: 'authentic',
      timestamp: new Date(Date.now() - 18 * 60000),
      user: 'Abdoulaye Keïta',
      processingTime: 2.7
    },
    {
      id: 4,
      type: 'system',
      action: 'Blockchain sync',
      status: 'completed',
      timestamp: new Date(Date.now() - 25 * 60000),
      details: '124 transactions synchronisées'
    },
    {
      id: 5,
      type: 'verification',
      documentType: 'Certificat de naissance',
      status: 'authentic',
      timestamp: new Date(Date.now() - 32 * 60000),
      user: 'Aïssatou Sow',
      processingTime: 2.5
    }
  ];

  systemMetrics = {
    cpu: 45.2,
    memory: 67.8,
    storage: 34.1,
    network: 12.3,
    blockchainSync: 98.7
  };

  fraudPatterns = [
    {
      pattern: 'Numéros de série falsifiés',
      occurrences: 89,
      trend: 'up',
      severity: 'high'
    },
    {
      pattern: 'Photos non conformes',
      occurrences: 156,
      trend: 'stable',
      severity: 'medium'
    },
    {
      pattern: 'Dates d\'expiration modifiées',
      occurrences: 34,
      trend: 'down',
      severity: 'high'
    },
    {
      pattern: 'Signatures falsifiées',
      occurrences: 23,
      trend: 'up',
      severity: 'critical'
    }
  ];

  selectedPeriod = '7d';
  isLoading = false;
  private statsInterval: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    // Simulation du chargement des données
    setTimeout(() => {
      this.isLoading = false;
      this.updateRealTimeStats();
    }, 1500);
  }

  updateRealTimeStats(): void {
    // Mise à jour en temps réel des statistiques
    this.statsInterval = setInterval(() => {
      this.dashboardStats.systemUptime = this.calculateUptime();
      this.dashboardStats.avgProcessingTime = this.updateProcessingTime();
    }, 5000);
  }

  ngOnDestroy(): void {
    // Nettoyage de l'intervalle pour éviter les memory leaks
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  calculateUptime(): string {
    const uptime = 99.5 + Math.random() * 0.4;
    return uptime.toFixed(1) + '%';
  }

  updateProcessingTime(): number {
    const baseTime = 2.8;
    const variation = (Math.random() - 0.5) * 0.4;
    return Math.max(2.0, Math.min(3.5, baseTime + variation));
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadDashboardData();
  }

  exportReport(): void {
    // Simulation de l'exportation du rapport
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: this.selectedPeriod,
      stats: this.dashboardStats,
      impact: this.economicImpact,
      activities: this.recentActivities
    };

    console.log('Rapport généré:', reportData);
    this.notificationService.success('Rapport exporté avec succès!');
  }

  viewUserDetails(userId: string): void {
    console.log('Affichage des détails utilisateur:', userId);
  }

  investigateFraud(patternId: number): void {
    console.log('Investigation du motif de fraude:', patternId);
  }

  calculateROI(): any {
    const implementationCost = 50000000; // 50M GNF
    const monthlySavings = parseInt(this.economicImpact.totalSavings.replace(/[^0-9]/g, ''));
    const annualSavings = monthlySavings * 12;
    const roi = ((annualSavings - implementationCost) / implementationCost) * 100;

    return {
      investment: '50 000 000 GNF',
      annualSavings: annualSavings.toLocaleString('fr-FR') + ' GNF',
      roi: roi.toFixed(1) + '%',
      paybackPeriod: (implementationCost / monthlySavings).toFixed(1) + ' mois'
    };
  }

  /**
   * Calcule les métriques d'impact réelles basées sur les données guinéennes
   */
  calculateRealImpactMetrics(): any {
    const demandesTraitees = this.economicImpact.demandesTraiteesSansIntermediaire;
    const tauxCorruption = this.economicImpact.tauxCorruption;
    const coutMoyen = this.economicImpact.coutMoyenPotDeVin;

    // Pots-de-vin évités = demandes traitées × taux de corruption
    const potsDeVinEvites = Math.floor(demandesTraitees * tauxCorruption);

    // Économies totales = pots-de-vin évités × coût moyen
    const economiesTotales = potsDeVinEvites * coutMoyen;

    // Temps moyen de vérification (déjà calculé)
    const tempsMoyenVerification = this.economicImpact.tempsMoyenVerification;

    // Pourcentage de la population servie
    const populationServie = (demandesTraitees / this.economicImpact.populationGuinee) * 100;

    // Projection annuelle
    const projectionAnnuelle = {
      demandes: demandesTraitees * 12,
      potsDeVinEvites: potsDeVinEvites * 12,
      economies: economiesTotales * 12
    };

    return {
      demandesTraiteesSansIntermediaire: demandesTraitees.toLocaleString('fr-FR'),
      potsDeVinEvites: potsDeVinEvites.toLocaleString('fr-FR'),
      economiesTotales: economiesTotales.toLocaleString('fr-FR') + ' GNF',
      tempsMoyenVerification: tempsMoyenVerification.toFixed(1) + ' secondes',
      populationServie: populationServie.toFixed(2) + '%',
      projectionAnnuelle: {
        demandes: projectionAnnuelle.demandes.toLocaleString('fr-FR'),
        potsDeVinEvites: projectionAnnuelle.potsDeVinEvites.toLocaleString('fr-FR'),
        economies: projectionAnnuelle.economies.toLocaleString('fr-FR') + ' GNF'
      },
      tauxCorruption: (tauxCorruption * 100).toFixed(0) + '%',
      coutMoyenPotDeVin: coutMoyen.toLocaleString('fr-FR') + ' GNF'
    };
  }

  /**
   * Formate les nombres avec séparateurs de milliers
   */
  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }

  goToVerification(): void {
    this.router.navigate(['/verification']);
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#f56565';
      case 'high': return '#ed8936';
      case 'medium': return '#ecc94b';
      default: return '#48bb78';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} minute${diff > 1 ? 's' : ''}`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} heure${Math.floor(diff / 60) > 1 ? 's' : ''}`;
    return `Il y a ${Math.floor(diff / 1440)} jour${Math.floor(diff / 1440) > 1 ? 's' : ''}`;
  }
}
