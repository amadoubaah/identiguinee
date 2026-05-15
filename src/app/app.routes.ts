import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/accueil/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'accueil',
    loadComponent: () => import('./features/accueil/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services').then(m => m.Services)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/auth/connexion/connexion').then(m => m.Connexion)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.Inscription)
  },
  {
    path: 'passeport',
    loadComponent: () => import('./features/passeport/passeport').then(m => m.Passeport)
  },
  {
    path: 'demande',
    loadChildren: () => import('./features/demandes/demandes-module').then(m => m.DemandesModule)
  },
  {
    path: 'demande/etape1-identite',
    loadComponent: () => import('./features/demandes/etape1-identite/etape1-identite').then(m => m.Etape1IdentiteComponent)
  },
  {
    path: 'demande/etape2-documents',
    loadComponent: () => import('./features/demandes/etape2-documents/etape2-documents').then(m => m.Etape2Documents)
  },
  {
    path: 'demande/etape3-otp',
    loadComponent: () => import('./features/demandes/etape3-otp/etape3-otp').then(m => m.Etape3Otp)
  },
  {
    path: 'demande/etape4-rendezvous',
    loadComponent: () => import('./features/demandes/etape4-rendezvous/etape4-rendezvous').then(m => m.Etape4Rendezvous)
  },
  {
    path: 'demande/confirmation',
    loadComponent: () => import('./features/demandes/confirmation/confirmation').then(m => m.ConfirmationComponent)
  },
  {
    path: 'suivi',
    loadComponent: () => import('./features/demandes/suivi/suivi').then(m => m.Suivi)
  },
  {
    path: 'telechargement',
    loadComponent: () => import('./features/telechargement/telechargement').then(m => m.Telechargement)
  },
  {
    path: 'acte-naissance',
    loadComponent: () => import('./features/acte-naissance/acte-naissance').then(m => m.ActeNaissance)
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support').then(m => m.Support)
  },
  {
    path: 'mes-documents',
    loadComponent: () => import('./features/mes-documents/mes-documents').then(m => m.MesDocuments)
  },
  {
    path: 'profil',
    loadComponent: () => import('./features/profil/profil').then(m => m.Profil)
  },
  {
    path: 'apropos',
    loadComponent: () => import('./features/apropos/apropos').then(m => m.Apropos)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
  },
  {
    path: 'verification',
    loadComponent: () => import('./features/third-party-verification/third-party-verification.component').then(m => m.ThirdPartyVerificationComponent)
  },
  {
    path: 'verifier',
    loadComponent: () => import('./features/verifier/verifier/verifier').then(m => m.VerifierComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  }
];
