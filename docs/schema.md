# MediKiosk – Final Database Schema
## SIH26047 Prototype | Supabase PostgreSQL

---

# 1. Overview

This schema supports:

- AI-assisted patient case-taking
- Multilingual patient interaction
- Guided symptom questions
- Structured medical history
- Current medications, allergies, surgeries and family history
- Medical document upload and OCR
- AI-generated draft summaries
- Doctor review and approval
- Continuity of care across multiple visits
- AYUSH-specific assessment as an extension module

**Core principle:** One patient can have multiple visits, and each visit is stored as a separate session.

---

# 2. Core ER Model

```text
PATIENTS
    │ 1:M
    ▼
SESSIONS
    ├── MEDICAL_HISTORY (1:1)
    ├── QUESTION_RESPONSES (1:M)
    ├── DOCUMENTS (1:M) ──< MEDICINES (1:M)
    ├── AI_SUMMARIES (1:1) ── approved by DOCTORS
    └── AYUSH_ASSESSMENTS (0:1)
```

---

# 3. Relationship Summary

| Parent | Child | Relationship |
|---|---|---|
| Patient | Sessions | 1 : Many |
| Session | Medical History | 1 : 1 |
| Session | Question Responses | 1 : Many |
| Session | Documents | 1 : Many |
| Document | Medicines | 1 : Many |
| Session | AI Summary | 1 : 1 |
| Doctor | Approved Summaries | 1 : Many |
| Session | AYUSH Assessment | 0 : 1 |

---

# 4. Table Definitions

## `patients`

Stores permanent patient information.

| Column | Type | Description |
|---|---|---|
| patient_id | TEXT PK | Human-readable patient ID |
| full_name | VARCHAR(100) | Patient name |
| age | INT | Patient age for MVP |
| gender | TEXT | Male/Female/Other |
| phone | VARCHAR(15) | Contact number |
| preferred_language | VARCHAR(30) | Preferred language |
| created_at | TIMESTAMPTZ | Record creation time |

Example ID: `MK-10001`

---

## `sessions`

Stores every hospital or clinic visit separately.

| Column | Type |
|---|---|
| session_id | UUID PK |
| patient_id | TEXT FK |
| visit_date | TIMESTAMPTZ |
| department | VARCHAR(50) |
| language_used | VARCHAR(30) |
| chief_complaint | TEXT |
| complaint_category | VARCHAR(50) |
| consent_given | BOOLEAN |
| consent_timestamp | TIMESTAMPTZ |
| red_flag | BOOLEAN |
| red_flag_reason | TEXT |
| status | VARCHAR(20) |
| created_at | TIMESTAMPTZ |

MVP statuses:

- `in_progress`
- `submitted`
- `reviewed`

---

## `medical_history`

One structured medical history record per session.

| Column | Type |
|---|---|
| history_id | UUID PK |
| session_id | UUID FK UNIQUE |
| history_present_illness | TEXT |
| past_medical_history | TEXT |
| current_medications | TEXT |
| past_surgical_history | TEXT |
| allergies | TEXT |
| family_history | TEXT |
| personal_history | TEXT |
| review_of_systems | TEXT |
| voice_transcript | TEXT |
| created_at | TIMESTAMPTZ |

---

## `question_responses`

Stores guided questions and patient answers.

| Column | Type |
|---|---|
| response_id | UUID PK |
| session_id | UUID FK |
| question | TEXT |
| answer | TEXT |
| question_category | VARCHAR(50) |
| created_at | TIMESTAMPTZ |

Example:

```text
Question: When did your headache begin?
Answer: Three days ago.
```

---

## `documents`

Stores uploaded medical documents and OCR results.

| Column | Type |
|---|---|
| document_id | UUID PK |
| session_id | UUID FK |
| document_type | VARCHAR(30) |
| file_url | TEXT |
| ocr_text | TEXT |
| extracted_info | JSONB |
| document_date | DATE |
| ocr_confidence | DECIMAL(5,2) |
| uploaded_at | TIMESTAMPTZ |

Supported types:

