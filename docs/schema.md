# Database Schema (Supabase PostgreSQL)

## Overview

This schema is designed for the SIH26047 prototype to support AI-assisted medical history collection, AYUSH assessments, OCR-based document processing, and continuity of care.

## ER Diagram

Patient (1) ────< Sessions (M)
                    │
                    ├── Medical_History (1)
                    ├── AYUSH_Assessment (0..1)
                    └── Documents (M)
                           │
                           └── Medicines (M)

---

## Table: `patients`

Stores permanent patient information.

| Column               | Type         | Description        |
| -------------------- | ------------ | ------------------ |
| `patient_id`         | TEXT (PK)    | Unique patient ID  |
| `full_name`          | VARCHAR(100) | Patient name       |
| `age`                | INT          | Age                |
| `gender`             | TEXT         | Male/Female/Other  |
| `phone`              | VARCHAR(15)  | Contact number     |
| `preferred_language` | VARCHAR(30)  | Preferred language |
| `created_at`         | TIMESTAMPTZ  | Login Time         |


---

## Table: `sessions`

Each hospital visit is stored as a separate session.

| Column               | Type        | Description           |
| -------------------- | ----------- | --------------------- |
| `session_id`         | UUID (PK)   | Visit ID              |
| `patient_id`         | TEXT (FK)   | References `patients` |
| `visit_date`         | TIMESTAMPTZ | Visit time            |
| `department`         | VARCHAR(50) | OPD/AYUSH             |
| `language_used`      | VARCHAR(30) | Conversation language |
| `chief_complaint`    | TEXT        | Main Complaint        |
| `complaint_category` | VARCHAR(50) | Category of complaint |
| `consent_given`      | BOOLEAN     | Patient consent       |
| `red_flag`           | BOOLEAN     | Emergency indicator   |
| `status`             | VARCHAR(20) | Visit status          |
| `created_at`         | TIMESTAMPTZ | Login time            |

---

## Table: `medical_history`

Stores structured medical history for each session.

| Column                    | Type        |
| ------------------------- | ----------- |
| `history_id`              | UUID (PK)   |
| `session_id`              | UUID (FK)   |
| `history_present_illness` | TEXT        |
| `past_medical_history`    | TEXT        |
| `past_surgical_history`   | TEXT        |
| `allergies`               | TEXT        |
| `family_history`          | TEXT        |
| `personal_history`        | TEXT        |
| `review_of_systems`       | TEXT        |
| `voice_transcript`        | TEXT        |
| `created_at`              | TIMESTAMPTZ |

---

## Table: `ayush_assessment`

Optional AYUSH-specific assessment linked to a session.

| Column            | Type        |
| ----------------- | ----------- |
| `assessment_id`   | UUID (PK)   |
| `session_id`      | UUID (FK)   |
| `prakriti`        | VARCHAR(30) |
| `vikriti`         | VARCHAR(30) |
| `agni`            | VARCHAR(30) |
| `koshtha`         | VARCHAR(30) |
| `ahara`           | TEXT        |
| `vihara`          | TEXT        |
| `nidana`          | TEXT        |
| `samprapti_notes` | TEXT        |
| `completed_at`    | TIMESTAMPTZ |

---

## Table: `documents`

Stores uploaded medical documents and OCR results.

| Column           | Type         |
| ---------------- | ------------ |
| `document_id`    | UUID (PK)    |
| `session_id`     | UUID (FK)    |
| `document_type`  | VARCHAR(30)  |
| `file_url`       | TEXT         |
| `ocr_text`       | TEXT         |
| `extracted_info` | JSONB        |
| `document_date`  | DATE         |
| `ocr_confidence` | DECIMAL(5,2) |
| `uploaded_at`    | TIMESTAMPTZ  |

### Supported Document Types

- Prescription
- Lab Report
- Discharge Summary

---

## Table: `medicines`

Stores medicines extracted from OCR.

| Column          | Type         |
| --------------- | ------------ |
| `medicine_id`   | UUID (PK)    |
| `document_id`   | UUID (FK)    |
| `medicine_name` | VARCHAR(100) |
| `dosage`        | VARCHAR(50)  |
| `frequency`     | VARCHAR(50)  |
| `duration`      | VARCHAR(50)  |
| `confidence`    | DECIMAL(5,2) |
| `created_at`    | TIMESTAMPTZ  |

---

## Table: `doctors`

Stores information about doctors.

| Column           | Type         |
| ---------------- | ------------ |
| `doctor_id`      | UUID (PK)    |
| `full_name`      | VARCHAR(100) |
| `email`          | VARCHAR(255) |
| `specialization` | VARCHAR(100) |
| `department`     | VARCHAR(50)  |
| `phone`          | VARCHAR(15)  |
| `is_active`      | BOOLEAN      |
| `created_at`     | TIMESTAMPTZ  |

---

## Optional Table: `ai_summary`

Stores AI-generated doctor summaries.

| Column           | Type        |
| ---------------- | ----------- |
| `summary_id`     | UUID (PK)   |
| `session_id`     | UUID (FK)   |
| `ai_summary`     | TEXT        |
| `doctor_summary` | TEXT        |
| `timeline_json`  | JSONB       |
| `doctor_edited`  | BOOLEAN     |
| `approved_by`    | UUID (FK)   |
| `approved_at`    | TIMESTAMP   |
| `created_at`     | TIMESTAMPTZ |

---

# SQL Schema

```sql
CREATE TABLE patients (
    patient_id TEXT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT,
    gender TEXT,
    phone VARCHAR(15),
    preferred_language VARCHAR(30) DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE patient_sequence START 10001;

CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_id IS NULL THEN
        NEW.patient_id := 'MK-' || nextval('patient_sequence');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patient_id_trigger
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_patient_id();

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    visit_date TIMESTAMPTZ DEFAULT NOW(),
    department VARCHAR(50),
    language_used VARCHAR(30),
    chief_complaint TEXT NOT NULL,
    complaint_category VARCHAR(50),
    consent_given BOOLEAN DEFAULT FALSE,
    red_flag BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medical_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    history_present_illness TEXT,
    past_medical_history TEXT,
    past_surgical_history TEXT,
    allergies TEXT,
    family_history TEXT,
    personal_history TEXT,
    review_of_systems TEXT,
    voice_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ayush_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    prakriti VARCHAR(30),
    vikriti VARCHAR(30),
    agni VARCHAR(30),
    koshtha VARCHAR(30),
    ahara TEXT,
    vihara TEXT,
    nidana TEXT,
    samprapti_notes TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL,
    file_url TEXT NOT NULL,
    ocr_text TEXT,
    extracted_info JSONB,
    document_date DATE,
    ocr_confidence DECIMAL(5,2),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medicines (
    medicine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    confidence DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    department VARCHAR(50),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_summary (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    ai_summary TEXT NOT NULL,
    doctor_summary TEXT,
    timeline_json JSONB,
    doctor_edited BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES doctors(doctor_id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Feature Mapping

| Feature            | Supporting Tables  |
| ------------------ | ------------------ |
| Patient Records    | `patients`         |
| Visit History      | `sessions`         |
| Medical History    | `medical_history`  |
| AYUSH Snapshot     | `ayush_assessment` |
| OCR Processing     | `documents`        |
| Medicine Timeline  | `medicines`        |
| AI Doctor Summary  | `ai_summary`       |
| Emergency Red Flag | `sessions`         |
| Doctor Records     | `doctors`          |
