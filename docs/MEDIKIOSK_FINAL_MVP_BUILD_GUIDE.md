# MediKiosk Final MVP Build Guide

**Project:** MediKiosk — AI-Powered Pre-Consultation Patient Case-Taking Software  
**Version:** MVP 1.0  
**Target:** SIH 2026 Internal Hackathon  
**Primary Goal:** Build one complete patient-to-doctor pre-consultation workflow that collects patient history, processes documents, generates an AI draft summary, and allows doctor review/edit/approval.

---

## 1. One-Line Product Definition

MediKiosk is a hospital pre-consultation intake platform that helps patients provide clinical history and documents before consultation, then gives doctors a structured, AI-assisted draft summary for faster review.

---

## 2. Core Principle

```text
AI assists.
Doctor verifies.
Doctor decides.
```

MediKiosk must never claim to diagnose, prescribe, or replace doctors.

---

## 3. Final MVP Objective

The MVP must demonstrate this complete workflow:

```text
Patient selects language
        ↓
Patient registers or is identified
        ↓
New visit session is created
        ↓
Patient enters chief complaint
        ↓
Patient answers guided symptom questions
        ↓
Patient enters medical history
        ↓
Patient uploads medical document
        ↓
OCR extracts document text or fallback output is used
        ↓
AI generates structured draft summary
        ↓
Doctor logs in
        ↓
Doctor views submitted sessions
        ↓
Doctor opens patient case
        ↓
Doctor reviews patient info, history, documents, OCR, and AI draft
        ↓
Doctor edits summary if required
        ↓
Doctor approves final summary
        ↓
Session status becomes reviewed
```

If this flow works reliably, the MVP is successful.

---

## 4. Problem Understanding

### 4.1 Real-World Problem

In high-volume Indian OPDs, doctors often get only a few minutes per patient. During this short time, they must:

- Understand the chief complaint
- Take clinical history
- Ask follow-up questions
- Review previous prescriptions and reports
- Examine the patient
- Counsel and prescribe

This causes:

- Incomplete history-taking
- Missed allergies or comorbidities
- Repeated questioning
- Poor use of previous records
- Increased doctor workload
- Longer waiting time and reduced consultation quality

### 4.2 Document Fragmentation Problem

Patients often carry:

- Prescriptions
- Lab reports
- Discharge summaries
- Handwritten notes
- Reports from multiple hospitals

These documents are usually unstructured, disordered, and difficult to review quickly.

### 4.3 Accessibility Problem

Many digital health tools assume patients have:

- Smartphone access
- Digital literacy
- Stable internet
- Prior app onboarding

MediKiosk must instead support a simple kiosk-style patient flow using large buttons, guided questions, touch input, text input, and later voice support.

---

## 5. Target Users

| User | Purpose | MVP Access |
|---|---|---|
| Patient | Provides personal details, complaint, history, and documents | Kiosk/session flow, no full login required for MVP |
| Doctor | Reviews submitted patient cases and approves summaries | Supabase Auth login |
| AI/OCR System | Assists with OCR, extraction, red flags, and draft summary | Backend/Edge Function/service |
| Admin/Database Maintainer | Manages schema, demo data, storage, and RLS | Supabase dashboard/manual setup |

---

## 6. MVP Scope

## 6.1 P0 Must-Have Features

These must be implemented before demo polish.

| Area | Feature | Required |
|---|---|---|
| Patient | Welcome screen | Yes |
| Patient | Language selection: English/Hindi | Yes |
| Patient | Patient registration/search | Yes |
| Patient | Session creation | Yes |
| Patient | Chief complaint capture | Yes |
| Patient | Guided symptom questions | Yes |
| Patient | Medical history form | Yes |
| Patient | Document upload | Yes |
| Patient | Review and submit | Yes |
| AI/OCR | OCR processing or reliable fallback | Yes |
| AI/OCR | AI draft summary or reliable fallback | Yes |
| Doctor | Doctor login | Yes |
| Doctor | Submitted session dashboard | Yes |
| Doctor | Patient case review page | Yes |
| Doctor | AI summary edit | Yes |
| Doctor | Approval action | Yes |
| Database | Supabase schema integration | Yes |
| Storage | Private medical document storage | Yes |

---

## 6.2 P1 Features After P0

