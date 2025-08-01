import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
}

export const languages: Language[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'rm', label: 'Romansh', nativeLabel: 'Rumantsch' },
];

// Translation definitions
const translations = {
  en: {
    // Navigation
    'nav.browse_jobs': 'Browse Jobs',
    'nav.swipe_discovery': 'Swipe Discovery',
    'nav.upload_cv': 'Upload CV',
    'nav.companies': 'Companies',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.sign_in': 'Sign In',
    'nav.sign_up': 'Get Started',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.location': 'Location',
    'common.experience': 'Experience',
    'common.skills': 'Skills',
    'common.salary': 'Salary',
    
    // Hero Section
    'hero.title': 'Find Your Perfect Job Match in Switzerland',
    'hero.subtitle': 'AI-powered job matching that understands Swiss work culture, connects you with top employers, and accelerates your career growth.',
    'hero.cta_primary': 'Start Job Search',
    'hero.cta_secondary': 'Upload Your CV',
    
    // Profile Settings
    'profile.title': 'Profile Settings',
    'profile.subtitle': 'Manage your account settings and preferences',
    'profile.personal_info': 'Personal Information',
    'profile.professional_info': 'Professional Information',
    'profile.preferences': 'Preferences',
    'profile.privacy': 'Privacy Settings',
    'profile.account': 'Account Settings',
    'profile.first_name': 'First Name',
    'profile.last_name': 'Last Name',
    'profile.phone': 'Phone',
    'profile.bio': 'Bio',
    'profile.job_title': 'Job Title',
    'profile.save_changes': 'Save Changes',
    'profile.saving': 'Saving...',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.applications': 'Applications',
    'dashboard.matches': 'Matches',
    'dashboard.messages': 'Messages',
    'dashboard.profile_views': 'Profile Views',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.all': 'All',
    'notifications.unread': 'Unread',
    'notifications.jobs': 'Jobs',
    'notifications.mark_all_read': 'Mark all as read',
    'notifications.no_notifications': 'No notifications',
    'notifications.caught_up': "You're all caught up! Check back later for updates.",
    
    // AI Score
    'ai_score.title': 'AI Match Analysis',
    'ai_score.subtitle': 'Deep dive into your profile compatibility with detailed skill analysis and market insights',
    'ai_score.analyzing': 'Analyzing Your Profile',
    'ai_score.computing': 'Our AI is computing detailed skill matches and market insights...',
    'ai_score.overall_match': 'Overall Match',
    'ai_score.skill_match': 'Skill Match',
    'ai_score.market_fit': 'Market Fit',
    'ai_score.salary_potential': 'Salary Potential',

    // AI Chatbot
    'ai.welcome': "Hi! I'm your AI career assistant. I can help you find jobs, get salary insights, and optimize your profile. What can I help you with today?",
    'ai.find_jobs': 'Find jobs for me',
    'ai.location_jobs': 'Jobs in my area',
    'ai.remote_jobs': 'Remote positions',
    'ai.salary_insights': 'Salary insights',
    'ai.type_message': 'Type your message...',
    'ai.search_jobs': 'search jobs',
    'ai.cv_review': 'cv review',
    'ai.company_match': 'company match',
  },
  
  de: {
    // Navigation
    'nav.browse_jobs': 'Jobs Durchsuchen',
    'nav.swipe_discovery': 'Swipe Entdeckung',
    'nav.upload_cv': 'Lebenslauf Hochladen',
    'nav.companies': 'Unternehmen',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
    'nav.sign_in': 'Anmelden',
    'nav.sign_up': 'Loslegen',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.loading': 'Lädt...',
    'common.email': 'E-Mail',
    'common.password': 'Passwort',
    'common.location': 'Standort',
    'common.experience': 'Erfahrung',
    'common.skills': 'Fähigkeiten',
    'common.salary': 'Gehalt',
    
    // Hero Section
    'hero.title': 'Finden Sie Ihren Perfekten Job in der Schweiz',
    'hero.subtitle': 'KI-gestütztes Job-Matching, das die Schweizer Arbeitskultur versteht, Sie mit Top-Arbeitgebern verbindet und Ihr Karrierewachstum beschleunigt.',
    'hero.cta_primary': 'Jobsuche Starten',
    'hero.cta_secondary': 'Lebenslauf Hochladen',
    
    // Profile Settings
    'profile.title': 'Profil Einstellungen',
    'profile.subtitle': 'Verwalten Sie Ihre Kontoeinstellungen und Präferenzen',
    'profile.personal_info': 'Persönliche Informationen',
    'profile.professional_info': 'Berufliche Informationen',
    'profile.preferences': 'Einstellungen',
    'profile.privacy': 'Datenschutz-Einstellungen',
    'profile.account': 'Konto-Einstellungen',
    'profile.first_name': 'Vorname',
    'profile.last_name': 'Nachname',
    'profile.phone': 'Telefon',
    'profile.bio': 'Biografie',
    'profile.job_title': 'Berufsbezeichnung',
    'profile.save_changes': 'Änderungen Speichern',
    'profile.saving': 'Speichert...',
    
    // Dashboard
    'dashboard.welcome': 'Willkommen zurück',
    'dashboard.applications': 'Bewerbungen',
    'dashboard.matches': 'Übereinstimmungen',
    'dashboard.messages': 'Nachrichten',
    'dashboard.profile_views': 'Profil-Aufrufe',
    
    // Notifications
    'notifications.title': 'Benachrichtigungen',
    'notifications.all': 'Alle',
    'notifications.unread': 'Ungelesen',
    'notifications.jobs': 'Jobs',
    'notifications.mark_all_read': 'Alle als gelesen markieren',
    'notifications.no_notifications': 'Keine Benachrichtigungen',
    'notifications.caught_up': 'Sie sind auf dem neuesten Stand! Schauen Sie später wieder vorbei.',
    
    // AI Score
    'ai_score.title': 'KI-Übereinstimmungsanalyse',
    'ai_score.subtitle': 'Tiefer Einblick in Ihre Profilkompatibilität mit detaillierter Fähigkeitsanalyse und Markteinblicken',
    'ai_score.analyzing': 'Analysiere Ihr Profil',
    'ai_score.computing': 'Unsere KI berechnet detaillierte Skill-Matches und Markteinblicke...',
    'ai_score.overall_match': 'Gesamt-Übereinstimmung',
    'ai_score.skill_match': 'Skill-Übereinstimmung',
    'ai_score.market_fit': 'Markt-Passung',
    'ai_score.salary_potential': 'Gehaltspotential',
  },
  
  fr: {
    // Navigation
    'nav.browse_jobs': 'Parcourir les Emplois',
    'nav.swipe_discovery': 'Découverte Swipe',
    'nav.upload_cv': 'Télécharger CV',
    'nav.companies': 'Entreprises',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.sign_in': 'Se Connecter',
    'nav.sign_up': 'Commencer',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.loading': 'Chargement...',
    'common.email': 'E-mail',
    'common.password': 'Mot de passe',
    'common.location': 'Lieu',
    'common.experience': 'Expérience',
    'common.skills': 'Compétences',
    'common.salary': 'Salaire',
    
    // Hero Section
    'hero.title': 'Trouvez Votre Emploi Parfait en Suisse',
    'hero.subtitle': "Matching d'emploi alimenté par l'IA qui comprend la culture du travail suisse, vous connecte avec les meilleurs employeurs et accélère votre croissance de carrière.",
    'hero.cta_primary': 'Commencer la Recherche',
    'hero.cta_secondary': 'Télécharger Votre CV',
    
    // Profile Settings
    'profile.title': 'Paramètres du Profil',
    'profile.subtitle': 'Gérez vos paramètres de compte et préférences',
    'profile.personal_info': 'Informations Personnelles',
    'profile.professional_info': 'Informations Professionnelles',
    'profile.preferences': 'Préférences',
    'profile.privacy': 'Paramètres de Confidentialité',
    'profile.account': 'Paramètres du Compte',
    'profile.first_name': 'Prénom',
    'profile.last_name': 'Nom de famille',
    'profile.phone': 'Téléphone',
    'profile.bio': 'Biographie',
    'profile.job_title': 'Titre du Poste',
    'profile.save_changes': 'Enregistrer les Modifications',
    'profile.saving': 'Enregistrement...',
    
    // Dashboard
    'dashboard.welcome': 'Bon retour',
    'dashboard.applications': 'Candidatures',
    'dashboard.matches': 'Correspondances',
    'dashboard.messages': 'Messages',
    'dashboard.profile_views': 'Vues du Profil',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.all': 'Toutes',
    'notifications.unread': 'Non lues',
    'notifications.jobs': 'Emplois',
    'notifications.mark_all_read': 'Marquer toutes comme lues',
    'notifications.no_notifications': 'Aucune notification',
    'notifications.caught_up': 'Vous êtes à jour ! Revenez plus tard pour les mises à jour.',
    
    // AI Score
    'ai_score.title': "Analyse de Correspondance IA",
    'ai_score.subtitle': 'Plongée profonde dans votre compatibilité de profil avec une analyse détaillée des compétences et des insights du marché',
    'ai_score.analyzing': 'Analyse de Votre Profil',
    'ai_score.computing': 'Notre IA calcule les correspondances de compétences détaillées et les insights du marché...',
    'ai_score.overall_match': 'Correspondance Globale',
    'ai_score.skill_match': 'Correspondance des Compétences',
    'ai_score.market_fit': 'Adéquation au Marché',
    'ai_score.salary_potential': 'Potentiel Salarial',
  },
  
  it: {
    // Navigation
    'nav.browse_jobs': 'Sfoglia Lavori',
    'nav.swipe_discovery': 'Scoperta Swipe',
    'nav.upload_cv': 'Carica CV',
    'nav.companies': 'Aziende',
    'nav.about': 'Chi Siamo',
    'nav.contact': 'Contatto',
    'nav.sign_in': 'Accedi',
    'nav.sign_up': 'Inizia',
    
    // Common
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.edit': 'Modifica',
    'common.delete': 'Elimina',
    'common.loading': 'Caricamento...',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.location': 'Posizione',
    'common.experience': 'Esperienza',
    'common.skills': 'Competenze',
    'common.salary': 'Stipendio',
    
    // Hero Section
    'hero.title': 'Trova il Tuo Lavoro Perfetto in Svizzera',
    'hero.subtitle': 'Matching lavorativo alimentato da IA che comprende la cultura del lavoro svizzera, ti connette con i migliori datori di lavoro e accelera la tua crescita professionale.',
    'hero.cta_primary': 'Inizia Ricerca Lavoro',
    'hero.cta_secondary': 'Carica il Tuo CV',
    
    // Profile Settings
    'profile.title': 'Impostazioni Profilo',
    'profile.subtitle': 'Gestisci le impostazioni del tuo account e le preferenze',
    'profile.personal_info': 'Informazioni Personali',
    'profile.professional_info': 'Informazioni Professionali',
    'profile.preferences': 'Preferenze',
    'profile.privacy': 'Impostazioni Privacy',
    'profile.account': 'Impostazioni Account',
    'profile.first_name': 'Nome',
    'profile.last_name': 'Cognome',
    'profile.phone': 'Telefono',
    'profile.bio': 'Biografia',
    'profile.job_title': 'Titolo Lavoro',
    'profile.save_changes': 'Salva Modifiche',
    'profile.saving': 'Salvando...',
    
    // Dashboard
    'dashboard.welcome': 'Bentornato',
    'dashboard.applications': 'Candidature',
    'dashboard.matches': 'Corrispondenze',
    'dashboard.messages': 'Messaggi',
    'dashboard.profile_views': 'Visualizzazioni Profilo',
    
    // Notifications
    'notifications.title': 'Notifiche',
    'notifications.all': 'Tutte',
    'notifications.unread': 'Non lette',
    'notifications.jobs': 'Lavori',
    'notifications.mark_all_read': 'Segna tutte come lette',
    'notifications.no_notifications': 'Nessuna notifica',
    'notifications.caught_up': 'Sei aggiornato! Controlla più tardi per gli aggiornamenti.',
    
    // AI Score
    'ai_score.title': 'Analisi Corrispondenza IA',
    'ai_score.subtitle': 'Immersione profonda nella compatibilità del tuo profilo con analisi dettagliata delle competenze e approfondimenti di mercato',
    'ai_score.analyzing': 'Analizzando il Tuo Profilo',
    'ai_score.computing': 'La nostra IA sta calcolando corrispondenze dettagliate delle competenze e approfondimenti di mercato...',
    'ai_score.overall_match': 'Corrispondenza Complessiva',
    'ai_score.skill_match': 'Corrispondenza Competenze',
    'ai_score.market_fit': 'Adattamento al Mercato',
    'ai_score.salary_potential': 'Potenziale Salariale',
  },
  
  rm: {
    // Navigation (Romansh - simplified translations)
    'nav.browse_jobs': 'Tschertgar Plazzas',
    'nav.swipe_discovery': 'Swipe Scuverta',
    'nav.upload_cv': 'Chargar CV',
    'nav.companies': 'Interprendas',
    'nav.about': 'Davart Nus',
    'nav.contact': 'Contact',
    'nav.sign_in': 'Sa Connectar',
    'nav.sign_up': 'Cumenzar',
    
    // Common
    'common.save': 'Memorisar',
    'common.cancel': 'Interrumper',
    'common.edit': 'Modifitgar',
    'common.delete': 'Stizzar',
    'common.loading': 'Chargiar...',
    'common.email': 'E-mail',
    'common.password': 'Pled-clav',
    'common.location': 'Lieu',
    'common.experience': 'Experientscha',
    'common.skills': 'Cumpetenzas',
    'common.salary': 'Salari',
    
    // Hero Section
    'hero.title': 'Chattar Vossa Plazza Perfecta en Svizra',
    'hero.subtitle': 'Matching da plazzas cun IA che chapescha la cultura da lavur svizra, connectescha cun ils megliers patrons e accelerescha vossa creschen da carriera.',
    'hero.cta_primary': 'Cumenzar Tschertga',
    'hero.cta_secondary': 'Chargar Voss CV',
    
    // Profile Settings
    'profile.title': 'Configuraziuns dal Profil',
    'profile.subtitle': 'Administrar vossas configuraziuns da conto e preferenzas',
    'profile.personal_info': 'Infurmaziuns Persunalas',
    'profile.professional_info': 'Infurmaziuns Professiunalas',
    'profile.preferences': 'Preferenzas',
    'profile.privacy': 'Configuraziuns da Privacy',
    'profile.account': 'Configuraziuns dal Conto',
    'profile.first_name': 'Prenum',
    'profile.last_name': 'Num da famiglia',
    'profile.phone': 'Telefon',
    'profile.bio': 'Biografia',
    'profile.job_title': 'Titel da la Plazza',
    'profile.save_changes': 'Memorisar Midadas',
    'profile.saving': 'Memorisand...',
    
    // Dashboard
    'dashboard.welcome': 'Bainvegni enavos',
    'dashboard.applications': 'Candidaturas',
    'dashboard.matches': 'Correspundenzas',
    'dashboard.messages': 'Messadis',
    'dashboard.profile_views': 'Vistas dal Profil',
    
    // Notifications
    'notifications.title': 'Avis',
    'notifications.all': 'Tuts',
    'notifications.unread': 'Betg legids',
    'notifications.jobs': 'Plazzas',
    'notifications.mark_all_read': 'Marcar tuts sco legids',
    'notifications.no_notifications': 'Nagins avis',
    'notifications.caught_up': 'Vus essas actual! Controlai pli tard per actualisaziuns.',
    
    // AI Score
    'ai_score.title': 'Analisa da Correspundenza IA',
    'ai_score.subtitle': 'Immersion profunda en vossa cumpatibladad dal profil cun analisa detagliada da cumpetenzas e perspectivas da martgà',
    'ai_score.analyzing': 'Analisond Voss Profil',
    'ai_score.computing': 'Nossa IA calculescha correspundenzas detagliadas da cumpetenzas e perspectivas da martgà...',
    'ai_score.overall_match': 'Correspundenza Generala',
    'ai_score.skill_match': 'Correspundenza Cumpetenzas',
    'ai_score.market_fit': 'Adattaziun al Martgà',
    'ai_score.salary_potential': 'Potenzial dal Salari',
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const savedLang = localStorage.getItem('jobequal-language');
    if (savedLang) {
      const found = languages.find(lang => lang.code === savedLang);
      if (found) return found;
    }
    
    // Default to browser language if supported
    const browserLang = navigator.language.split('-')[0];
    const browserLanguage = languages.find(lang => lang.code === browserLang);
    return browserLanguage || languages[0]; // Default to English
  });

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('jobequal-language', language.code);
    // Update document lang attribute for accessibility
    document.documentElement.lang = language.code;
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage.code as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || key;
  };

  // Set initial document language
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage.code]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
