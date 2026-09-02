export const translations = {
  en: {
    // Header
    header: {
      appName: "MediKiosk",
      appTagline: "Smart patient intake before your doctor visit"
    },
    
    // Screen 1 - Welcome
    welcome: {
      title: "Welcome to MediKiosk",
      subtitle: "Intelligent Healthcare Intake System",
      description: "Tell us about your health concerns before meeting your doctor.",
      feature1: "Quick & Efficient",
      feature2: "Secure & Confidential",
      feature3: "Comprehensive Records",
      cta: "Start Your Visit",
      feature1Description: "Quick registration and seamless healthcare experience",
      feature2Description: "Your data is encrypted and protected",
      feature3Description: "Complete patient records for better care",
      ctaSubtext: "No registration required • Takes 2-3 minutes"
    },

    // Screen 2 - Language Selection
    language: {
      title: "Select Your Language",
      subtitle: "Choose your preferred language for this visit",
      english: "English",
      hindi: "हिन्दी",
      back: "Back",
      continue: "Continue"
    },

    // Screen 3 - Patient Information
    patient: {
      title: "Tell us about yourself",
      subtitle: "Please provide some basic information before we begin.",
      fullName: "Full Name",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      mobile: "Mobile Number (10 digits)",
      placeholders: {
        fullName: "Enter your full name",
        age: "Enter your age",
        mobile: "9876543210"
      },
      errors: {
        nameRequired: "Full name is required",
        ageRequired: "Age is required",
        ageInvalid: "Please enter a valid age (1-120)",
        genderRequired: "Gender is required",
        mobileRequired: "Mobile number is required",
        mobileInvalid: "Mobile number must be exactly 10 digits"
      },
      back: "Back",
      continue: "Continue"
    },

    // Screen 4 - Chief Complaint
    complaint: {
      title: "What brings you here?",
      subtitle: "Describe your main health concern or symptoms",
      tapToSpeak: "Tap to Speak",
      describeYourProblem: "Describe your problem in your own words",
      or: "OR",
      preferTyping: "Prefer typing?",
      typeYourProblem: "Type your problem here...",
      helperText: "For example: I have had a headache and fever since yesterday.",
      commonSymptoms: "COMMON SYMPTOMS — TAP TO SELECT",
      symptoms: {
        fever: "Fever",
        headache: "Headache",
        cough: "Cough",
        stomach: "Stomach Pain",
        weakness: "Weakness",
        chest: "Chest Pain",
        dizziness: "Dizziness"
      },
      privateSecure: "Private & Secure.",
      privacyDescription: "Your information is used only to prepare your case for the doctor.",
      back: "Back",
      continue: "Continue"
    },

    // Progress
    progress: {
      step: "Step",
      complete: "% complete",
      languageSelection: "Language Selection",
      patientInfo: "Patient Information",
      chiefComplaint: "Chief Complaint"
    }
  },

  hi: {
    // Header
    header: {
      appName: "MediKiosk",
      appTagline: "डॉक्टर से पहले स्मार्ट रोगी जानकारी"
    },

    // Screen 1 - Welcome
    welcome: {
      title: "MediKiosk में आपका स्वागत है",
      subtitle: "बुद्धिमान स्वास्थ्य सेवा प्रणाली",
      description: "डॉक्टर से मिलने से पहले हमें अपनी स्वास्थ्य संबंधी समस्याओं के बारे में बताएं।",
      feature1: "तेज़ और कुशल",
      feature2: "सुरक्षित और गोपनीय",
      feature3: "व्यापक रिकॉर्ड",
      cta: "अपनी यात्रा शुरू करें",
      feature1Description: "त्वरित पंजीकरण और सहज स्वास्थ्य सेवा अनुभव",
      feature2Description: "आपका डेटा एन्क्रिप्टेड और सुरक्षित है",
      feature3Description: "बेहतर देखभाल के लिए पूर्ण रोगी रिकॉर्ड",
      ctaSubtext: "पंजीकरण आवश्यक नहीं • 2-3 मिनट लगते हैं"
    },

    // Screen 2 - Language Selection
    language: {
      title: "अपनी भाषा चुनें",
      subtitle: "इस यात्रा के लिए अपनी पसंदीदा भाषा चुनें",
      english: "English",
      hindi: "हिन्दी",
      back: "वापस",
      continue: "जारी रखें"
    },

    // Screen 3 - Patient Information
    patient: {
      title: "अपने बारे में बताएं",
      subtitle: "हम शुरू करने से पहले कृपया कुछ बुनियादी जानकारी प्रदान करें।",
      fullName: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      mobile: "मोबाइल नंबर (10 अंक)",
      placeholders: {
        fullName: "अपना पूरा नाम दर्ज करें",
        age: "अपनी आयु दर्ज करें",
        mobile: "9876543210"
      },
      errors: {
        nameRequired: "पूरा नाम आवश्यक है",
        ageRequired: "आयु आवश्यक है",
        ageInvalid: "कृपया एक वैध आयु दर्ज करें (1-120)",
        genderRequired: "लिंग आवश्यक है",
        mobileRequired: "मोबाइल नंबर आवश्यक है",
        mobileInvalid: "मोबाइल नंबर बिल्कुल 10 अंकों का होना चाहिए"
      },
      back: "वापस",
      continue: "जारी रखें"
    },

    // Screen 4 - Chief Complaint
    complaint: {
      title: "आप यहाँ क्यों आए हैं?",
      subtitle: "अपनी मुख्य स्वास्थ्य समस्या या लक्षणों का वर्णन करें",
      tapToSpeak: "बोलने के लिए टैप करें",
      describeYourProblem: "अपनी समस्या को अपने शब्दों में बताएं",
      or: "या",
      preferTyping: "टाइप करना पसंद है?",
      typeYourProblem: "अपनी समस्या यहाँ टाइप करें...",
      helperText: "उदाहरण के लिए: मुझे कल से सिरदर्द और बुखार है।",
      commonSymptoms: "सामान्य लक्षण — टैप करके चुनें",
      symptoms: {
        fever: "बुखार",
        headache: "सिरदर्द",
        cough: "खांसी",
        stomach: "पेट दर्द",
        weakness: "कमजोरी",
        chest: "सीने में दर्द",
        dizziness: "चक्कर आना"
      },
      privateSecure: "निजी और सुरक्षित।",
      privacyDescription: "आपकी जानकारी का उपयोग केवल डॉक्टर के लिए आपका मामला तैयार करने के लिए किया जाता है।",
      back: "वापस",
      continue: "जारी रखें"
    },

    // Progress
    progress: {
      step: "चरण",
      complete: "% पूर्ण",
      languageSelection: "भाषा चयन",
      patientInfo: "रोगी जानकारी",
      chiefComplaint: "मुख्य समस्या"
    }
  }
}
