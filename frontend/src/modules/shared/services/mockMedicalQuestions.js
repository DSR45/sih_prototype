const MOCK_QUESTIONS = {
  fever: {
    en: [
      { id: 'mock-fever-duration', question: 'How long have you had the fever?', options: [['Less than 1 day', 'less-than-1-day'], ['1-3 days', '1-3-days'], ['More than 3 days', 'more-than-3-days']] },
      { id: 'mock-fever-temperature', question: 'What was your highest recorded temperature?', options: [['Below 100°F', 'below-100'], ['100-102°F', '100-102'], ['Above 102°F', 'above-102']] },
      { id: 'mock-fever-symptoms', question: 'Do you have any of these symptoms?', description: 'Select all that apply.', multi: true, options: [['Headache', 'headache'], ['Body ache', 'body-ache'], ['Cough', 'cough'], ['Vomiting', 'vomiting'], ['None of these', 'none']] }
    ],
    hi: [
      { id: 'mock-fever-duration', question: 'आपको कब से बुखार है?', options: [['एक दिन से कम', 'less-than-1-day'], ['1-3 दिन', '1-3-days'], ['3 दिन से अधिक', 'more-than-3-days']] },
      { id: 'mock-fever-temperature', question: 'आपका सबसे अधिक तापमान कितना था?', options: [['100°F से कम', 'below-100'], ['100-102°F', '100-102'], ['102°F से अधिक', 'above-102']] },
      { id: 'mock-fever-symptoms', question: 'क्या आपको इनमें से कोई लक्षण है?', description: 'जो लागू हों उन्हें चुनें।', multi: true, options: [['सिरदर्द', 'headache'], ['शरीर में दर्द', 'body-ache'], ['खांसी', 'cough'], ['उल्टी', 'vomiting'], ['इनमें से कोई नहीं', 'none']] }
    ]
  },
  headache: {
    en: [
      { id: 'mock-headache-duration', question: 'How long have you had the headache?', options: [['Less than 1 day', 'less-than-1-day'], ['1-3 days', '1-3-days'], ['More than 3 days', 'more-than-3-days']] },
      { id: 'mock-headache-severity', question: 'How severe is the headache?', options: [['Mild', 'mild'], ['Moderate', 'moderate'], ['Severe', 'severe']] },
      { id: 'mock-headache-warning', question: 'Do you have any warning symptoms?', multi: true, options: [['Blurred vision', 'blurred-vision'], ['Weakness or numbness', 'weakness-numbness'], ['Vomiting', 'vomiting'], ['None', 'none']] }
    ],
    hi: [
      { id: 'mock-headache-duration', question: 'आपको सिरदर्द कब से है?', options: [['एक दिन से कम', 'less-than-1-day'], ['1-3 दिन', '1-3-days'], ['3 दिन से अधिक', 'more-than-3-days']] },
      { id: 'mock-headache-severity', question: 'सिरदर्द कितना तेज है?', options: [['हल्का', 'mild'], ['मध्यम', 'moderate'], ['तेज', 'severe']] },
      { id: 'mock-headache-warning', question: 'क्या आपको कोई चेतावनी वाला लक्षण है?', multi: true, options: [['धुंधला दिखाई देना', 'blurred-vision'], ['कमजोरी या सुन्नपन', 'weakness-numbness'], ['उल्टी', 'vomiting'], ['कोई नहीं', 'none']] }
    ]
  },
  cough: {
    en: [
      { id: 'mock-cough-duration', question: 'How long have you been coughing?', options: [['Less than 1 week', 'less-than-week'], ['1-3 weeks', '1-3-weeks'], ['More than 3 weeks', 'more-than-3-weeks']] },
      { id: 'mock-cough-type', question: 'Is the cough dry or producing mucus?', options: [['Dry cough', 'dry'], ['With mucus', 'mucus'], ['Not sure', 'not-sure']] },
      { id: 'mock-cough-warning', question: 'Do you have difficulty breathing or chest pain?', options: [['Yes', 'yes'], ['No', 'no'], ['Sometimes', 'sometimes']] }
    ],
    hi: [
      { id: 'mock-cough-duration', question: 'आपको खांसी कब से है?', options: [['एक सप्ताह से कम', 'less-than-week'], ['1-3 सप्ताह', '1-3-weeks'], ['3 सप्ताह से अधिक', 'more-than-3-weeks']] },
      { id: 'mock-cough-type', question: 'क्या खांसी सूखी है या बलगम आता है?', options: [['सूखी खांसी', 'dry'], ['बलगम के साथ', 'mucus'], ['निश्चित नहीं', 'not-sure']] },
      { id: 'mock-cough-warning', question: 'क्या आपको सांस लेने में कठिनाई या सीने में दर्द है?', options: [['हां', 'yes'], ['नहीं', 'no'], ['कभी-कभी', 'sometimes']] }
    ]
  }
}

const aliases = {
  fever: ['fever', 'बुखार', 'temperature'],
  headache: ['headache', 'सिरदर्द', 'migraine'],
  cough: ['cough', 'खांसी']
}

export function getMockMedicalQuestions({ complaint = '', tags = [], language = 'en' }) {
  const haystack = `${complaint} ${tags.join(' ')}`.toLowerCase()
  const key = Object.keys(aliases).find(name => aliases[name].some(alias => haystack.includes(alias)))
  if (!key) return null
  return (MOCK_QUESTIONS[key][language === 'hi' ? 'hi' : 'en'] || MOCK_QUESTIONS[key].en).map(question => ({
    ...question,
    storageQuestion: MOCK_QUESTIONS[key].en.find(item => item.id === question.id)?.question || question.question,
    storageOptions: MOCK_QUESTIONS[key].en.find(item => item.id === question.id)?.options || question.options
  }))
}
