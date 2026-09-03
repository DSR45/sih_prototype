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