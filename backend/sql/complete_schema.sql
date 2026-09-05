-- MediKiosk Complete Database Schema
-- Generated: 2026-09-04
-- Database: Supabase PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- PATIENTS TABLE
-- ============================================

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

-- ============================================
-- SESSIONS TABLE
-- ============================================

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

-- ============================================
-- MEDICAL HISTORY TABLE
-- ============================================

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

-- ============================================
-- QUESTION RESPONSES TABLE
-- ============================================

CREATE TABLE question_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    question_category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================

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

-- ============================================
-- MEDICINES TABLE
-- ============================================

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

-- ============================================
-- DOCTORS TABLE
-- ============================================

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

-- ============================================
-- AI SUMMARIES TABLE
-- ============================================

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

-- ============================================
-- AYUSH ASSESSMENTS TABLE (OPTIONAL)
-- ============================================

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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_visit_date ON sessions(visit_date DESC);
CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_documents_session_id ON documents(session_id);
CREATE INDEX idx_medicines_document_id ON medicines(document_id);
CREATE INDEX idx_ai_summaries_approved_by ON ai_summaries(approved_by);