Build only after the complete P0 flow works.

- Red-flag detection
- Better OCR extraction
- Medicine extraction
- Doctor search/filter
- Simple analytics
- Better bilingual UI
- Previous session history
- Document timeline

---

## 6.3 Out of MVP Scope

The MVP must not attempt:

- Autonomous diagnosis
- Prescription generation
- Replacing doctors
- Full HIS integration
- Real ABDM/ABHA integration
- Aadhaar authentication
- Full EMR functionality
- All Indian languages
- Perfect handwritten OCR
- Autonomous AYUSH diagnosis
- Payment, billing, or appointment management

---

## 7. Final Product Modules

| Module ID | Module | Owner Type | Description |
|---|---|---|---|
| M01 | Patient Identification | Frontend + Backend | Register/search patient |
| M02 | Session Management | Backend + DB | Create one visit session per consultation |
| M03 | Chief Complaint | Frontend + Backend | Capture complaint by text/touch, voice later |
| M04 | Guided Case-Taking | Frontend + AI | Ask complaint-based follow-up questions |
| M05 | Medical History | Frontend + DB | Capture past history, meds, allergies, surgery, family history |
| M06 | Document Upload | Frontend + Storage | Upload prescription/report/discharge summary |
| M07 | OCR Processing | AI + Backend | Extract document text and structured info |
| M08 | AI Draft Summary | AI + Backend | Generate doctor-ready draft summary |
| M09 | Patient Review/Submit | Frontend + Backend | Submit completed intake |
| M10 | Doctor Authentication | Frontend + Supabase | Login doctor |
| M11 | Doctor Dashboard | Frontend + Backend | View submitted sessions |
| M12 | Doctor Case Review | Frontend + Backend | Review patient info, history, documents, AI draft |
| M13 | Doctor Edit/Approval | Frontend + Backend | Edit final summary and approve |
| M14 | AYUSH Extension | Optional | Keep only as future/optional |
| M15 | Database/Security | Supabase | Tables, RLS, storage policies |
| M16 | Testing/QA | QA | Validate full end-to-end workflow |

---

## 8. Final Architecture

```text
Patient / Doctor Browser UI
        ↓
React Frontend
        ↓
Supabase JavaScript Client
        ↓
Supabase Auth + PostgreSQL + Storage
        ↓
Optional Supabase Edge Functions / AI Service
        ↓
OCR + AI Summary + Fallback Logic
```

### 8.1 Technology Stack

| Layer | Final MVP Choice |
|---|---|
| Frontend | React + Vite |
| Styling | Existing CSS modules / component CSS |
| Backend | Supabase-first backend |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth for doctors |
| Storage | Supabase Storage private bucket |
| AI/OCR | JS/Python service, Supabase Edge Function, or mock fallback |
| Deployment | Local or Vercel/Netlify frontend + hosted Supabase |

---

## 9. Final Database Schema

Use the existing Supabase/PostgreSQL schema with these core tables.

## 9.1 Tables

| Table | Purpose |
|---|---|
| `patients` | Permanent patient identity |
| `sessions` | One visit/session per consultation |
| `medical_history` | Structured history for a session |
| `question_responses` | Guided question answers |
| `documents` | Uploaded document metadata and OCR result |
| `medicines` | Medicines extracted from documents |
| `doctors` | Doctor profile linked to Supabase Auth |
| `ai_summaries` | AI draft and doctor-approved summary |
| `ayush_assessments` | Optional AYUSH extension |

---

## 9.2 Entity Relationships

```text
patients 1 ─── many sessions

sessions 1 ─── 1 medical_history
sessions 1 ─── many question_responses
sessions 1 ─── many documents
documents 1 ─── many medicines
sessions 1 ─── 1 ai_summaries
sessions 1 ─── 0/1 ayush_assessments
doctors 1 ─── many approved ai_summaries
```

---

## 9.3 Required Session Status Values

Only use these database values:

```text
in_progress
submitted
reviewed
```

| DB Status | UI Label |
|---|---|
| `in_progress` | Intake In Progress |
| `submitted` | Waiting for Review |
| `reviewed` | Reviewed |

---

## 9.4 Important Schema Rules

