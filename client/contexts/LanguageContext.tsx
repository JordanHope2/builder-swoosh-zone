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

    // Swipe Discovery
    'swipe.smart_discovery': 'Smart Discovery',
    'swipe.title_main': 'Swipe Your Way',
    'swipe.title_sub': 'to Your Dream Job',
    'swipe.subtitle': 'Discover personalized job matches with our intuitive swipe interface.',
    'swipe.swipe_left': 'Swipe Left',
    'swipe.swipe_right': 'Swipe Right',
    'swipe.undo': 'Undo',
    'swipe.not_interested': 'Not interested',
    'swipe.interested': 'Apply instantly!',
    'swipe.changed_mind': 'Changed your mind?',
    'swipe.advanced_search_text': 'Want to see more detailed search options?',
    'swipe.advanced_search_cta': 'Advanced Job Search →',

    // Swipe Job Discovery
    'swipe_job.great_job_exploring': 'Great Job Exploring!',
    'swipe_job.reviewed_all_positions': "You've reviewed all available positions. Check your applications and saved jobs.",
    'swipe_job.view_saved_jobs': 'View Saved Jobs',
    'swipe_job.advanced_search': 'Advanced Search',
    'swipe_job.match': 'Match',
    'swipe_job.featured': 'Featured',
    'swipe_job.why_great_match': "Why You're a Great Match",
    'swipe_job.job_description': 'Job Description',
    'swipe_job.requirements': 'Requirements',
    'swipe_job.benefits': 'Benefits',
    'swipe_job.show_more_details': 'Show More Details',
    'swipe_job.show_less': 'Show Less',
    'swipe_job.apply': 'APPLY',
    'swipe_job.pass': 'PASS',
    'swipe_job.job_of': 'Job {current} of {total}',
    'swipe_job.complete': '{percent}% Complete',

    // Hero Section
    'hero.advanced_upload_page': 'Or use our advanced upload page',
    'hero.uploading': 'Uploading... {percent}%',

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
    'ai.ask_anything': 'Ask me anything about jobs!',
    'ai.ask_placeholder': 'Ask me anything about jobs...',
    'ai.find_jobs_for_me': 'Find jobs for me',
    'ai.jobs_in_zurich': 'Jobs in Zurich',
    'ai.remote_positions': 'Remote positions',
    'ai.help_find_job': "I'm here to help you find the perfect job! I can help you:\n\n• Search for specific roles\n• Find jobs by location\n• Get salary insights\n• Match you with companies\n• Optimize your profile\n\nWhat would you like to do?",
    'ai.find_jobs_response': "I'd be happy to help you find jobs! What type of role are you looking for? You can say something like 'Software Engineer' or 'Marketing Manager'.",
    'ai.zurich_jobs_response': "Here are some great opportunities in Zurich:\n\n🚀 Software Engineer at Google Zurich - CHF 120k-140k\n🏦 UBS Investment Banking - CHF 110k-150k\n📊 Credit Suisse Risk Analyst - CHF 95k-120k\n\nWould you like me to help you apply to any of these?",
    'ai.remote_jobs_response': "Here are excellent remote opportunities from Swiss companies:\n\n🏠 Remote Frontend Developer - Migros Digital - CHF 100k-120k\n📱 Flutter Developer - SBB - CHF 95k-115k\n📈 Product Manager - Swisscom - CHF 110k-130k\n\nSwiss companies are embracing remote work more than ever. Should I help you apply to any of these?",
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
    
    // Swipe Discovery
    'swipe.smart_discovery': 'Intelligente Entdeckung',
    'swipe.title_main': 'Swipen Sie sich',
    'swipe.title_sub': 'zu Ihrem Traumjob',
    'swipe.subtitle': 'Entdecken Sie personalisierte Job-Matches mit unserem intuitiven Swipe-Interface.',
    'swipe.swipe_left': 'Nach Links Swipen',
    'swipe.swipe_right': 'Nach Rechts Swipen',
    'swipe.undo': 'Rückgängig',
    'swipe.not_interested': 'Nicht interessiert',
    'swipe.interested': 'Sofort bewerben!',
    'swipe.changed_mind': 'Haben Sie sich umentschieden?',
    'swipe.advanced_search_text': 'Möchten Sie detailliertere Suchoptionen sehen?',
    'swipe.advanced_search_cta': 'Erweiterte Jobsuche →',

    // Swipe Job Discovery
    'swipe_job.great_job_exploring': 'Tolle Arbeit beim Erkunden!',
    'swipe_job.reviewed_all_positions': 'Sie haben alle verfügbaren Positionen überprüft. Überprüfen Sie Ihre Bewerbungen und gespeicherten Jobs.',
    'swipe_job.view_saved_jobs': 'Gespeicherte Jobs Anzeigen',
    'swipe_job.advanced_search': 'Erweiterte Suche',
    'swipe_job.match': 'Übereinstimmung',
    'swipe_job.featured': 'Hervorgehoben',
    'swipe_job.why_great_match': 'Warum Sie Eine Tolle Übereinstimmung Sind',
    'swipe_job.job_description': 'Stellenbeschreibung',
    'swipe_job.requirements': 'Anforderungen',
    'swipe_job.benefits': 'Vorteile',
    'swipe_job.show_more_details': 'Mehr Details Anzeigen',
    'swipe_job.show_less': 'Weniger Anzeigen',
    'swipe_job.apply': 'BEWERBEN',
    'swipe_job.pass': 'ABLEHNEN',
    'swipe_job.job_of': 'Job {current} von {total}',
    'swipe_job.complete': '{percent}% Abgeschlossen',

    // Hero Section
    'hero.advanced_upload_page': 'Oder nutzen Sie unsere erweiterte Upload-Seite',
    'hero.uploading': 'Hochladen... {percent}%',

    // AI Chatbot
    'ai.ask_anything': 'Fragen Sie mich alles über Jobs!',
    'ai.ask_placeholder': 'Fragen Sie mich alles über Jobs...',
    'ai.find_jobs_for_me': 'Finde Jobs für mich',
    'ai.jobs_in_zurich': 'Jobs in Zürich',
    'ai.remote_positions': 'Remote-Positionen',
    'ai.help_find_job': 'Ich bin hier, um Ihnen dabei zu helfen, den perfekten Job zu finden! Ich kann Ihnen helfen:\n\n• Nach bestimmten Rollen suchen\n• Jobs nach Standort finden\n• Gehaltseinblicke erhalten\n• Sie mit Unternehmen zusammenbringen\n• Ihr Profil optimieren\n\nWas möchten Sie tun?',
    'ai.find_jobs_response': 'Ich helfe Ihnen gerne beim Finden von Jobs! Nach welcher Art von Stelle suchen Sie? Sie können etwas wie "Software Engineer" oder "Marketing Manager" sagen.',
    'ai.zurich_jobs_response': 'Hier sind einige großartige Möglichkeiten in Zürich:\n\n🚀 Software Engineer bei Google Zürich - CHF 120k-140k\n🏦 UBS Investment Banking - CHF 110k-150k\n📊 Credit Suisse Risikoanalyst - CHF 95k-120k\n\nSoll ich Ihnen bei der Bewerbung für eine davon helfen?',
    'ai.remote_jobs_response': 'Hier sind ausgezeichnete Remote-Möglichkeiten von Schweizer Unternehmen:\n\n🏠 Remote Frontend Developer - Migros Digital - CHF 100k-120k\n📱 Flutter Developer - SBB - CHF 95k-115k\n📈 Product Manager - Swisscom - CHF 110k-130k\n\nSchweizer Unternehmen akzeptieren Remote-Arbeit mehr denn je. Soll ich Ihnen bei der Bewerbung helfen?',

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
    
    // Swipe Discovery
    'swipe.smart_discovery': 'Découverte Intelligente',
    'swipe.title_main': 'Swipez vers',
    'swipe.title_sub': 'votre Emploi de Rêve',
    'swipe.subtitle': 'Découvrez des correspondances d\'emploi personnalisées avec notre interface de swipe intuitive.',
    'swipe.swipe_left': 'Swiper à Gauche',
    'swipe.swipe_right': 'Swiper à Droite',
    'swipe.undo': 'Annuler',
    'swipe.not_interested': 'Pas intéressé',
    'swipe.interested': 'Postuler instantanément!',
    'swipe.changed_mind': 'Vous avez changé d\'avis?',
    'swipe.advanced_search_text': 'Voulez-vous voir des options de recherche plus détaillées?',
    'swipe.advanced_search_cta': 'Recherche Avancée d\'Emploi →',

    // Swipe Job Discovery
    'swipe_job.great_job_exploring': 'Excellent Travail d\'Exploration!',
    'swipe_job.reviewed_all_positions': 'Vous avez examiné toutes les positions disponibles. Vérifiez vos candidatures et emplois sauvegardés.',
    'swipe_job.view_saved_jobs': 'Voir les Emplois Sauvegardés',
    'swipe_job.advanced_search': 'Recherche Avancée',
    'swipe_job.match': 'Correspondance',
    'swipe_job.featured': 'En Vedette',
    'swipe_job.why_great_match': 'Pourquoi Vous Êtes Une Excellente Correspondance',
    'swipe_job.job_description': 'Description du Poste',
    'swipe_job.requirements': 'Exigences',
    'swipe_job.benefits': 'Avantages',
    'swipe_job.show_more_details': 'Afficher Plus de Détails',
    'swipe_job.show_less': 'Afficher Moins',
    'swipe_job.apply': 'POSTULER',
    'swipe_job.pass': 'PASSER',
    'swipe_job.job_of': 'Emploi {current} sur {total}',
    'swipe_job.complete': '{percent}% Terminé',

    // Hero Section
    'hero.advanced_upload_page': 'Ou utilisez notre page de téléchargement avancée',
    'hero.uploading': 'Téléchargement... {percent}%',

    // AI Chatbot
    'ai.ask_anything': 'Demandez-moi tout sur les emplois!',
    'ai.ask_placeholder': 'Demandez-moi tout sur les emplois...',
    'ai.find_jobs_for_me': 'Trouvez des emplois pour moi',
    'ai.jobs_in_zurich': 'Emplois à Zurich',
    'ai.remote_positions': 'Postes à distance',
    'ai.help_find_job': 'Je suis là pour vous aider à trouver l\'emploi parfait! Je peux vous aider:\n\n• Rechercher des rôles spécifiques\n• Trouver des emplois par lieu\n• Obtenir des informations sur les salaires\n• Vous mettre en relation avec des entreprises\n• Optimiser votre profil\n\nQue souhaitez-vous faire?',
    'ai.find_jobs_response': 'Je serais ravi de vous aider à trouver des emplois! Quel type de rôle recherchez-vous? Vous pouvez dire quelque chose comme "Ingénieur Logiciel" ou "Responsable Marketing".',
    'ai.zurich_jobs_response': 'Voici quelques excellentes opportunités à Zurich:\n\n🚀 Ingénieur Logiciel chez Google Zurich - CHF 120k-140k\n🏦 UBS Banque d\'Investissement - CHF 110k-150k\n📊 Analyste des Risques Credit Suisse - CHF 95k-120k\n\nVoulez-vous que je vous aide à postuler pour l\'une d\'entre elles?',
    'ai.remote_jobs_response': 'Voici d\'excellentes opportunités à distance dans des entreprises suisses:\n\n🏠 Développeur Frontend à Distance - Migros Digital - CHF 100k-120k\n📱 Développeur Flutter - CFF - CHF 95k-115k\n📈 Chef de Produit - Swisscom - CHF 110k-130k\n\nLes entreprises suisses adoptent le travail à distance plus que jamais. Dois-je vous aider à postuler?',

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
    
    // Swipe Discovery
    'swipe.smart_discovery': 'Scoperta Intelligente',
    'swipe.title_main': 'Swipa verso',
    'swipe.title_sub': 'il tuo Lavoro dei Sogni',
    'swipe.subtitle': 'Scopri corrispondenze di lavoro personalizzate con la nostra interfaccia swipe intuitiva.',
    'swipe.swipe_left': 'Swipa a Sinistra',
    'swipe.swipe_right': 'Swipa a Destra',
    'swipe.undo': 'Annulla',
    'swipe.not_interested': 'Non interessato',
    'swipe.interested': 'Candidati subito!',
    'swipe.changed_mind': 'Hai cambiato idea?',
    'swipe.advanced_search_text': 'Vuoi vedere opzioni di ricerca più dettagliate?',
    'swipe.advanced_search_cta': 'Ricerca Lavoro Avanzata →',

    // Swipe Job Discovery
    'swipe_job.great_job_exploring': 'Ottimo Lavoro di Esplorazione!',
    'swipe_job.reviewed_all_positions': 'Hai esaminato tutte le posizioni disponibili. Controlla le tue candidature e i lavori salvati.',
    'swipe_job.view_saved_jobs': 'Visualizza Lavori Salvati',
    'swipe_job.advanced_search': 'Ricerca Avanzata',
    'swipe_job.match': 'Corrispondenza',
    'swipe_job.featured': 'In Evidenza',
    'swipe_job.why_great_match': 'Perché Sei Una Grande Corrispondenza',
    'swipe_job.job_description': 'Descrizione del Lavoro',
    'swipe_job.requirements': 'Requisiti',
    'swipe_job.benefits': 'Benefici',
    'swipe_job.show_more_details': 'Mostra Più Dettagli',
    'swipe_job.show_less': 'Mostra Meno',
    'swipe_job.apply': 'CANDIDATI',
    'swipe_job.pass': 'SALTA',
    'swipe_job.job_of': 'Lavoro {current} di {total}',
    'swipe_job.complete': '{percent}% Completato',

    // Hero Section
    'hero.advanced_upload_page': 'O usa la nostra pagina di caricamento avanzata',
    'hero.uploading': 'Caricamento... {percent}%',

    // AI Chatbot
    'ai.ask_anything': 'Chiedimi qualsiasi cosa sui lavori!',
    'ai.ask_placeholder': 'Chiedimi qualsiasi cosa sui lavori...',
    'ai.find_jobs_for_me': 'Trova lavori per me',
    'ai.jobs_in_zurich': 'Lavori a Zurigo',
    'ai.remote_positions': 'Posizioni remote',
    'ai.help_find_job': 'Sono qui per aiutarti a trovare il lavoro perfetto! Posso aiutarti:\n\n• Cercare ruoli specifici\n• Trovare lavori per località\n• Ottenere informazioni sui salari\n• Abbinarti con aziende\n• Ottimizzare il tuo profilo\n\nCosa vorresti fare?',
    'ai.find_jobs_response': 'Sarei felice di aiutarti a trovare lavori! Che tipo di ruolo stai cercando? Puoi dire qualcosa come "Ingegnere del Software" o "Manager Marketing".',
    'ai.zurich_jobs_response': 'Ecco alcune ottime opportunità a Zurigo:\n\n🚀 Ingegnere del Software presso Google Zurich - CHF 120k-140k\n🏦 UBS Investment Banking - CHF 110k-150k\n📊 Analista del Rischio Credit Suisse - CHF 95k-120k\n\nVuoi che ti aiuti a candidarti per qualcuna di queste?',
    'ai.remote_jobs_response': 'Ecco eccellenti opportunità remote da aziende svizzere:\n\n🏠 Sviluppatore Frontend Remoto - Migros Digital - CHF 100k-120k\n📱 Sviluppatore Flutter - FFS - CHF 95k-115k\n📈 Product Manager - Swisscom - CHF 110k-130k\n\nLe aziende svizzere stanno abbracciando il lavoro remoto più che mai. Dovrei aiutarti a candidarti?',

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
    
    // Swipe Discovery
    'swipe.smart_discovery': 'Scuverta Intelligenta',
    'swipe.title_main': 'Swipe vers',
    'swipe.title_sub': 'vossa Plazza da Siemi',
    'swipe.subtitle': 'Scuvrir correspundenzas da plazzas personalisadas cun nossa interfatscha swipe intuitiva.',
    'swipe.swipe_left': 'Swipe a Schnestra',
    'swipe.swipe_right': 'Swipe a Dretga',
    'swipe.undo': 'Interrumper',
    'swipe.not_interested': 'Betg interessà',
    'swipe.interested': 'Sa candidar directamain!',
    'swipe.changed_mind': 'Avais midà idea?',
    'swipe.advanced_search_text': 'Vulais vesair opziuns da tschertga pli detagliadas?',
    'swipe.advanced_search_cta': 'Tschertga Avanzada da Plazzas →',

    // Swipe Job Discovery
    'swipe_job.great_job_exploring': 'Grond Lavur da Exploraziun!',
    'swipe_job.reviewed_all_positions': 'Vus avais controllà tut las posiziuns disponiblas. Controllai vossas candidaturas e plazzas memorisadas.',
    'swipe_job.view_saved_jobs': 'Vesair Plazzas Memorisadas',
    'swipe_job.advanced_search': 'Tschertga Avanzada',
    'swipe_job.match': 'Correspundenza',
    'swipe_job.featured': 'En Emprima Lingia',
    'swipe_job.why_great_match': 'Pertge Essas Vus Ina Gronda Correspundenza',
    'swipe_job.job_description': 'Descripziun da la Plazza',
    'swipe_job.requirements': 'Pretensiuns',
    'swipe_job.benefits': 'Avantatgs',
    'swipe_job.show_more_details': 'Mussar Dapli Detagls',
    'swipe_job.show_less': 'Mussar Pli Pauc',
    'swipe_job.apply': 'SA CANDIDAR',
    'swipe_job.pass': 'SURSIGLIR',
    'swipe_job.job_of': 'Plazza {current} da {total}',
    'swipe_job.complete': '{percent}% Cumplettà',

    // Hero Section
    'hero.advanced_upload_page': 'U duvrai nossa pagina da chargiada avanzada',
    'hero.uploading': 'Chargiar... {percent}%',

    // AI Chatbot
    'ai.ask_anything': 'Dumai mai tut davart plazzas!',
    'ai.ask_placeholder': 'Dumai mai tut davart plazzas...',
    'ai.find_jobs_for_me': 'Chattar plazzas per mai',
    'ai.jobs_in_zurich': 'Plazzas a Turitg',
    'ai.remote_positions': 'Posiziuns a distanza',
    'ai.help_find_job': 'Jau sun qua per gidar a vus da chattar la plazza perfecta! Jau pos gidar a vus:\n\n• Tschertgar rols specifics\n• Chattar plazzas tenor lieu\n• Survegnir infurmaziuns davart salaris\n• Connectar cun interprendas\n• Optimisar voss profil\n\nTge vulais vus far?',
    'ai.find_jobs_response': 'Jau fiss cuntents da gidar a vus da chattar plazzas! Che tips da rol tschertgais vus? Vus pudais dir insatge sco "Ingenieur da Software" u "Manager da Marketing".',
    'ai.zurich_jobs_response': 'Qua èn tschertas grondas pussaivladads a Turitg:\n\n🚀 Ingenieur da Software tar Google Zurich - CHF 120k-140k\n🏦 UBS Investment Banking - CHF 110k-150k\n📊 Analist da Ristg Credit Suisse - CHF 95k-120k\n\nVulais che jau gid a vus da sa candidar per ina da quellas?',
    'ai.remote_jobs_response': 'Qua èn excellentas pussaivladads a distanza dad interprendas svizras:\n\n🏠 Sviluppader Frontend a Distanza - Migros Digital - CHF 100k-120k\n📱 Sviluppader Flutter - VFF - CHF 95k-115k\n📈 Manager da Product - Swisscom - CHF 110k-130k\n\nInterprendas svizras acceptan lavur a distanza dapli che mai avant. Duai jau gidar a vus da sa candidar?',

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
