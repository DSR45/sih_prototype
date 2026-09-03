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
| `created_at`         | TIMESTAMP    | Login Time         |


---

## Table: `sessions`

Each hospital visit is stored as a separate session.

| Column          | Type        | Description           |
| --------------- | ----------- | --------------------- |
| `session_id`    | UUID (PK)   | Visit ID              |
| `patient_id`    | TEXT (FK)   | References `patients` |
| `visit_date`    | TIMESTAMP   | Visit time            |
| `department`    | VARCHAR(50) | OPD/AYUSH             |
| `language_used` | VARCHAR(30) | Conversation language |
| `consent_given` | BOOLEAN     | Patient consent       |
| `red_flag`      | BOOLEAN     | Emergency indicator   |
| `status`        | VARCHAR(20) | Visit status          |

---

## Table: `medical_history`

Stores structured medical history for each session.

| Column | Type |
|--------|------|
| `history_id` | UUID (PK) |
| `session_id` | UUID (FK) |
| `chief_complaint` | TEXT |
| `history_present_illness` | TEXT |
| `past_medical_history` | TEXT |
| `past_surgical_history` | TEXT |
| `current_medications` | TEXT |
| `allergies` | TEXT |
| `family_history` | TEXT |
| `personal_history` | TEXT |
| `review_of_systems` | TEXT |
| `voice_transcript` | TEXT |

---

## Table: `ayush_assessment`

Optional AYUSH-specific assessment linked to a session.

| Column | Type |
|--------|------|
| `assessment_id` | UUID (PK) |
| `session_id` | UUID (FK) |
| `prakriti` | VARCHAR(30) |
| `vikriti` | VARCHAR(30) |
| `agni` | VARCHAR(30) |
| `koshtha` | VARCHAR(30) |
| `ahara` | TEXT |
| `vihara` | TEXT |
| `nidana` | TEXT |
| `samprapti_notes` | TEXT |
| `completed_at` | TIMESTAMP |

---

## Table: `documents`

Stores uploaded medical documents and OCR results.

| Column | Type |
|--------|------|
| `document_id` | UUID (PK) |
| `session_id` | UUID (FK) |
| `document_type` | VARCHAR(30) |
| `file_url` | TEXT |
| `ocr_text` | TEXT |
| `document_date` | DATE |
| `ocr_confidence` | DECIMAL(5,2) |
| `uploaded_at` | TIMESTAMP |

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

---

## Optional Table: `ai_summary`

Stores AI-generated doctor summaries.

| Column | Type |
|--------|------|
| `summary_id` | UUID (PK) |
| `session_id` | UUID (FK) |
| `doctor_summary` | TEXT |
| `timeline_json` | JSON |
| `doctor_edited` | BOOLEAN |
| `approved_at` | TIMESTAMP |

---

# SQL Schema

```sql
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    abha_id VARCHAR(20),
    full_name VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    phone VARCHAR(15),
    preferred_language VARCHAR(30),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    visit_date TIMESTAMP DEFAULT now(),
    department VARCHAR(50),
    language_used VARCHAR(30),
    consent_given BOOLEAN,
    red_flag BOOLEAN DEFAULT FALSE,
    status VARCHAR(20)
);

CREATE TABLE medical_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    chief_complaint TEXT,
    history_present_illness TEXT,
    past_medical_history TEXT,
    past_surgical_history TEXT,
    current_medications TEXT,
    allergies TEXT,
    family_history TEXT,
    personal_history TEXT,
    review_of_systems TEXT,
    voice_transcript TEXT
);

CREATE TABLE ayush_assessment (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    prakriti VARCHAR(30),
    vikriti VARCHAR(30),
    agni VARCHAR(30),
    koshtha VARCHAR(30),
    ahara TEXT,
    vihara TEXT,
    nidana TEXT,
    samprapti_notes TEXT,
    completed_at TIMESTAMP DEFAULT now()
);

CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    document_type VARCHAR(30),
    file_url TEXT,
    ocr_text TEXT,
    document_date DATE,
    ocr_confidence DECIMAL(5,2),
    uploaded_at TIMESTAMP DEFAULT now()
);

CREATE TABLE medicines (
    medicine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(document_id),
    medicine_name VARCHAR(100),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    confidence DECIMAL(5,2)
);

CREATE TABLE ai_summary (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    doctor_summary TEXT,
    timeline_json JSON,
    doctor_edited BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP
);
```

---

## Feature Mapping

| Feature | Supporting Tables |
|---------|-------------------|
| Patient Records | `patients` |
| Visit History | `sessions` |
| Medical History | `medical_history` |
| AYUSH Snapshot | `ayush_assessment` |
| OCR Processing | `documents` |
| Medicine Timeline | `medicines` |
| AI Doctor Summary | `ai_summary` |
| Emergency Red Flag | `sessions` |