- `patients.patient_id` should be human-readable, e.g. `MK-10001`.
- `sessions.session_id` should be UUID.
- One patient can have many sessions.
- One session belongs to exactly one patient.
- One session can have one medical history record.
- One session can have multiple documents.
- OCR-extracted medicines must be separate from patient-reported current medications.
- AI draft and doctor summary must both be stored.
- Doctor approval must record `approved_by` and `approved_at`.

---

## 10. Key Data Objects

### 10.1 Patient

```json
{
  "patient_id": "MK-10001",
  "full_name": "Rahul Sharma",
  "age": 24,
  "gender": "Male",
  "phone": "9876543210",
  "preferred_language": "Hindi"
}
```

### 10.2 Session

```json
{
  "session_id": "uuid",
  "patient_id": "MK-10001",
  "visit_date": "2026-09-05T10:00:00Z",
  "department": "General Medicine",
  "language_used": "Hindi",
  "chief_complaint": "I have had a headache for three days.",
  "complaint_category": "Headache",
  "consent_given": true,
  "red_flag": false,
  "red_flag_reason": null,
  "status": "submitted"
}
```

### 10.3 Medical History

```json
{
  "session_id": "uuid",
  "history_present_illness": "Headache for three days, moderate severity.",
  "past_medical_history": "No known chronic disease.",
  "current_medications": "Paracetamol taken once yesterday.",
  "past_surgical_history": "None",
  "allergies": "No known drug allergy",
  "family_history": "No significant family history",
  "personal_history": "Normal diet and sleep",
  "review_of_systems": "No vomiting, no loss of consciousness",
  "voice_transcript": "Optional original transcript"
}
```

### 10.4 Document

```json
{
  "document_id": "uuid",
  "session_id": "uuid",
  "document_type": "Prescription",
  "file_url": "medical-documents/session_id/document_id-file.pdf",
  "ocr_text": "Extracted OCR text",
  "extracted_info": {},
  "document_date": "2026-09-01",
  "ocr_confidence": 88.5
}
```

### 10.5 Medicine Extracted From OCR

```json
{
  "medicine_id": "uuid",
  "document_id": "uuid",
  "medicine_name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "duration": "3 days",
  "confidence": 86.0
}
```

### 10.6 AI Summary

```json
{
  "summary_id": "uuid",
  "session_id": "uuid",
  "ai_summary": "Draft structured clinical summary...",
  "doctor_summary": null,
  "timeline_json": {},
  "doctor_edited": false,
  "approved_by": null,
  "approved_at": null
}
```

---

## 11. Final API / Service Contract

Because the current project uses Supabase-first architecture, these can be implemented as:

- Supabase client operations
- Backend service functions
- Supabase Edge Functions
- Mock services initially

Keep these service names/contracts stable for frontend integration.

---

