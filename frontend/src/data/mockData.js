// Mock data for development/testing only
export const mockPatient = {
  language: "English",
  fullName: "Rahul Sharma",
  age: "32",
  gender: "Male",
  mobile: "9876543210",
  chiefComplaint: "Fever and headache since yesterday"
};

export const languages = [
  { id: "en", label: "English", icon: "🇬🇧" },
  { id: "hi", label: "हिन्दी", icon: "🇮🇳" }
];

export const genderOptions = [
  { id: "male", label: "Male", icon: "♂️" },
  { id: "female", label: "Female", icon: "♀️" },
  { id: "other", label: "Other", icon: "⊙" }
];

export const mockDoctor = {
  name: "Dr. Ananya Mehta",
  specialty: "General Medicine",
  clinic: "MediKiosk Care Centre",
  initials: "AM"
};

export const doctorQueue = [
  { id: "MK-1048", name: "Rahul Sharma", age: 32, gender: "Male", concern: "Fever and headache", wait: "Now", status: "Ready", severity: "moderate", time: "10:24 AM" },
  { id: "MK-1047", name: "Priya Nair", age: 28, gender: "Female", concern: "Persistent cough", wait: "8 min", status: "Waiting", severity: "low", time: "10:16 AM" },
  { id: "MK-1046", name: "Arjun Verma", age: 46, gender: "Male", concern: "Chest discomfort", wait: "14 min", status: "Waiting", severity: "high", time: "10:10 AM" },
  { id: "MK-1045", name: "Sunita Rao", age: 61, gender: "Female", concern: "Joint pain and fatigue", wait: "Completed", status: "Completed", severity: "low", time: "09:54 AM" }
];

export const doctorActivity = [
  { title: "Patient intake completed", detail: "Rahul Sharma submitted symptoms", time: "2 min ago", tone: "teal" },
  { title: "New patient in queue", detail: "Priya Nair is ready for review", time: "10 min ago", tone: "blue" },
  { title: "Consultation completed", detail: "Sunita Rao's notes were saved", time: "28 min ago", tone: "green" }
];

export const mockClinicalRecord = {
  patientId: "MK-1048",
  document: {
    name: "Rahul_Sharma_intake.pdf",
    type: "Patient intake document",
    uploaded: "Today, 10:24 AM",
    pages: 2,
    size: "248 KB",
    status: "Processed"
  },
  extracted: [
    { label: "Patient name", value: "Rahul Sharma", confidence: 99, source: "Page 1 · Header" },
    { label: "Primary concern", value: "Fever and headache since yesterday", confidence: 96, source: "Page 1 · Chief complaint" },
    { label: "Age", value: "32 years", confidence: 99, source: "Page 1 · Demographics" },
    { label: "Gender", value: "Male", confidence: 99, source: "Page 1 · Demographics" },
    { label: "Duration", value: "Since yesterday", confidence: 91, source: "Page 1 · Chief complaint" },
    { label: "Current medication", value: "Paracetamol 500 mg, as needed", confidence: 87, source: "Page 2 · Medication history" },
    { label: "Allergies", value: "No known allergies reported", confidence: 94, source: "Page 2 · Medical history" }
  ],
  comparison: [
    { field: "Patient name", original: "Rahul Sharma", extracted: "Rahul Sharma", status: "match" },
    { field: "Primary concern", original: "Fever and headache since yesterday", extracted: "Fever and headache since yesterday", status: "match" },
    { field: "Age", original: "32 years", extracted: "32 years", status: "match" },
    { field: "Current medication", original: "Paracetamol 500 mg as needed", extracted: "Paracetamol 500 mg, as needed", status: "review" },
    { field: "Allergies", original: "No known allergies reported", extracted: "No known allergies reported", status: "match" }
  ],
  summary: {
    overview: "Rahul Sharma is a 32-year-old male presenting with fever and headache that began yesterday. The patient reports using paracetamol as needed and no known allergies.",
    keyFindings: ["Acute fever with headache", "Symptoms began approximately 24 hours ago", "No known allergies reported"],
    suggestedChecks: ["Record current temperature", "Assess hydration and other infection symptoms", "Review response to paracetamol"],
    generatedAt: "Today, 10:26 AM"
  }
};