- Prescription
- Lab Report
- Discharge Summary

---

## `medicines`

Stores medicines extracted from documents.

> This is different from `current_medications`, which are manually reported by the patient.

| Column | Type |
|---|---|
| medicine_id | UUID PK |
| document_id | UUID FK |
| medicine_name | VARCHAR(100) |
| dosage | VARCHAR(50) |
| frequency | VARCHAR(50) |
| duration | VARCHAR(50) |
| confidence | DECIMAL(5,2) |
| created_at | TIMESTAMPTZ |

---

## `doctors`

Stores doctor profiles.

Authentication should be handled by Supabase Auth rather than storing passwords.

| Column | Type |
|---|---|
| doctor_id | UUID PK |
| auth_user_id | UUID |
| full_name | VARCHAR(100) |
| email | VARCHAR(255) |
| specialization | VARCHAR(100) |
| department | VARCHAR(50) |
| phone | VARCHAR(15) |
| is_active | BOOLEAN |
| created_at | TIMESTAMPTZ |

Authentication flow:

```text
Doctor → Supabase Auth Login → auth_user_id → Doctor Profile
```

---

## `ai_summaries`

Stores the AI draft and doctor-reviewed summary.

| Column | Type |
|---|---|
| summary_id | UUID PK |
| session_id | UUID FK UNIQUE |
| ai_summary | TEXT |
| doctor_summary | TEXT |
| timeline_json | JSONB |
| doctor_edited | BOOLEAN |
| approved_by | UUID FK |
| approved_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

The AI output is always a draft and is not a confirmed diagnosis.

---

## `ayush_assessments`

Optional AYUSH extension linked to a session.

| Column | Type |
|---|---|
| assessment_id | UUID PK |
| session_id | UUID FK UNIQUE |
| prakriti | VARCHAR(30) |
| vikriti | VARCHAR(30) |
| agni | VARCHAR(30) |
| koshtha | VARCHAR(30) |
| ahara | TEXT |
| vihara | TEXT |
| nidana | TEXT |
| samprapti_notes | TEXT |
| completed_at | TIMESTAMPTZ |

### AYUSH MVP Rule

Do not randomly generate AYUSH classifications.

The intended flow is:

```text
AYUSH-specific questions
        ↓
Patient responses
        ↓
Structured assessment
        ↓
Practitioner review
```

For the internal SIH round, this module can remain a limited extension while the core workflow is fully functional.

---

# 5. Final Feature Mapping

| Feature | Supporting Tables |
|---|---|
| Patient identity | patients |
| Visit history | sessions |
| Chief complaint | sessions |
| Guided questions | question_responses |
| Medical history | medical_history |
| Current medications | medical_history |
| Allergies | medical_history |
| Previous surgeries | medical_history |
| Family history | medical_history |
| Document upload | documents |
| OCR processing | documents |
| OCR medicine extraction | medicines |
| Doctor login/profile | doctors + Supabase Auth |
| AI draft summary | ai_summaries |
| Doctor approval | ai_summaries |
| AYUSH extension | ayush_assessments |
| Emergency indicator | sessions |

---

# 6. SQL Schema

## Required Extension

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Patients

```sql
CREATE TABLE patients (
    patient_id TEXT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 0 AND age <= 130),
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(15),
    preferred_language VARCHAR(30) DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE patient_sequence START 10001;

CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_id IS NULL OR NEW.patient_id = '' THEN
        NEW.patient_id := 'MK-' || nextval('patient_sequence');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patient_id_trigger
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_patient_id();
```

## Sessions

```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    visit_date TIMESTAMPTZ DEFAULT NOW(),
    department VARCHAR(50),
    language_used VARCHAR(30),
    chief_complaint TEXT NOT NULL,
    complaint_category VARCHAR(50),
    consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    red_flag BOOLEAN DEFAULT FALSE,
    red_flag_reason TEXT,
    status VARCHAR(20) DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'submitted', 'reviewed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Medical History

```sql
CREATE TABLE medical_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    history_present_illness TEXT,
    past_medical_history TEXT,
    current_medications TEXT,
    past_surgical_history TEXT,
    allergies TEXT,
    family_history TEXT,
    personal_history TEXT,
    review_of_systems TEXT,
    voice_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Question Responses