## 11.1 Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errorCode": "ERROR_CODE",
  "data": null
}
```

---

## 11.2 Patient Services

| Action | Suggested Function/Endpoint |
|---|---|
| Create patient | `createPatient(payload)` / `POST /api/patients` |
| Search patient | `searchPatient(query)` / `GET /api/patients` |
| Get patient | `getPatient(patientId)` / `GET /api/patients/{patientId}` |

Create patient input:

```json
{
  "full_name": "Rahul Sharma",
  "age": 24,
  "gender": "Male",
  "phone": "9876543210",
  "preferred_language": "Hindi"
}
```

---

## 11.3 Session Services

| Action | Suggested Function/Endpoint |
|---|---|
| Create session | `createSession(payload)` / `POST /api/sessions` |
| Get session | `getSession(sessionId)` / `GET /api/sessions/{sessionId}` |
| Update complaint | `updateComplaint(sessionId, payload)` / `PATCH /api/sessions/{sessionId}/complaint` |
| Submit session | `submitSession(sessionId)` / `POST /api/sessions/{sessionId}/submit` |

---

## 11.4 Question Services

| Action | Suggested Function/Endpoint |
|---|---|
| Save question response | `saveQuestionResponse(sessionId, payload)` |
| Get question responses | `getQuestionResponses(sessionId)` |
| Generate questions | `generateQuestions(complaintCategory)` |

---

## 11.5 Medical History Services

| Action | Suggested Function/Endpoint |
|---|---|
| Save history | `saveMedicalHistory(sessionId, payload)` |
| Update history | `updateMedicalHistory(sessionId, payload)` |
| Get history | `getMedicalHistory(sessionId)` |

---

## 11.6 Document Services

| Action | Suggested Function/Endpoint |
|---|---|
| Upload document | `uploadDocument(sessionId, file, documentType)` |
| Get documents | `getDocuments(sessionId)` |
| Process OCR | `processDocumentOcr(documentId)` |

OCR response:

```json
{
  "success": true,
  "message": "OCR processed successfully",
  "data": {
    "ocrText": "Extracted text...",
    "ocrConfidence": 88.5,
    "extractedInfo": {},
    "medicines": [
      {
        "medicineName": "Paracetamol",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "3 days",
        "confidence": 86.0
      }
    ]
  }
}
```

---

## 11.7 AI Summary Services

| Action | Suggested Function/Endpoint |
|---|---|
| Generate summary | `generateAiSummary(sessionId)` |
| Get summary | `getAiSummary(sessionId)` |
| Update doctor summary | `updateDoctorSummary(sessionId, doctorSummary)` |
| Approve summary | `approveSummary(sessionId)` |

AI summary response:

```json
{
  "success": true,
  "message": "AI draft summary generated",
  "data": {
    "aiSummary": "Draft structured patient summary...",
    "timeline": {},
    "redFlag": false,
    "redFlagReason": null
  }
}
```

Fallback response:

```json
{
  "success": true,
  "message": "Fallback summary generated",
  "data": {
    "aiSummary": "Patient submitted intake information. Doctor should review chief complaint, medical history, and uploaded documents.",
    "timeline": {},
    "redFlag": false,
    "redFlagReason": null
  }
}
```

---

## 11.8 Doctor Services

| Action | Suggested Function/Endpoint |
|---|---|
| Doctor login | Supabase Auth |
| Get doctor profile | `getDoctorProfile(authUserId)` |
| Get submitted sessions | `getDoctorSessions({ status })` |
| Get review case | `getDoctorSessionReview(sessionId)` |
| Update summary | `updateDoctorSummary(sessionId, payload)` |
| Approve case | `approveSession(sessionId)` |

Recommended doctor review response:

```json
{
  "session": {},
  "patient": {},
  "medical_history": {},
  "question_responses": [],
  "documents": [],
  "medicines": [],
  "ai_summary": {}
}
```

---

## 12. Frontend Screen Plan

## 12.1 Patient Screens

| Screen No. | Screen | Status |
|---|---|---|
| P01 | Welcome | Existing |
| P02 | Language Selection | Existing |
| P03 | Patient Registration/Search | Existing basic |
| P04 | Chief Complaint | Existing basic |
| P05 | Guided Symptom Assessment | Existing basic |
| P06 | Medical History | To build |
| P07 | Document Upload | To build |
| P08 | Review Information | To build |
| P09 | Submission Success | To build |

---

## 12.2 Doctor Screens

| Screen No. | Screen | Status |
|---|---|---|
| D01 | Doctor Login | To build |
| D02 | Doctor Dashboard | To build |
| D03 | Submitted Session List | To build |
| D04 | Patient Case Review | To build |
| D05 | Document/OCR Review | To build |
| D06 | AI Draft Summary | To build |
| D07 | Edit Summary | To build |
| D08 | Approval Confirmation | To build |

---

## 12.3 UI Requirements

Patient UI:

- Large buttons
- Simple instructions
- Minimal typing
- Clear progress indicator
- Hindi/English support
- No medical jargon where possible
- Friendly validation errors

Doctor UI:

- Fast scanning layout
- Patient details at top
- Chief complaint prominently visible
- Red-flag badge if any
- AI summary clearly marked as draft
- Original document accessible
- OCR text shown separately
- Edit and approve actions obvious

---

## 13. AI/OCR Plan

## 13.1 AI Responsibilities

| AI Function | MVP Strategy |
|---|---|
| Guided questions | Rule-based question bank |
| Red-flag detection | Keyword/rule-based |
| OCR | Real OCR if ready, otherwise controlled mock |
| Medicine extraction | Regex/rule-based extraction from OCR text |
| Draft summary | Template-based or LLM-based with fallback |

---

## 13.2 Supported Complaint Categories

Use these in MVP:

```text
Fever
Headache
Cough
Abdominal Pain
General Weakness
Other
```

---

## 13.3 Red-Flag Examples

| Complaint | Red Flag Examples |
|---|---|
| Chest pain | Breathlessness, sweating, radiation to arm/jaw |
| Headache | Sudden severe headache, weakness, unconsciousness |
| Fever | Very high fever, confusion, stiff neck |
| Abdominal pain | Severe pain, blood vomiting, pregnancy-related emergency |
| Cough | Breathlessness, blood in sputum, low oxygen symptoms |

Red flags should only create an alert. They must not create a diagnosis.

---

## 13.4 AI Summary Format

The AI draft summary should follow this structure:

```text
AI Draft Clinical Summary

