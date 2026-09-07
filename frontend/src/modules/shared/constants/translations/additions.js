// Add these translations to the existing translations.js file

// For English (en):
export const loginTranslationsEn = {
  login: {
    title: "Welcome to MediKiosk",
    subtitle: "Enter your mobile number to continue your visit or register as a new patient",
    sectionLabel: "Patient Portal",
    mobileLabel: "Mobile Number",
    mobileHint: "Enter your 10-digit mobile number",
    continueButton: "Continue",
    checking: "Checking...",
    or: "or",
    doctorLogin: "Login as Doctor",
    patientFound: "Patient record found!",
    feature1: "Secure & Private",
    feature2: "Quick Registration",
    feature3: "Doctor Ready"
  },

  patientDetails: {
    title: "Patient Dashboard",
    subtitle: "View your information and start a new consultation",
    infoTitle: "Your Information",
    patientId: "Patient ID",
    language: "Language",
    newCaseTitle: "Start New Consultation",
    newCaseDescription: "Begin a new visit by providing your chief complaint and medical history",
    startButton: "Start New Case",
    infoBanner: "Your information is secure and will only be shared with your healthcare provider."
  }
}

// For Hindi (hi):
export const loginTranslationsHi = {
  login: {
    title: "MediKiosk में आपका स्वागत है",
    subtitle: "अपनी यात्रा जारी रखने या नए रोगी के रूप में पंजीकरण करने के लिए अपना मोबाइल नंबर दर्ज करें",
    sectionLabel: "रोगी पोर्टल",
    mobileLabel: "मोबाइल नंबर",
    mobileHint: "अपना 10-अंकीय मोबाइल नंबर दर्ज करें",
    continueButton: "जारी रखें",
    checking: "जाँच रहे हैं...",
    or: "या",
    doctorLogin: "डॉक्टर के रूप में लॉगिन करें",
    patientFound: "रोगी रिकॉर्ड मिला!",
    feature1: "सुरक्षित और निजी",
    feature2: "त्वरित पंजीकरण",
    feature3: "डॉक्टर तैयार"
  },

  patientDetails: {
    title: "रोगी डैशबोर्ड",
    subtitle: "अपनी जानकारी देखें और नया परामर्श शुरू करें",
    infoTitle: "आपकी जानकारी",
    patientId: "रोगी आईडी",
    language: "भाषा",
    newCaseTitle: "नया परामर्श शुरू करें",
    newCaseDescription: "अपनी मुख्य समस्या और चिकित्सा इतिहास प्रदान करके नई यात्रा शुरू करें",
    startButton: "नया केस शुरू करें",
    infoBanner: "आपकी जानकारी सुरक्षित है और केवल आपके स्वास्थ्य सेवा प्रदाता के साथ साझा की जाएगी।"
  }
}

// Instructions:
// 1. Open frontend/src/data/translations.js
// 2. Add the 'login' and 'patientDetails' sections from above to both en and hi objects
// 3. Place them after the 'language' section and before the 'patient' section