```sql
CREATE TABLE question_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    question_category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Documents

```sql
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL
        CHECK (document_type IN ('Prescription', 'Lab Report', 'Discharge Summary')),
    file_url TEXT NOT NULL,
    ocr_text TEXT,
    extracted_info JSONB,
    document_date DATE,
    ocr_confidence DECIMAL(5,2)
        CHECK (ocr_confidence >= 0 AND ocr_confidence <= 100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Medicines

```sql
CREATE TABLE medicines (
    medicine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    confidence DECIMAL(5,2)
        CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Doctors

```sql
CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    department VARCHAR(50),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## AI Summaries

```sql
CREATE TABLE ai_summaries (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    ai_summary TEXT NOT NULL,
    doctor_summary TEXT,
    timeline_json JSONB,
    doctor_edited BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES doctors(doctor_id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## AYUSH Assessments

```sql
CREATE TABLE ayush_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    prakriti VARCHAR(30),
    vikriti VARCHAR(30),
    agni VARCHAR(30),
    koshtha VARCHAR(30),
    ahara TEXT,
    vihara TEXT,
    nidana TEXT,
    samprapti_notes TEXT,
    completed_at TIMESTAMPTZ
);
```

---

# 7. Recommended Indexes

```sql
CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_visit_date ON sessions(visit_date DESC);
CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_documents_session_id ON documents(session_id);
CREATE INDEX idx_medicines_document_id ON medicines(document_id);
CREATE INDEX idx_ai_summaries_approved_by ON ai_summaries(approved_by);
```

---

# 8. Final MVP Workflow

## Patient

```text
Select Language
      ↓
Find Existing Patient / Register New Patient
      ↓
Create Session
      ↓
Describe Chief Complaint
      ↓
Voice / Text Input
      ↓
Guided Questions
      ↓
Medical History
      ↓
Current Medications
      ↓
Allergies
      ↓
Previous Surgeries
      ↓
Family History
      ↓
Document Upload
      ↓
Submit Case
```

## AI

```text
Patient Data
      +
Question Responses
      +
Medical History
      +
Document OCR
      ↓
AI Processing
      ↓
Structured Draft Summary
```

## Doctor

```text
Doctor Login
      ↓
Patient / Session List
      ↓
Open Patient Session
      ↓
Review Structured Information
      ↓
Review Documents
      ↓
Review AI Draft
      ↓
Edit if Required
      ↓
Approve Summary
      ↓
Session Status → reviewed
```

---

# 9. Internal SIH MVP Scope

## Must Be Functional

- Patient registration and identification
- Multiple sessions per patient
- Chief complaint collection
- Guided questions
- Medical history
- Current medications
- Allergies
- Previous surgeries
- Family history
- Document upload
- Basic OCR
- AI-generated draft summary
- Doctor dashboard
- Doctor editing and approval

## AYUSH Strategy

- Keep the AYUSH module in the architecture.
- Implement a small AYUSH-specific pathway only if time permits.
- Do not claim autonomous AYUSH diagnosis.
- Expand validated AYUSH workflows later.

---

# 10. Scope Boundaries

The MVP does not provide:

- Autonomous diagnosis
- Prescription generation
- Replacement of doctors or AYUSH practitioners
- Full HIS integration
- Real ABDM or ABHA integration
- Aadhaar authentication
- Full EMR functionality
- All Indian languages
- Perfect handwritten prescription recognition
- Autonomous AYUSH classification without validated assessment logic

---

# 11. Final Architecture Principle

MediKiosk follows:

```text
Patient
   ↓
Visit Session
   ↓
AI-Assisted Case Taking
   ↓
Structured Information
   ↓
Doctor / Practitioner Review
```

AYUSH-specific functionality is an extension of the core workflow. This keeps the prototype achievable within the hackathon timeline while preserving a clear path for deeper AYUSH integration later.