Patient:
- Name:
- Age/Gender:
- Patient ID:

Chief Complaint:
-

History of Present Illness:
-

Associated Symptoms:
-

Past Medical History:
-

Current Medications:
-

Allergies:
-

Past Surgical History:
-

Family History:
-

Uploaded Documents Reviewed:
-

OCR/Extracted Findings:
-

Red Flag Notes:
-

Doctor Verification Required:
This is an AI-generated draft. Doctor must verify before use.
```

---

## 14. Business Rules

## 14.1 Clinical Safety Rules

| Rule ID | Rule |
|---|---|
| BR-001 | MediKiosk is a pre-consultation intake system, not a diagnostic system. |
| BR-002 | AI output must always be shown as draft. |
| BR-003 | Doctor is the final authority. |
| BR-004 | AI must not generate prescriptions. |
| BR-005 | AI must not present confirmed diagnosis. |
| BR-006 | Doctor-reviewed summary must be stored separately from AI draft where possible. |

---

## 14.2 Patient Rules

| Rule ID | Rule |
|---|---|
| BR-007 | A patient may have multiple sessions. |
| BR-008 | Every new visit creates a new session. |
| BR-009 | Existing patient should not be duplicated unnecessarily. |
| BR-010 | Patient ID is system-generated and permanent. |
| BR-011 | Duplicate mobile numbers are allowed. |
| BR-012 | Age must be between 0 and 130. |
| BR-013 | Gender values: Male, Female, Other. |

---

## 14.3 Session Rules

| Rule ID | Rule |
|---|---|
| BR-014 | Every session belongs to exactly one patient. |
| BR-015 | Chief complaint is required before submission. |
| BR-016 | Session status values: `in_progress`, `submitted`, `reviewed`. |
| BR-017 | Submitted sessions become visible to doctors. |
| BR-018 | Reviewed means doctor has approved the final summary. |

---

## 14.4 Document Rules

| Rule ID | Rule |
|---|---|
| BR-019 | Uploaded documents belong to one session. |
| BR-020 | Supported document types: Prescription, Lab Report, Discharge Summary. |
| BR-021 | Supported formats: JPG, JPEG, PNG, PDF. |
| BR-022 | Original uploaded document remains authoritative. |
| BR-023 | OCR output is not verified clinical fact. |
| BR-024 | OCR-extracted medicines are separate from patient-reported medicines. |

---

## 14.5 Approval Rules

| Rule ID | Rule |
|---|---|
| BR-025 | Only authenticated active doctors can approve summaries. |
| BR-026 | Approval records `approved_by` and `approved_at`. |
| BR-027 | On approval, session status becomes `reviewed`. |
| BR-028 | Approval does not mean AI diagnosed the patient. |

---

## 15. Supabase Storage Plan

### Bucket

```text
medical-documents
```

### Path Format

```text
medical-documents/{session_id}/{document_id}-{file_name}
```

### Storage Rules

- Bucket should be private.
- Medical documents must not use public URLs.
- Doctors should access files through signed URLs or controlled policy.
- Original document must remain available even if OCR fails.

---

## 16. Security Requirements

For MVP:

- Never commit `.env` files.
- Never expose Supabase service role key in frontend.
- Frontend should only use Supabase anon key.
- Doctor login must use Supabase Auth.
- Doctor-only routes must be protected.
- Medical files should be private.
- RLS should be enabled if integration time allows.

Minimum RLS intent:

| Table | Patient/Kiosk | Doctor |
|---|---|---|
| `patients` | Create/search limited data | Read relevant data |
| `sessions` | Create/update active intake | Read submitted/reviewed |
| `medical_history` | Insert/update active session | Read |
| `documents` | Insert active session | Read |
| `ai_summaries` | Created by AI/backend | Read/edit/approve |
| `doctors` | No patient access | Own profile |

---

## 17. Team Work Allocation

| Member | Primary Responsibility | Secondary Responsibility |
|---|---|---|
| Divyanshu | Architecture, integration, API/service contracts | Supabase functions |
| Shreya | Supabase database, RLS, storage | Seed data and schema validation |
| Shobhit | Patient frontend | Patient UI/UX and mock services |
| Sugandh | Doctor frontend | Dashboard, review, approval UI |
| Suryansh | AI/OCR pipeline | AI fallback and prompts |
| Sagar | Testing/QA | Integration testing and demo validation |

---

## 18. Parallel Development Strategy

```text
Shared schema + service contracts
        ↓
