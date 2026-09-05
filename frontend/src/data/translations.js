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
      chiefComplaint: "Chief Complaint",
      symptomAssessment: "Symptom Assessment"
    },

    // Screen 5 - Symptom Assessment
    assessment: {
      badge: "Guided consultation",
      title: "A few questions about",
      titleFever: "your fever",
      titlePiles: "your bleeding",
      subtitle: "Your answers help organise information for a healthcare professional. This is not a medical diagnosis.",
      progress: "Question",
      of: "of",
      continue: "Continue",
      finish: "Finish questions",
      back: "Back",
      complete: {
        title: "Guided questions complete",
        text: "Your answers are ready to review. This frontend demo does not provide a diagnosis.",
        button: "Continue to documents"
      },
      fever: {
        q1: {
          question: "How long have you had the fever?",
          opt1: "1 day",
          opt2: "2-3 days",
          opt3: "More than 3 days"
        },
        q2: {
          question: "What is your highest recorded temperature?",
          opt1: "Below 100°F",
          opt2: "Around 101°F",
          opt3: "102°F or higher"
        },
        q3: {
          question: "Are you experiencing any of these symptoms?",
          description: "Select all that apply.",
          opt1: "Headache",
          opt2: "Body ache",
          opt3: "Cough",
          opt4: "Sore throat",
          opt5: "Vomiting",
          opt6: "None of these"
        },
        q4: {
          question: "Are you having any serious symptoms?",
          description: "Select all that apply.",
          opt1: "Difficulty breathing",
          opt2: "Chest pain",
          opt3: "Confusion",
          opt4: "Severe weakness",
          opt5: "None"
        }
      },
      piles: {
        q1: {
          question: "How long has this been happening?",
          opt1: "Less than a week",
          opt2: "1-4 weeks",
          opt3: "More than a month"
        },
        q2: {
          question: "Is the blood bright red or dark?",
          opt1: "Bright red",
          opt2: "Dark or black",
          opt3: "Not sure"
        },
        q3: {
          question: "Is there pain while passing stool?",
          opt1: "Yes",
          opt2: "No",
          opt3: "Sometimes"
        },
        q4: {
          question: "Do you feel a lump or swelling?",
          opt1: "Yes",
          opt2: "No",
          opt3: "Not sure"
        },
        q5: {
          question: "Do you have constipation?",
          opt1: "Often",
          opt2: "Sometimes",
          opt3: "No"
        },
        q6: {
          question: "How frequently does it happen?",
          opt1: "Once",
          opt2: "A few times",
          opt3: "Frequently"
        }
      }
    },

    // Screen 6 - Documents
    documents: {
      step: "Step",
      stepTitle: "Previous medical documents",
      eyebrow: "Guided consultation",
      title: "Add previous medical documents",
      subtitle: "Attach prescriptions, reports, or discharge summaries that may help the doctor understand your history.",
      optional: "Optional",
      cardTitle: "Upload documents",
      dropZoneTitle: "Drop files here or choose from your device",
      dropZoneSubtitle: "PDF, JPG, or PNG up to 10 MB each",
      chooseFiles: "＋ Choose files",
      uploadProgress: "Preparing documents...",
      attachedTitle: "Attached documents",
      noDocuments: "No documents attached",
      noDocumentsText: "You can continue without adding anything now.",
      remove: "Remove",
      back: "Back",
      continue: "Continue",
      skip: "Skip for now"
    },

    // Screen 7 - Summary
    summary: {
      step: "Step",
      stepTitle: "Review your answers",
      eyebrow: "Guided consultation",
      title: "Your consultation summary",
      subtitle: "Review the information before we prepare a preliminary assessment.",
      badge: "Ready to review",
      complaintTitle: "Patient complaint",
      edit: "Edit",
      demoCase: "Demo case:",
      fever: "Fever",
      piles: "Bleeding while passing stool / suspected piles",
      answersTitle: "Guided answers",
      documentsTitle: "Previous medical documents",
      documentsCount: "document",
      documentsCountPlural: "documents",
      documentsAttached: "attached",
      noDocuments: "No documents attached",
      privacyNote: "This is a private demo record. It is not a medical diagnosis.",
      back: "Back",
      continue: "Prepare assessment",
      answerLabels: {
        duration: "Duration",
        temperature: "Temperature",
        symptoms: "Symptoms",
        seriousSymptoms: "Serious symptoms",
        bloodColour: "Blood colour",
        pain: "Pain while passing stool",
        lump: "Lump or swelling",
        constipation: "Constipation",
        frequency: "Frequency"
      }
    },

    // Screen 8 - Assessment
    assessmentResult: {
      step: "Step",
      stepTitle: "Preliminary assessment",
      eyebrow: "Responses recorded",
      title: "Preliminary assessment",
      subtitle: "We have organised your responses into a clear handover for the healthcare professional.",
      bannerUrgent: "Some symptoms need prompt attention.",
      bannerRoutine: "The reported pattern can be reviewed in a routine consultation.",
      disclaimer: "This is a frontend demo decision tree, not a diagnosis.",
      symptomsTitle: "Reported symptoms",
      symptom1: "Primary concern:",
      symptom2: "Answers from the guided questionnaire recorded",
      observationTitle: "Important observation",
      observationUrgent: "Please do not delay professional review because of the warning symptoms reported.",
      observationRoutine: "No urgent warning symptom was selected in this demo questionnaire.",
      back: "Back",
      continue: "See recommended next step"
    },

    // Screen 9 - Next Step
    nextStep: {
      step: "Step",
      stepTitle: "Recommended next step",
      eyebrow: "Care path",
      title: "Choose your next step",
      subtitle: "The next action is based on the responses you reviewed. A healthcare professional will make the actual clinical assessment.",
      pathUrgent: "Needs prompt attention",
      pathRoutine: "Routine pathway",
      actionEyebrow: "Recommended action",
      actionUrgentTitle: "Seek immediate medical care",
      actionUrgentText: "Some symptoms you reported require prompt medical attention. Please contact local emergency services or visit the nearest facility.",
      actionRoutineTitle: "Continue to consultation",
      actionRoutineText: "Your information is ready for a routine consultation with a healthcare professional.",
      whatNextTitle: "What happens next",
      step1Title: "Your summary is ready",
      step1Text: "Your responses and attached documents are prepared for review.",
      step2UrgentTitle: "Get prompt support",
      step2UrgentText: "Do not wait for this demo flow if you feel unsafe.",
      step2RoutineTitle: "Meet a healthcare professional",
      step2RoutineText: "Discuss your concern and questions with the care team.",
      disclaimer: "MediKiosk provides intake support only. It does not diagnose or replace professional medical advice.",
      back: "Back",
      continueUrgent: "Seek Immediate Medical Care",
      continueRoutine: "Continue to Consultation"
    },

    // Screen 10 - Completion
    completion: {
      step: "Step",
      stepTitle: "Consultation complete",
      loadingEyebrow: "Finishing your intake",
      loadingTitle: "Preparing your consultation handover",
      loadingText: "Your local demo record is being organised.",
      eyebrow: "Intake complete",
      title: "You are ready for consultation",
      subtitle: "information has been recorded for the next conversation with a healthcare professional.",
      overviewTitle: "Visit overview",
      patient: "Patient",
      documents: "Documents",
      documentsAttached: "attached",
      pathway: "Pathway",
      pathwayUrgent: "Prompt attention",
      pathwayRoutine: "Routine consultation",
      successNote: "This frontend prototype keeps your files and responses local to this session.",
      back: "Back",
      restart: "Start a new visit"
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
      chiefComplaint: "मुख्य समस्या",
      symptomAssessment: "लक्षण मूल्यांकन"
    },

    // Screen 5 - Symptom Assessment
    assessment: {
      badge: "निर्देशित परामर्श",
      title: "कुछ प्रश्न",
      titleFever: "आपके बुखार के बारे में",
      titlePiles: "आपके रक्तस्राव के बारे में",
      subtitle: "आपके उत्तर स्वास्थ्य पेशेवर के लिए जानकारी व्यवस्थित करने में मदद करते हैं। यह चिकित्सा निदान नहीं है।",
      progress: "प्रश्न",
      of: "में से",
      continue: "जारी रखें",
      finish: "प्रश्न समाप्त करें",
      back: "वापस",
      complete: {
        title: "निर्देशित प्रश्न पूर्ण",
        text: "आपके उत्तर समीक्षा के लिए तैयार हैं। यह फ्रंटएंड डेमो निदान प्रदान नहीं करता है।",
        button: "दस्तावेज़ों के लिए जारी रखें"
      },
      fever: {
        q1: {
          question: "आपको कब से बुखार है?",
          opt1: "1 दिन",
          opt2: "2-3 दिन",
          opt3: "3 दिन से अधिक"
        },
        q2: {
          question: "आपका सबसे अधिक रिकॉर्ड किया गया तापमान क्या है?",
          opt1: "100°F से नीचे",
          opt2: "लगभग 101°F",
          opt3: "102°F या अधिक"
        },
        q3: {
          question: "क्या आपको इनमें से कोई लक्षण हो रहा है?",
          description: "जो लागू हों उन्हें चुनें।",
          opt1: "सिरदर्द",
          opt2: "शरीर में दर्द",
          opt3: "खांसी",
          opt4: "गले में खराश",
          opt5: "उल्टी",
          opt6: "इनमें से कोई नहीं"
        },
        q4: {
          question: "क्या आपको कोई गंभीर लक्षण हो रहा है?",
          description: "जो लागू हों उन्हें चुनें।",
          opt1: "सांस लेने में कठिनाई",
          opt2: "छाती में दर्द",
          opt3: "भ्रम",
          opt4: "गंभीर कमजोरी",
          opt5: "कोई नहीं"
        }
      },
      piles: {
        q1: {
          question: "यह कब से हो रहा है?",
          opt1: "एक सप्ताह से कम",
          opt2: "1-4 सप्ताह",
          opt3: "एक महीने से अधिक"
        },
        q2: {
          question: "क्या रक्त चमकीला लाल या काला है?",
          opt1: "चमकीला लाल",
          opt2: "काला या गहरा",
          opt3: "निश्चित नहीं"
        },
        q3: {
          question: "क्या मल त्याग करते समय दर्द होता है?",
          opt1: "हां",
          opt2: "नहीं",
          opt3: "कभी-कभी"
        },
        q4: {
          question: "क्या आपको कोई गांठ या सूजन महसूस होती है?",
          opt1: "हां",
          opt2: "नहीं",
          opt3: "निश्चित नहीं"
        },
        q5: {
          question: "क्या आपको कब्ज है?",
          opt1: "अक्सर",
          opt2: "कभी-कभी",
          opt3: "नहीं"
        },
        q6: {
          question: "यह कितनी बार होता है?",
          opt1: "एक बार",
          opt2: "कुछ बार",
          opt3: "बार-बार"
        }
      }
    },

    // Screen 6 - Documents
    documents: {
      step: "चरण",
      stepTitle: "पिछले चिकित्सा दस्तावेज़",
      eyebrow: "निर्देशित परामर्श",
      title: "पिछले चिकित्सा दस्तावेज़ जोड़ें",
      subtitle: "प्रिस्क्रिप्शन, रिपोर्ट, या डिस्चार्ज सारांश संलग्न करें जो डॉक्टर को आपके इतिहास को समझने में मदद कर सकते हैं।",
      optional: "वैकल्पिक",
      cardTitle: "दस्तावेज़ अपलोड करें",
      dropZoneTitle: "फ़ाइलें यहाँ छोड़ें या अपने डिवाइस से चुनें",
      dropZoneSubtitle: "प्रत्येक 10 MB तक PDF, JPG, या PNG",
      chooseFiles: "＋ फ़ाइलें चुनें",
      uploadProgress: "दस्तावेज़ तैयार कर रहे हैं...",
      attachedTitle: "संलग्न दस्तावेज़",
      noDocuments: "कोई दस्तावेज़ संलग्न नहीं",
      noDocumentsText: "आप अभी कुछ भी जोड़े बिना जारी रख सकते हैं।",
      remove: "हटाएं",
      back: "वापस",
      continue: "जारी रखें",
      skip: "अभी के लिए छोड़ें"
    },

    // Screen 7 - Summary
    summary: {
      step: "चरण",
      stepTitle: "अपने उत्तरों की समीक्षा करें",
      eyebrow: "निर्देशित परामर्श",
      title: "आपका परामर्श सारांश",
      subtitle: "प्रारंभिक मूल्यांकन तैयार करने से पहले जानकारी की समीक्षा करें।",
      badge: "समीक्षा के लिए तैयार",
      complaintTitle: "रोगी की समस्या",
      edit: "संपादित करें",
      demoCase: "डेमो केस:",
      fever: "बुखार",
      piles: "मल त्याग करते समय रक्तस्राव / संदिग्ध बवासीर",
      answersTitle: "निर्देशित उत्तर",
      documentsTitle: "पिछले चिकित्सा दस्तावेज़",
      documentsCount: "दस्तावेज़",
      documentsCountPlural: "दस्तावेज़",
      documentsAttached: "संलग्न",
      noDocuments: "कोई दस्तावेज़ संलग्न नहीं",
      privacyNote: "यह एक निजी डेमो रिकॉर्ड है। यह चिकित्सा निदान नहीं है।",
      back: "वापस",
      continue: "मूल्यांकन तैयार करें",
      answerLabels: {
        duration: "अवधि",
        temperature: "तापमान",
        symptoms: "लक्षण",
        seriousSymptoms: "गंभीर लक्षण",
        bloodColour: "रक्त का रंग",
        pain: "मल त्याग करते समय दर्द",
        lump: "गांठ या सूजन",
        constipation: "कब्ज",
        frequency: "आवृत्ति"
      }
    },

    // Screen 8 - Assessment
    assessmentResult: {
      step: "चरण",
      stepTitle: "प्रारंभिक मूल्यांकन",
      eyebrow: "प्रतिक्रियाएं रिकॉर्ड की गईं",
      title: "प्रारंभिक मूल्यांकन",
      subtitle: "हमने आपकी प्रतिक्रियाओं को स्वास्थ्य पेशेवर के लिए स्पष्ट हैंडओवर में व्यवस्थित किया है।",
      bannerUrgent: "कुछ लक्षणों पर तुरंत ध्यान देने की आवश्यकता है।",
      bannerRoutine: "रिपोर्ट किए गए पैटर्न की नियमित परामर्श में समीक्षा की जा सकती है।",
      disclaimer: "यह एक फ्रंटएंड डेमो निर्णय वृक्ष है, निदान नहीं।",
      symptomsTitle: "रिपोर्ट किए गए लक्षण",
      symptom1: "प्राथमिक चिंता:",
      symptom2: "निर्देशित प्रश्नावली से उत्तर रिकॉर्ड किए गए",
      observationTitle: "महत्वपूर्ण अवलोकन",
      observationUrgent: "कृपया रिपोर्ट किए गए चेतावनी लक्षणों के कारण पेशेवर समीक्षा में देरी न करें।",
      observationRoutine: "इस डेमो प्रश्नावली में कोई तत्काल चेतावनी लक्षण नहीं चुना गया था।",
      back: "वापस",
      continue: "अनुशंसित अगला कदम देखें"
    },

    // Screen 9 - Next Step
    nextStep: {
      step: "चरण",
      stepTitle: "अनुशंसित अगला कदम",
      eyebrow: "देखभाल पथ",
      title: "अपना अगला कदम चुनें",
      subtitle: "अगली कार्रवाई आपकी समीक्षा की गई प्रतिक्रियाओं पर आधारित है। एक स्वास्थ्य पेशेवर वास्तविक नैदानिक मूल्यांकन करेगा।",
      pathUrgent: "तुरंत ध्यान देने की आवश्यकता है",
      pathRoutine: "नियमित मार्ग",
      actionEyebrow: "अनुशंसित कार्रवाई",
      actionUrgentTitle: "तत्काल चिकित्सा देखभाल लें",
      actionUrgentText: "आपके द्वारा रिपोर्ट किए गए कुछ लक्षणों पर तुरंत चिकित्सा ध्यान देने की आवश्यकता है। कृपया स्थानीय आपातकालीन सेवाओं से संपर्क करें या निकटतम सुविधा पर जाएं।",
      actionRoutineTitle: "परामर्श के लिए जारी रखें",
      actionRoutineText: "आपकी जानकारी एक स्वास्थ्य पेशेवर के साथ नियमित परामर्श के लिए तैयार है।",
      whatNextTitle: "आगे क्या होगा",
      step1Title: "आपका सारांश तैयार है",
      step1Text: "आपकी प्रतिक्रियाएं और संलग्न दस्तावेज़ समीक्षा के लिए तैयार हैं।",
      step2UrgentTitle: "तुरंत सहायता प्राप्त करें",
      step2UrgentText: "यदि आप असुरक्षित महसूस करते हैं तो इस डेमो फ्लो का इंतजार न करें।",
      step2RoutineTitle: "एक स्वास्थ्य पेशेवर से मिलें",
      step2RoutineText: "देखभाल टीम के साथ अपनी चिंता और प्रश्नों पर चर्चा करें।",
      disclaimer: "MediKiosk केवल सेवन सहायता प्रदान करता है। यह निदान नहीं करता है या पेशेवर चिकित्सा सलाह को प्रतिस्थापित नहीं करता है।",
      back: "वापस",
      continueUrgent: "तत्काल चिकित्सा देखभाल लें",
      continueRoutine: "परामर्श के लिए जारी रखें"
    },

    // Screen 10 - Completion
    completion: {
      step: "चरण",
      stepTitle: "परामर्श पूर्ण",
      loadingEyebrow: "आपका सेवन समाप्त कर रहे हैं",
      loadingTitle: "आपका परामर्श हैंडओवर तैयार कर रहे हैं",
      loadingText: "आपका स्थानीय डेमो रिकॉर्ड व्यवस्थित किया जा रहा है।",
      eyebrow: "सेवन पूर्ण",
      title: "आप परामर्श के लिए तैयार हैं",
      subtitle: "की जानकारी स्वास्थ्य पेशेवर के साथ अगली बातचीत के लिए रिकॉर्ड की गई है।",
      overviewTitle: "यात्रा अवलोकन",
      patient: "रोगी",
      documents: "दस्तावेज़",
      documentsAttached: "संलग्न",
      pathway: "मार्ग",
      pathwayUrgent: "तुरंत ध्यान",
      pathwayRoutine: "नियमित परामर्श",
      successNote: "यह फ्रंटएंड प्रोटोटाइप आपकी फ़ाइलों और प्रतिक्रियाओं को इस सत्र के लिए स्थानीय रखता है।",
      back: "वापस",
      restart: "नई यात्रा शुरू करें"
    }
  }
}
