import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support {
  constructor(private router: Router) {}

  // États pour le chat et formulaire
  isChatOpen = signal(false);
  chatMessages = signal<Array<{sender: string, message: string, time: string}>>([
    {
      sender: 'support',
      message: 'Bonjour ! Bienvenue sur le support IdentiGuinée. Comment puis-je vous aider ?',
      time: new Date().toLocaleTimeString('fr-GN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  currentMessage = signal('');
  isTyping = signal(false);

  // Informations de contact
  contactInfo = {
    phone: '+224 622 22 22 22',
    email: 'support@identiguinee.gn',
    whatsapp: '+224 622 22 22 22',
    address: 'Avenue du Ministère, Conakry, Guinée',
    hours: 'Lun-Ven: 8h-18h, Sam: 9h-14h'
  };

  // Délais de traitement
  processingTimes = {
    cni: {
      standard: '5-7 jours ouvrés',
      urgent: '2-3 jours ouvrés',
      express: '24 heures'
    },
    birthCertificate: {
      standard: '3-5 jours ouvrés',
      urgent: '1-2 jours ouvrés'
    },
    renewal: {
      standard: '7-10 jours ouvrés',
      urgent: '3-5 jours ouvrés'
    }
  };

  // Documents requis
  requiredDocuments = {
    cni: [
      'Acte de naissance original',
      'Certificat de résidence',
      '2 photos d\'identité récentes',
      'Pièce d\'identité des parents (si mineur)',
      'Justificatif de domicile'
    ],
    renewal: [
      'Ancienne CNI expirée',
      'Acte de naissance',
      '1 photo d\'identité récente',
      'Justificatif de domicile si changement d\'adresse'
    ],
    birthCertificate: [
      'Déclaration de naissance',
      'Carte d\'identité des parents',
      'Certificat médical de naissance (si disponible)'
    ]
  };

  // FAQ
  faqItems = signal([
    {
      question: 'Comment faire une demande de CNI ?',
      answer: 'Vous pouvez faire une demande en ligne via notre portail ou vous rendre dans un centre d\'inscription. Le processus prend environ 10 minutes.',
      category: 'cni',
      expanded: false
    },
    {
      question: 'Quels sont les documents requis pour la CNI ?',
      answer: 'Vous aurez besoin de votre acte de naissance, d\'un certificat de résidence, de 2 photos d\'identité et d\'un justificatif de domicile.',
      category: 'documents',
      expanded: false
    },
    {
      question: 'Combien de temps prend le traitement ?',
      answer: 'Le traitement standard prend 5-7 jours ouvrés. Nous offrons également des options urgentes (2-3 jours) et express (24 heures).',
      category: 'delais',
      expanded: false
    },
    {
      question: 'Comment renouveler ma CNI ?',
      answer: 'Le renouvellement peut se faire en ligne 30 jours avant l\'expiration. Vous aurez besoin de votre ancienne CNI et d\'une photo récente.',
      category: 'renouvellement',
      expanded: false
    },
    {
      question: 'Comment vérifier l\'authenticité d\'un document ?',
      answer: 'Scannez le QR code sur le document ou entrez l\'ID blockchain sur notre page de vérification. La vérification est instantanée.',
      category: 'verification',
      expanded: false
    }
  ]);

  // Navigation
  goToPortal() {
    this.router.navigate(['/']);
  }

  goToCNIRequest() {
    this.router.navigate(['/demande/etape1-identite']);
  }

  goToRenewal() {
    this.router.navigate(['/renouvellement']);
  }

  // Chat functions
  toggleChat() {
    this.isChatOpen.set(!this.isChatOpen());
  }

  sendMessage() {
    const message = this.currentMessage().trim();
    if (!message) return;

    // Ajouter le message de l'utilisateur
    this.chatMessages.set([
      ...this.chatMessages(),
      {
        sender: 'user',
        message: message,
        time: new Date().toLocaleTimeString('fr-GN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    this.currentMessage.set('');
    this.isTyping.set(true);

    // Simuler une réponse du support
    setTimeout(() => {
      this.isTyping.set(false);
      const responses = [
        'Je comprends votre demande. Laissez-moi vérifier cela pour vous.',
        'Merci pour votre message. Un agent va vous assister shortly.',
        'Je peux vous aider avec ça. Voici ce que je vous recommande...',
        'Excellente question ! Voici la procédure à suivre...'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      this.chatMessages.set([
        ...this.chatMessages(),
        {
          sender: 'support',
          message: randomResponse,
          time: new Date().toLocaleTimeString('fr-GN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  }

  // FAQ functions
  toggleFAQ(index: number) {
    const faq = [...this.faqItems()];
    faq[index].expanded = !faq[index].expanded;
    this.faqItems.set(faq);
  }

  // Contact functions
  callSupport() {
    window.open(`tel:${this.contactInfo.phone}`);
  }

  emailSupport() {
    window.open(`mailto:${this.contactInfo.email}?subject=Demande de support IdentiGuinée`);
  }

  openWhatsApp() {
    window.open(`https://wa.me/${this.contactInfo.whatsapp.replace(/[\s\+]/g, '')}`);
  }

  // Form submission
  submitSupportForm(formData: any) {
    console.log('Formulaire support soumis:', formData);
    // Ici vous enverriez les données à votre backend
    alert('Votre demande a été soumise avec succès. Nous vous contacterons dans les 24 heures.');
  }
}