Frontend builds with mock data
        ↓
Supabase schema/storage setup
        ↓
AI/OCR builds mock interface
        ↓
Connect real Supabase operations
        ↓
Integrate AI/OCR fallback
        ↓
Full end-to-end testing
        ↓
Demo polish
```

Frontend should not wait for backend/AI. Use mock services first, then replace internals with real Supabase calls.

---

## 19. Recommended Frontend Service Structure

Create these service files:

```text
frontend/src/services/patientService.js
frontend/src/services/sessionService.js
frontend/src/services/questionService.js
frontend/src/services/medicalHistoryService.js
frontend/src/services/documentService.js
frontend/src/services/aiSummaryService.js
frontend/src/services/doctorService.js
frontend/src/services/supabaseClient.js
```

Each service should initially support mock mode.

Example pattern:

```text
UI Component
   ↓
service function
   ↓
mock data OR Supabase implementation
```

The UI should not directly contain database logic.

---

## 20. Development Phases

## Phase 1 — Foundation

Duration: 0.5–1 day

Tasks:

- Finalize this guide as source of truth
- Confirm database schema
- Configure Supabase project
- Configure `.env`
- Create private storage bucket
- Add demo doctor user
- Create service layer structure
- Add mock data for patient and doctor flows

Exit criteria:

- App runs locally
- Supabase client configured
- Team agrees on data contracts

---

## Phase 2 — Patient Workflow

Duration: 1–2 days

Tasks:

- Complete patient registration/search
- Create session
- Save chief complaint
- Save guided question responses
- Build medical history form
- Build document upload screen
- Build patient review screen
- Submit session as `submitted`

Exit criteria:

- Patient can complete intake from start to submission

---

## Phase 3 — Doctor Workflow

Duration: 1–2 days

Tasks:

- Build doctor login
- Build doctor dashboard
- Show submitted sessions
- Build full case review page
- Show patient info, questions, history, documents, OCR, AI summary
- Edit doctor summary
- Approve summary
- Update session status to `reviewed`

Exit criteria:

- Doctor can review and approve one submitted case

---

## Phase 4 — AI/OCR Integration

Duration: 1–2 days

Tasks:

- Add OCR or controlled OCR mock
- Store OCR text in documents table
- Extract medicine data if possible
- Generate AI draft summary
- Add fallback summary if AI fails
- Add red-flag detection if time allows

Exit criteria:

- AI draft appears for doctor review, even if fallback is used

---

## Phase 5 — Testing and Demo Polish

Duration: 0.5–1 day

Tasks:

- Test full demo 5 times
- Fix UI breakages
- Add loading/error/empty states
- Add realistic demo data
- Prepare pitch script
- Record backup demo video
- Keep screenshots ready

Exit criteria:

- Demo works without relying on perfect internet or AI response

---

## 21. Testing Checklist

## 21.1 Patient Flow Tests

- [ ] Welcome screen opens
- [ ] Language can be selected
- [ ] New patient can be registered
- [ ] Invalid age is blocked
- [ ] Invalid mobile number is handled
- [ ] Existing patient can be searched or mocked
- [ ] Session is created
- [ ] Chief complaint is required
- [ ] Guided questions save answers
- [ ] Medical history saves correctly
- [ ] Document upload works or mock works
- [ ] Review screen shows collected data
- [ ] Submit changes status to `submitted`

---

## 21.2 AI/OCR Tests

- [ ] OCR success stores extracted text
- [ ] OCR failure keeps original document
- [ ] Medicine extraction does not overwrite patient-reported medicines
- [ ] AI summary generation works
- [ ] AI fallback works
- [ ] AI summary clearly says draft
- [ ] Red-flag alert does not claim diagnosis

---

## 21.3 Doctor Flow Tests

- [ ] Doctor login works
- [ ] Invalid login fails safely
- [ ] Dashboard shows submitted sessions
- [ ] Doctor opens patient case
- [ ] Patient info visible
- [ ] Medical history visible
- [ ] Documents visible
- [ ] OCR text visible
- [ ] AI draft visible
- [ ] Doctor can edit summary
- [ ] Doctor can approve summary
- [ ] `approved_by` and `approved_at` are stored
- [ ] Session status becomes `reviewed`

---

## 21.4 Security Tests

- [ ] No secrets committed
- [ ] Service role key not in frontend
- [ ] Medical document bucket is not public
- [ ] Doctor routes are protected
- [ ] Unauthorized users cannot approve

---

## 22. Demo Script

### 22.1 Pitch Flow

```text
Problem:
Doctors in high-volume OPDs do not have enough time for detailed history-taking.

