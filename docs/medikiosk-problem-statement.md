# MediKiosk Problem Statement

**Project:** MediKiosk — AI-Powered Pre-Consultation Patient Case-Taking Software  
**Target:** SIH 2026 Internal Hackathon  
**Purpose:** Clean, professional problem understanding document for planning, development, and presentation.

---

## 1. Problem Statement Title

**Patient Case-Taking Software**

---

## 2. Background

Clinical history-taking is one of the most important activities in medicine. A well-conducted history often gives the doctor a strong diagnostic direction before examination or investigations.

In high-volume Indian OPDs, doctors often get only a few minutes per patient. During that short time, they must understand the complaint, take history, examine the patient, review previous records, counsel, and prescribe. This creates a major bottleneck.

---

## 3. Core Problem

There is no purpose-built, patient-facing software platform that allows patients to independently record their medical history before consultation using:

- Voice interaction
- Touch-based guided input
- Text input
- Medical document upload
- OCR-based document digitization
- AI-assisted structured summary generation

The required system should generate a physician-ready clinical history summary before the patient enters the consultation room.

---

## 4. Key Problems

### 4.1 Clinical History Bottleneck

Doctors in busy OPDs do not have enough time to take detailed history from every patient.

Impact:

- Important symptoms may be missed
- Drug/allergy history may be incomplete
- Past illness may not be captured properly
- Consultation time is consumed by basic data collection
- Doctor workload increases

### 4.2 Fragmented Medical Records

Patients often carry physical prescriptions, reports, discharge summaries, and handwritten notes.

Problems:

- Records are unstructured
- Documents may be disordered
- Important data is hard to find quickly
- Doctors lose time reviewing paper documents
- There is no automatic timeline of previous medical events

### 4.3 Accessibility Gap

Many digital health tools assume patients have smartphones, digital literacy, stable internet, and prior onboarding. This excludes many elderly, rural, low-literacy, and first-time hospital visitors.

### 4.4 AYUSH-Specific Complexity

AYUSH/Ayurvedic history-taking may require detailed assessment of Prakriti, Vikriti, Agni, Koshtha, Ahara-Vihara, Nidana, Samprapti, and Dashavidha Pariksha parameters.

For the MVP, AYUSH should remain an optional extension after the core patient-to-doctor workflow is functional.

---

## 5. Why Existing Solutions Fall Short

| Existing Solution | Limitation |
|---|---|
| Hospital registration systems | Capture demographics and token details, not clinical history |
| Mobile health apps | Require digital literacy, smartphone access, and prior onboarding |
| Tele-triage chatbots | Not suitable for high-volume hospital kiosk-style intake |
| Manual nurse-led intake | Does not scale for very high OPD load |
| Generic scanners | Digitize images but do not extract, structure, or summarize clinical information |
| EMR/HIS systems | Usually doctor-facing, not patient-driven pre-consultation intake |

---

## 6. Expected Solution

The expected solution is an AI-powered pre-consultation case-taking platform that allows patients to:

1. Identify themselves or register as new patients.
2. Select a preferred language.
3. Provide chief complaint through voice, text, or touch.
4. Answer guided follow-up questions.
5. Provide medical history, allergies, medications, and family history.
6. Upload previous medical documents.
7. Allow OCR/AI to extract and organize document information.
8. Generate a structured draft clinical summary.
9. Allow the doctor to review, edit, and approve the final summary.

---

## 7. Proposed Product: MediKiosk

MediKiosk is a pre-consultation clinical intake platform for hospitals.

It acts as a digital assistant that collects patient information before consultation and prepares a structured summary for the doctor.

| Module | Description |
|---|---|
| Patient Intake | Language selection, patient registration/search, session creation |
| Guided Case-Taking | Complaint-based follow-up questions using voice/text/touch |
| Medical History | Past history, medicines, allergies, surgery, family history |
| Document Upload | Upload prescriptions, lab reports, discharge summaries |
| OCR Intelligence | Extract text and structured information from uploaded files |
| AI Draft Summary | Generate physician-ready structured draft summary |
| Doctor Review | Doctor reviews, edits, and approves the final case summary |
| Optional AYUSH Extension | Structured AYUSH-specific assessment where required |

---

## 8. MVP Boundaries

The MVP will not provide:

- Autonomous diagnosis
- Prescription generation
- Replacement of doctors
- Full HIS integration
- Real ABDM/ABHA integration
- Aadhaar authentication
- Full EMR functionality
- Support for all Indian languages
- Perfect handwritten OCR
- Autonomous AYUSH diagnosis

The MVP focuses on collecting, structuring, and presenting patient information for doctor review.

---

## 9. Safety Principle

```text
AI assists.
Doctor verifies.
Doctor decides.
```

AI-generated summaries are drafts only. The doctor remains the final authority.

---

## 10. Internal Hackathon Positioning

For the internal round, demonstrate one strong end-to-end workflow:

```text
Patient intake
   ↓
Document upload
   ↓
OCR/AI processing
   ↓
AI draft summary
   ↓
Doctor review
   ↓
Doctor edit
   ↓
Doctor approval
```

This is more important than building many incomplete features.