/**
 * Internationalization (i18n) Translations
 * Supported languages: English (EN), German (DE), Turkish (TR)
 */

export type Language = 'en' | 'de' | 'tr'

export interface Translations {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    submit: string
    close: string
    back: string
    next: string
    yes: string
    no: string
    search: string
    searchPlaceholder: string
    noResults: string
    characters: string
    primary: string
    new: string
    active: string
    unanswered: string
    top: string
    filterBy: string
    ago: string
    justNow: string
    minutes: string
    hours: string
    days: string
  }
  
  // Navigation
  nav: {
    home: string
    feed: string
    profile: string
    login: string
    register: string
    logout: string
    admin: string
    backToFeed: string
  }
  
  // Auth
  auth: {
    email: string
    password: string
    confirmPassword: string
    name: string
    fullName: string
    university: string
    dateOfBirth: string
    forgotPassword: string
    resetPassword: string
    createAccount: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    loginTitle: string
    registerTitle: string
    verifyEmail: string
    verificationCode: string
    resendCode: string
    passwordRequirements: string
    universityEmail: string
    sendResetCode: string
    sending: string
    backToLogin: string
    newPassword: string
    confirmNewPassword: string
    resetSuccessTitle: string
    resetSuccessDesc: string
    goToLogin: string
  }
  
  // Feed
  feed: {
    title: string
    askQuestion: string
    newPost: string
    noPostsYet: string
    beFirstToAsk: string
    replies: string
    votes: string
    postedBy: string
    deletedAccount: string
    loadingUni: string
    settingUp: string
    shareKnowledge: string
  }
  
  // Post
  post: {
    title: string
    body: string
    description: string
    tags: string
    tagsPlaceholder: string
    attachments: string
    copyLink: string
    linkCopied: string
    writeReply: string
    postReply: string
    postQuestion: string
    noReplies: string
    beFirstToAnswer: string
    whatsYourQuestion: string
    provideDetails: string
    dropFiles: string
    supportsFiles: string
  }
  
  // Profile
  profile: {
    title: string
    manageAccount: string
    verificationStatus: string
    accountInfo: string
    preferences: string
    dangerZone: string
    displayHandle: string
    emailNotifications: string
    emailNotificationsDesc: string
    anonymousPosting: string
    anonymousPostingDesc: string
    deleteAccount: string
    deleteAccountWarning: string
    typeDeleteToConfirm: string
    addUniversity: string
    myUniversities: string
    pendingVerification: string
    pendingVerificationDesc: string
    viewVerificationStatus: string
    accountVerified: string
    accountVerifiedDesc: string
    notVerified: string
    notVerifiedDesc: string
    startVerification: string
    deleteForever: string
    deleting: string
    confirmDeletion: string
    confirmDeletionDesc: string
  }
  
  // Home
  home: {
    heroTitle: string
    heroSubtitle: string
    getStarted: string
    learnMore: string
    howItWorks: string
    whyBSP: string
    builtForStudents: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    openChannel: string
    feature1Title: string
    feature1Desc: string
    feature2Title: string
    feature2Desc: string
    feature3Title: string
    feature3Desc: string
    feature4Title: string
    feature4Desc: string
    ctaTitle: string
    ctaDesc: string
    getStartedNow: string
  }
  
  // Footer
  footer: {
    quickLinks: string
    legal: string
    termsOfService: string
    privacyPolicy: string
    communityGuidelines: string
    allRightsReserved: string
    connectingStudents: string
  }
  
  // Verification
  verification: {
    title: string
    pending: string
    approved: string
    rejected: string
    uploadSelfie: string
    uploadStudentCard: string
    submitVerification: string
    clickToUpload: string
    clickToChange: string
  }
  
  // Draft
  draft: {
    saved: string
    restore: string
    discard: string
    hasDraft: string
    cleared: string
  }
  
  // Errors
  errors: {
    somethingWentWrong: string
    invalidCredentials: string
    emailRequired: string
    passwordRequired: string
    passwordTooWeak: string
    emailNotVerified: string
    networkError: string
    failedToPost: string
    completeAllFields: string
  }
  
  // Success messages
  success: {
    accountCreated: string
    emailVerified: string
    passwordReset: string
    profileUpdated: string
    postCreated: string
    replyAdded: string
    handleUpdated: string
    accountDeleted: string
    linkCopied: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      yes: 'Yes',
      no: 'No',
      search: 'Search',
      searchPlaceholder: 'Search questions, tags...',
      noResults: 'No results found',
      characters: 'characters',
      primary: 'Primary',
      new: 'New',
      active: 'Active',
      unanswered: 'Unanswered',
      top: 'Top',
      filterBy: 'Filtering by',
      ago: 'ago',
      justNow: 'Just now',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days'
    },
    nav: {
      home: 'Home',
      feed: 'Feed',
      profile: 'Profile',
      login: 'Log in',
      register: 'Register',
      logout: 'Log out',
      admin: 'Admin Panel',
      backToFeed: 'Back to Feed'
    },
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      fullName: 'Full Name',
      university: 'University',
      dateOfBirth: 'Date of Birth',
      forgotPassword: 'Forgot password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      loginTitle: 'Welcome Back',
      registerTitle: 'Join Berlin Student Portal',
      verifyEmail: 'Verify Your Email',
      verificationCode: 'Verification Code',
      resendCode: 'Resend Code',
      passwordRequirements: 'Password must contain uppercase, lowercase, number, and special character',
      universityEmail: 'University Email',
      sendResetCode: 'Send Reset Code',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      resetSuccessTitle: 'Password Reset Successful!',
      resetSuccessDesc: 'You can now login with your new password',
      goToLogin: 'Go to Login'
    },
    feed: {
      title: 'University Feed',
      askQuestion: 'Ask a Question',
      newPost: 'New Post',
      noPostsYet: 'No Questions Yet',
      beFirstToAsk: 'Be the first to ask a question in your community!',
      replies: 'replies',
      votes: 'votes',
      postedBy: 'Posted by',
      deletedAccount: '[Deleted Account]',
      loadingUni: 'Loading Your University',
      settingUp: 'Setting up your university feed...',
      shareKnowledge: 'Ask questions and share knowledge with your peers'
    },
    post: {
      title: 'Title',
      body: 'Body',
      description: 'Description',
      tags: 'Tags',
      tagsPlaceholder: 'exams, study, help (comma-separated)',
      attachments: 'Attachments',
      copyLink: 'Copy Link',
      linkCopied: 'Link copied to clipboard!',
      writeReply: 'Your Reply',
      postReply: 'Post Reply',
      postQuestion: 'Post Question',
      noReplies: 'No replies yet.',
      beFirstToAnswer: 'Be the first to answer!',
      whatsYourQuestion: "What's your question?",
      provideDetails: 'Provide more details...',
      dropFiles: 'Drop files here or click to browse',
      supportsFiles: 'Supports PDF, Images, DOCX (max 10MB each)'
    },
    profile: {
      title: 'Profile',
      manageAccount: 'Manage your account and preferences',
      verificationStatus: 'Verification Status',
      accountInfo: 'Account Information',
      preferences: 'Preferences',
      dangerZone: 'Danger Zone',
      displayHandle: 'Display Handle (Anonymous)',
      emailNotifications: 'Email Notifications',
      emailNotificationsDesc: 'Receive updates about replies and mentions',
      anonymousPosting: 'Anonymous Posting',
      anonymousPostingDesc: 'Post questions anonymously by default',
      deleteAccount: 'Delete Account',
      deleteAccountWarning: 'Once you delete your account, there is no going back. Your posts and replies will remain with "[Deleted Account]" attribution.',
      typeDeleteToConfirm: 'Type "DELETE" to confirm',
      addUniversity: 'Add University',
      myUniversities: 'My Universities',
      pendingVerification: 'Pending Verification',
      pendingVerificationDesc: 'Your verification is being reviewed by our team. This usually takes 24-48 hours.',
      viewVerificationStatus: 'View Verification Status',
      accountVerified: 'Account Verified',
      accountVerifiedDesc: 'Your student identity has been verified. You have full access to all features.',
      notVerified: 'Not Verified',
      notVerifiedDesc: 'Complete your verification to access all features and join your university channel.',
      startVerification: 'Start Verification',
      deleteForever: 'Delete Forever',
      deleting: 'Deleting...',
      confirmDeletion: 'Confirm Account Deletion',
      confirmDeletionDesc: 'Are you absolutely sure you want to delete your account? This action cannot be undone.'
    },
    home: {
      heroTitle: 'Connect with Your University Community',
      heroSubtitle: 'Ask questions, share knowledge, and help fellow students succeed.',
      getStarted: 'Get started in three simple steps.',
      learnMore: 'Learn More',
      howItWorks: 'How It Works',
      whyBSP: 'Why Berlin Student Portal?',
      builtForStudents: 'Built for students, by students.',
      step1Title: 'Register & Verify',
      step1Desc: 'Create an account and verify your student status with your university email.',
      step2Title: 'Join Your Channel',
      step2Desc: "Access your university's exclusive Q&A channel.",
      step3Title: 'Ask & Answer',
      step3Desc: 'Post questions, share answers, and help your peers.',
      openChannel: 'Open Your Uni Channel',
      feature1Title: 'User Verification',
      feature1Desc: 'Every student is verified through their university email and student ID.',
      feature2Title: 'Anonymous Q&A',
      feature2Desc: 'Ask and answer questions anonymously within your university community.',
      feature3Title: 'File Support',
      feature3Desc: 'Attach PDFs, images, and documents to share resources with peers.',
      feature4Title: 'Minimal UI',
      feature4Desc: 'Clean, distraction-free interface focused on learning and collaboration.',
      ctaTitle: 'Ready to Join Your Community?',
      ctaDesc: 'Thousands of students are already asking questions, sharing knowledge, and growing together.',
      getStartedNow: 'Get Started Now'
    },
    footer: {
      quickLinks: 'Quick Links',
      legal: 'Legal',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      communityGuidelines: 'Community Guidelines',
      allRightsReserved: 'All rights reserved.',
      connectingStudents: 'Connecting Students, Empowering Learning.'
    },
    verification: {
      title: 'Student Verification',
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      uploadSelfie: 'Upload Selfie',
      uploadStudentCard: 'Upload Student Card',
      submitVerification: 'Submit Verification',
      clickToUpload: 'Click to upload',
      clickToChange: 'Click to change'
    },
    draft: {
      saved: 'Draft saved',
      restore: 'Draft restored',
      discard: 'Discard Draft',
      hasDraft: 'You have an unsaved draft',
      cleared: 'Draft cleared'
    },
    errors: {
      somethingWentWrong: 'Something went wrong. Please try again.',
      invalidCredentials: 'Invalid email or password.',
      emailRequired: 'Email is required.',
      passwordRequired: 'Password is required.',
      passwordTooWeak: 'Please choose a stronger password.',
      emailNotVerified: 'Please verify your email first.',
      networkError: 'Network error. Please check your connection.',
      failedToPost: 'Failed to post question. Please try again.',
      completeAllFields: 'Please complete all required fields.'
    },
    success: {
      accountCreated: 'Account created successfully!',
      emailVerified: 'Email verified successfully!',
      passwordReset: 'Password reset successfully!',
      profileUpdated: 'Profile updated successfully!',
      postCreated: 'Question posted successfully!',
      replyAdded: 'Reply added successfully!',
      handleUpdated: 'Display handle updated successfully!',
      accountDeleted: 'Your account has been deleted. A confirmation email has been sent.',
      linkCopied: 'Link copied to clipboard!'
    }
  },
  
  de: {
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      submit: 'Absenden',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      yes: 'Ja',
      no: 'Nein',
      search: 'Suchen',
      searchPlaceholder: 'Fragen, Tags suchen...',
      noResults: 'Keine Ergebnisse gefunden',
      characters: 'Zeichen',
      primary: 'Primär',
      new: 'Neu',
      active: 'Aktiv',
      unanswered: 'Unbeantwortet',
      top: 'Top',
      filterBy: 'Filtern nach',
      ago: 'vor',
      justNow: 'Gerade eben',
      minutes: 'Minuten',
      hours: 'Stunden',
      days: 'Tagen'
    },
    nav: {
      home: 'Startseite',
      feed: 'Feed',
      profile: 'Profil',
      login: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden',
      admin: 'Admin-Bereich',
      backToFeed: 'Zurück zum Feed'
    },
    auth: {
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      name: 'Name',
      fullName: 'Vollständiger Name',
      university: 'Universität',
      dateOfBirth: 'Geburtsdatum',
      forgotPassword: 'Passwort vergessen?',
      resetPassword: 'Passwort zurücksetzen',
      createAccount: 'Konto erstellen',
      alreadyHaveAccount: 'Bereits ein Konto?',
      dontHaveAccount: 'Noch kein Konto?',
      loginTitle: 'Willkommen zurück',
      registerTitle: 'Berlin Student Portal beitreten',
      verifyEmail: 'E-Mail verifizieren',
      verificationCode: 'Verifizierungscode',
      resendCode: 'Code erneut senden',
      passwordRequirements: 'Passwort muss Groß-, Kleinbuchstaben, Zahlen und Sonderzeichen enthalten',
      universityEmail: 'Universitäts-E-Mail',
      sendResetCode: 'Reset-Code senden',
      sending: 'Wird gesendet...',
      backToLogin: 'Zurück zum Login',
      newPassword: 'Neues Passwort',
      confirmNewPassword: 'Neues Passwort bestätigen',
      resetSuccessTitle: 'Passwort erfolgreich zurückgesetzt!',
      resetSuccessDesc: 'Sie können sich jetzt mit Ihrem neuen Passwort anmelden',
      goToLogin: 'Zum Login'
    },
    feed: {
      title: 'Universitäts-Feed',
      askQuestion: 'Frage stellen',
      newPost: 'Neuer Beitrag',
      noPostsYet: 'Noch keine Fragen',
      beFirstToAsk: 'Sei der Erste, der eine Frage in deiner Community stellt!',
      replies: 'Antworten',
      votes: 'Stimmen',
      postedBy: 'Gepostet von',
      deletedAccount: '[Gelöschtes Konto]',
      loadingUni: 'Lade deine Universität',
      settingUp: 'Richte deinen Universitäts-Feed ein...',
      shareKnowledge: 'Stelle Fragen und teile Wissen mit deinen Kommilitonen'
    },
    post: {
      title: 'Titel',
      body: 'Inhalt',
      description: 'Beschreibung',
      tags: 'Tags',
      tagsPlaceholder: 'Prüfungen, Lernen, Hilfe (kommagetrennt)',
      attachments: 'Anhänge',
      copyLink: 'Link kopieren',
      linkCopied: 'Link in die Zwischenablage kopiert!',
      writeReply: 'Deine Antwort',
      postReply: 'Antwort posten',
      postQuestion: 'Frage posten',
      noReplies: 'Noch keine Antworten.',
      beFirstToAnswer: 'Sei der Erste, der antwortet!',
      whatsYourQuestion: 'Was ist deine Frage?',
      provideDetails: 'Gib mehr Details an...',
      dropFiles: 'Dateien hier ablegen oder zum Durchsuchen klicken',
      supportsFiles: 'Unterstützt PDF, Bilder, DOCX (max. 10MB pro Datei)'
    },
    profile: {
      title: 'Profil',
      manageAccount: 'Verwalte dein Konto und Einstellungen',
      verificationStatus: 'Verifizierungsstatus',
      accountInfo: 'Kontoinformationen',
      preferences: 'Einstellungen',
      dangerZone: 'Gefahrenzone',
      displayHandle: 'Anzeigename (Anonym)',
      emailNotifications: 'E-Mail-Benachrichtigungen',
      emailNotificationsDesc: 'Erhalte Updates über Antworten und Erwähnungen',
      anonymousPosting: 'Anonymes Posten',
      anonymousPostingDesc: 'Fragen standardmäßig anonym posten',
      deleteAccount: 'Konto löschen',
      deleteAccountWarning: 'Sobald du dein Konto löschst, gibt es kein Zurück. Deine Beiträge bleiben mit "[Gelöschtes Konto]" erhalten.',
      typeDeleteToConfirm: 'Tippe "DELETE" zum Bestätigen',
      addUniversity: 'Universität hinzufügen',
      myUniversities: 'Meine Universitäten',
      pendingVerification: 'Verifizierung ausstehend',
      pendingVerificationDesc: 'Deine Verifizierung wird von unserem Team geprüft. Dies dauert normalerweise 24-48 Stunden.',
      viewVerificationStatus: 'Verifizierungsstatus anzeigen',
      accountVerified: 'Konto verifiziert',
      accountVerifiedDesc: 'Deine Studentenidentität wurde verifiziert. Du hast vollen Zugang zu allen Funktionen.',
      notVerified: 'Nicht verifiziert',
      notVerifiedDesc: 'Schließe deine Verifizierung ab, um auf alle Funktionen zuzugreifen.',
      startVerification: 'Verifizierung starten',
      deleteForever: 'Endgültig löschen',
      deleting: 'Wird gelöscht...',
      confirmDeletion: 'Kontolöschung bestätigen',
      confirmDeletionDesc: 'Bist du absolut sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.'
    },
    home: {
      heroTitle: 'Verbinde dich mit deiner Uni-Community',
      heroSubtitle: 'Stelle Fragen, teile Wissen und hilf Kommilitonen.',
      getStarted: 'Starte in drei einfachen Schritten.',
      learnMore: 'Mehr erfahren',
      howItWorks: 'So funktioniert es',
      whyBSP: 'Warum Berlin Student Portal?',
      builtForStudents: 'Von Studenten für Studenten gebaut.',
      step1Title: 'Registrieren & Verifizieren',
      step1Desc: 'Erstelle ein Konto und verifiziere deinen Studentenstatus mit deiner Uni-E-Mail.',
      step2Title: 'Kanal beitreten',
      step2Desc: 'Erhalte Zugang zum exklusiven Q&A-Kanal deiner Uni.',
      step3Title: 'Fragen & Antworten',
      step3Desc: 'Stelle Fragen, teile Antworten und hilf deinen Kommilitonen.',
      openChannel: 'Uni-Kanal öffnen',
      feature1Title: 'Benutzerverifizierung',
      feature1Desc: 'Jeder Student wird über seine Uni-E-Mail und seinen Studentenausweis verifiziert.',
      feature2Title: 'Anonyme Fragen',
      feature2Desc: 'Stelle und beantworte Fragen anonym in deiner Uni-Community.',
      feature3Title: 'Datei-Support',
      feature3Desc: 'Füge PDFs, Bilder und Dokumente hinzu, um Ressourcen zu teilen.',
      feature4Title: 'Minimales UI',
      feature4Desc: 'Klare, ablenkungsfreie Oberfläche für Lernen und Zusammenarbeit.',
      ctaTitle: 'Bereit, deiner Community beizutreten?',
      ctaDesc: 'Tausende Studenten stellen bereits Fragen, teilen Wissen und wachsen zusammen.',
      getStartedNow: 'Jetzt starten'
    },
    footer: {
      quickLinks: 'Schnelllinks',
      legal: 'Rechtliches',
      termsOfService: 'Nutzungsbedingungen',
      privacyPolicy: 'Datenschutz',
      communityGuidelines: 'Community-Richtlinien',
      allRightsReserved: 'Alle Rechte vorbehalten.',
      connectingStudents: 'Studenten verbinden, Lernen fördern.'
    },
    verification: {
      title: 'Studentenverifizierung',
      pending: 'In Prüfung',
      approved: 'Genehmigt',
      rejected: 'Abgelehnt',
      uploadSelfie: 'Selfie hochladen',
      uploadStudentCard: 'Studentenausweis hochladen',
      submitVerification: 'Verifizierung einreichen',
      clickToUpload: 'Zum Hochladen klicken',
      clickToChange: 'Zum Ändern klicken'
    },
    draft: {
      saved: 'Entwurf gespeichert',
      restore: 'Entwurf wiederhergestellt',
      discard: 'Entwurf verwerfen',
      hasDraft: 'Du hast einen ungespeicherten Entwurf',
      cleared: 'Entwurf gelöscht'
    },
    errors: {
      somethingWentWrong: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      invalidCredentials: 'Ungültige E-Mail oder Passwort.',
      emailRequired: 'E-Mail ist erforderlich.',
      passwordRequired: 'Passwort ist erforderlich.',
      passwordTooWeak: 'Bitte wähle ein stärkeres Passwort.',
      emailNotVerified: 'Bitte verifiziere zuerst deine E-Mail.',
      networkError: 'Netzwerkfehler. Bitte überprüfe deine Verbindung.',
      failedToPost: 'Frage konnte nicht gepostet werden. Bitte versuche es erneut.',
      completeAllFields: 'Bitte fülle alle erforderlichen Felder aus.'
    },
    success: {
      accountCreated: 'Konto erfolgreich erstellt!',
      emailVerified: 'E-Mail erfolgreich verifiziert!',
      passwordReset: 'Passwort erfolgreich zurückgesetzt!',
      profileUpdated: 'Profil erfolgreich aktualisiert!',
      postCreated: 'Frage erfolgreich gepostet!',
      replyAdded: 'Antwort erfolgreich hinzugefügt!',
      handleUpdated: 'Anzeigename erfolgreich aktualisiert!',
      accountDeleted: 'Dein Konto wurde gelöscht. Eine Bestätigungs-E-Mail wurde gesendet.',
      linkCopied: 'Link in die Zwischenablage kopiert!'
    }
  },
  
  tr: {
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      cancel: 'İptal',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      submit: 'Gönder',
      close: 'Kapat',
      back: 'Geri',
      next: 'İleri',
      yes: 'Evet',
      no: 'Hayır',
      search: 'Ara',
      searchPlaceholder: 'Soru, etiket ara...',
      noResults: 'Sonuç bulunamadı',
      characters: 'karakter',
      primary: 'Birincil',
      new: 'Yeni',
      active: 'Aktif',
      unanswered: 'Cevaplanmamış',
      top: 'En İyi',
      filterBy: 'Filtre',
      ago: 'önce',
      justNow: 'Az önce',
      minutes: 'dakika',
      hours: 'saat',
      days: 'gün'
    },
    nav: {
      home: 'Ana Sayfa',
      feed: 'Akış',
      profile: 'Profil',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      admin: 'Yönetici Paneli',
      backToFeed: 'Akışa Dön'
    },
    auth: {
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      name: 'İsim',
      fullName: 'Ad Soyad',
      university: 'Üniversite',
      dateOfBirth: 'Doğum Tarihi',
      forgotPassword: 'Şifremi unuttum',
      resetPassword: 'Şifre Sıfırla',
      createAccount: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      dontHaveAccount: 'Hesabınız yok mu?',
      loginTitle: 'Tekrar Hoş Geldiniz',
      registerTitle: 'Berlin Öğrenci Portalına Katılın',
      verifyEmail: 'E-postanızı Doğrulayın',
      verificationCode: 'Doğrulama Kodu',
      resendCode: 'Kodu Tekrar Gönder',
      passwordRequirements: 'Şifre büyük harf, küçük harf, rakam ve özel karakter içermelidir',
      universityEmail: 'Üniversite E-postası',
      sendResetCode: 'Sıfırlama Kodu Gönder',
      sending: 'Gönderiliyor...',
      backToLogin: 'Girişe Dön',
      newPassword: 'Yeni Şifre',
      confirmNewPassword: 'Yeni Şifreyi Onayla',
      resetSuccessTitle: 'Şifre Başarıyla Sıfırlandı!',
      resetSuccessDesc: 'Artık yeni şifrenizle giriş yapabilirsiniz',
      goToLogin: 'Girişe Git'
    },
    feed: {
      title: 'Üniversite Akışı',
      askQuestion: 'Soru Sor',
      newPost: 'Yeni Gönderi',
      noPostsYet: 'Henüz Soru Yok',
      beFirstToAsk: 'Topluluğunuzda ilk soruyu soran siz olun!',
      replies: 'yanıt',
      votes: 'oy',
      postedBy: 'Gönderen',
      deletedAccount: '[Silinmiş Hesap]',
      loadingUni: 'Üniversiteniz Yükleniyor',
      settingUp: 'Üniversite akışınız hazırlanıyor...',
      shareKnowledge: 'Sorular sorun ve akranlarınızla bilgi paylaşın'
    },
    post: {
      title: 'Başlık',
      body: 'İçerik',
      description: 'Açıklama',
      tags: 'Etiketler',
      tagsPlaceholder: 'sınavlar, çalışma, yardım (virgülle ayrılmış)',
      attachments: 'Ekler',
      copyLink: 'Linki Kopyala',
      linkCopied: 'Link panoya kopyalandı!',
      writeReply: 'Yanıtınız',
      postReply: 'Yanıt Gönder',
      postQuestion: 'Soru Gönder',
      noReplies: 'Henüz yanıt yok.',
      beFirstToAnswer: 'İlk yanıtlayan siz olun!',
      whatsYourQuestion: 'Sorunuz nedir?',
      provideDetails: 'Daha fazla detay verin...',
      dropFiles: 'Dosyaları buraya bırakın veya göz atmak için tıklayın',
      supportsFiles: 'PDF, Resim, DOCX desteklenir (maks. 10MB)'
    },
    profile: {
      title: 'Profil',
      manageAccount: 'Hesabınızı ve tercihlerinizi yönetin',
      verificationStatus: 'Doğrulama Durumu',
      accountInfo: 'Hesap Bilgileri',
      preferences: 'Tercihler',
      dangerZone: 'Tehlikeli Bölge',
      displayHandle: 'Görünen Ad (Anonim)',
      emailNotifications: 'E-posta Bildirimleri',
      emailNotificationsDesc: 'Yanıtlar ve bahsetmeler hakkında güncellemeler alın',
      anonymousPosting: 'Anonim Paylaşım',
      anonymousPostingDesc: 'Soruları varsayılan olarak anonim paylaşın',
      deleteAccount: 'Hesabı Sil',
      deleteAccountWarning: 'Hesabınızı sildiğinizde geri dönüş yoktur. Gönderileriniz "[Silinmiş Hesap]" olarak kalacaktır.',
      typeDeleteToConfirm: 'Onaylamak için "DELETE" yazın',
      addUniversity: 'Üniversite Ekle',
      myUniversities: 'Üniversitelerim',
      pendingVerification: 'Doğrulama Bekliyor',
      pendingVerificationDesc: 'Doğrulamanız ekibimiz tarafından inceleniyor. Bu genellikle 24-48 saat sürer.',
      viewVerificationStatus: 'Doğrulama Durumunu Görüntüle',
      accountVerified: 'Hesap Doğrulandı',
      accountVerifiedDesc: 'Öğrenci kimliğiniz doğrulandı. Tüm özelliklere tam erişiminiz var.',
      notVerified: 'Doğrulanmadı',
      notVerifiedDesc: 'Tüm özelliklere erişmek için doğrulamanızı tamamlayın.',
      startVerification: 'Doğrulamayı Başlat',
      deleteForever: 'Kalıcı Olarak Sil',
      deleting: 'Siliniyor...',
      confirmDeletion: 'Hesap Silmeyi Onayla',
      confirmDeletionDesc: 'Hesabınızı silmek istediğinizden kesinlikle emin misiniz? Bu işlem geri alınamaz.'
    },
    home: {
      heroTitle: 'Üniversite Topluluğunuzla Bağlantı Kurun',
      heroSubtitle: 'Sorular sorun, bilgi paylaşın ve öğrenci arkadaşlarınıza yardım edin.',
      getStarted: 'Üç basit adımda başlayın.',
      learnMore: 'Daha Fazla',
      howItWorks: 'Nasıl Çalışır',
      whyBSP: 'Neden Berlin Öğrenci Portalı?',
      builtForStudents: 'Öğrenciler tarafından, öğrenciler için yapıldı.',
      step1Title: 'Kayıt & Doğrulama',
      step1Desc: 'Hesap oluşturun ve üniversite e-postanızla öğrenci durumunuzu doğrulayın.',
      step2Title: 'Kanalınıza Katılın',
      step2Desc: 'Üniversitenizin özel S&C kanalına erişin.',
      step3Title: 'Sorun & Cevap Verin',
      step3Desc: 'Sorular sorun, cevaplar paylaşın ve arkadaşlarınıza yardım edin.',
      openChannel: 'Üni Kanalını Aç',
      feature1Title: 'Kullanıcı Doğrulaması',
      feature1Desc: 'Her öğrenci üniversite e-postası ve öğrenci kimliği ile doğrulanır.',
      feature2Title: 'Anonim S&C',
      feature2Desc: 'Üniversite topluluğunuzda anonim olarak soru sorun ve cevaplayın.',
      feature3Title: 'Dosya Desteği',
      feature3Desc: 'Kaynak paylaşmak için PDF, resim ve belge ekleyin.',
      feature4Title: 'Minimal Arayüz',
      feature4Desc: 'Öğrenme ve işbirliğine odaklı temiz, dikkat dağıtmayan arayüz.',
      ctaTitle: 'Topluluğunuza Katılmaya Hazır mısınız?',
      ctaDesc: 'Binlerce öğrenci zaten soru soruyor, bilgi paylaşıyor ve birlikte büyüyor.',
      getStartedNow: 'Şimdi Başla'
    },
    footer: {
      quickLinks: 'Hızlı Linkler',
      legal: 'Yasal',
      termsOfService: 'Kullanım Koşulları',
      privacyPolicy: 'Gizlilik Politikası',
      communityGuidelines: 'Topluluk Kuralları',
      allRightsReserved: 'Tüm hakları saklıdır.',
      connectingStudents: 'Öğrencileri Birleştiriyor, Öğrenmeyi Güçlendiriyor.'
    },
    verification: {
      title: 'Öğrenci Doğrulaması',
      pending: 'İnceleniyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      uploadSelfie: 'Selfie Yükle',
      uploadStudentCard: 'Öğrenci Kartı Yükle',
      submitVerification: 'Doğrulamayı Gönder',
      clickToUpload: 'Yüklemek için tıklayın',
      clickToChange: 'Değiştirmek için tıklayın'
    },
    draft: {
      saved: 'Taslak kaydedildi',
      restore: 'Taslak geri yüklendi',
      discard: 'Taslağı Sil',
      hasDraft: 'Kaydedilmemiş bir taslağınız var',
      cleared: 'Taslak silindi'
    },
    errors: {
      somethingWentWrong: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      invalidCredentials: 'Geçersiz e-posta veya şifre.',
      emailRequired: 'E-posta gereklidir.',
      passwordRequired: 'Şifre gereklidir.',
      passwordTooWeak: 'Lütfen daha güçlü bir şifre seçin.',
      emailNotVerified: 'Lütfen önce e-postanızı doğrulayın.',
      networkError: 'Ağ hatası. Bağlantınızı kontrol edin.',
      failedToPost: 'Soru gönderilemedi. Lütfen tekrar deneyin.',
      completeAllFields: 'Lütfen tüm gerekli alanları doldurun.'
    },
    success: {
      accountCreated: 'Hesap başarıyla oluşturuldu!',
      emailVerified: 'E-posta başarıyla doğrulandı!',
      passwordReset: 'Şifre başarıyla sıfırlandı!',
      profileUpdated: 'Profil başarıyla güncellendi!',
      postCreated: 'Soru başarıyla paylaşıldı!',
      replyAdded: 'Yanıt başarıyla eklendi!',
      handleUpdated: 'Görünen ad başarıyla güncellendi!',
      accountDeleted: 'Hesabınız silindi. Onay e-postası gönderildi.',
      linkCopied: 'Link panoya kopyalandı!'
    }
  }
}