Impact:
Important symptoms, medications, allergies, and old records may be missed.

Solution:
MediKiosk collects patient history before consultation using a guided workflow.

Demo:
Patient submits intake → document upload → OCR/AI summary → doctor review → doctor edit → approval.

Safety:
AI only assists. Doctor verifies and decides.

Impact:
Saves consultation time, improves data quality, and gives doctors a better starting point.
```

---

## 22.2 Recommended Demo Case

Patient:

```text
Rahul Sharma, 24 years, Male
Chief complaint: Headache for 3 days
Symptoms: Moderate pain, dizziness, no vomiting, no breathing issue
Past history: No chronic disease
Medication: Took Paracetamol once
Allergy: No known allergy
Uploaded document: Previous prescription
```

AI draft should summarize:

- Patient details
- Headache duration/severity
- Associated symptoms
- No known allergy
- Medication taken
- Uploaded prescription OCR text
- Doctor verification required

---

## 23. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| AI not ready | Demo breaks | Use deterministic fallback summary |
| OCR inaccurate | Weak document demo | Use curated demo document and fallback OCR text |
| Supabase RLS blocks development | Integration delay | Use controlled policies first; harden later |
| Too many features | Core flow incomplete | Build only P0 first |
| Doctor UI incomplete | Demo cannot finish | Build simple review/approve page first |
| Storage public accidentally | Privacy issue | Keep bucket private |
| API/service mismatch | Integration delay | Follow this guide as source of truth |
| Internet issue | Live demo risk | Keep local fallback/screenshots/video |

---

## 24. Definition of Done

A feature is done only when:

- [ ] UI is complete
- [ ] Data is saved or mocked through service layer
- [ ] Validation exists
- [ ] Loading state exists
- [ ] Error state exists
- [ ] It works in the full flow
- [ ] It follows business rules
- [ ] It does not violate AI safety boundaries

The MVP is done only when:

- [ ] Patient intake works end-to-end
- [ ] Document upload/OCR or fallback works
- [ ] AI draft/fallback works
- [ ] Doctor login works
- [ ] Doctor review works
- [ ] Doctor edit works
- [ ] Doctor approval works
- [ ] Session becomes `reviewed`
- [ ] AI is clearly marked as draft
- [ ] Demo can be completed in 5–7 minutes

---

## 25. Final Implementation Priority

If time is limited, build in this exact order:

1. Patient registration/session flow
2. Chief complaint and guided questions
3. Medical history
4. Patient review and submit
5. Doctor login/dashboard
6. Doctor case review page
7. AI draft fallback
8. Doctor edit and approval
9. Document upload
10. OCR/mock OCR
11. Red flags
12. UI polish
13. AYUSH optional extension

Do not build optional features before the patient-to-doctor approval flow works.

---

## 26. Final Team Rule

All team members must work from this file as the single MVP source of truth.

```text
Contract first.
Mock first.
Integrate gradually.
Protect the core flow.
Demo one complete journey.
```

**MediKiosk does not replace the doctor. It prepares better information for the doctor.**