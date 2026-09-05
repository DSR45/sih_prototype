-- MediKiosk Row Level Security Policies
-- These policies control data access based on user authentication and roles

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayush_assessments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PATIENTS TABLE POLICIES
-- ============================================

-- Allow kiosk/public to create new patients
CREATE POLICY "Allow patient creation"
    ON patients
    FOR INSERT
    WITH CHECK (true);

-- Allow kiosk/public to search patients (limited fields)
CREATE POLICY "Allow patient search"
    ON patients
    FOR SELECT
    USING (true);

-- Doctors can read patient information
CREATE POLICY "Doctors can view patients"
    ON patients
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM doctors
            WHERE doctors.auth_user_id = auth.uid()
            AND doctors.is_active = true
        )
    );

-- ============================================
-- SESSIONS TABLE POLICIES
-- ============================================

-- Allow kiosk to create sessions
CREATE POLICY "Allow session creation"
    ON sessions
    FOR INSERT
    WITH CHECK (true);

-- Allow kiosk to update in_progress sessions
CREATE POLICY "Allow in_progress session updates"
    ON sessions
    FOR UPDATE
    USING (status = 'in_progress');

-- Doctors can view submitted and reviewed sessions
CREATE POLICY "Doctors can view submitted sessions"
    ON sessions
    FOR SELECT
    USING (
        status IN ('submitted', 'reviewed')
        AND EXISTS (
            SELECT 1 FROM doctors
            WHERE doctors.auth_user_id = auth.uid()
            AND doctors.is_active = true
        )
    );

-- Doctors can update session status during review
CREATE POLICY "Doctors can update reviewed sessions"
    ON sessions
    FOR UPDATE
    USING (
        status = 'submitted'
        AND EXISTS (
            SELECT 1 FROM doctors
            WHERE doctors.auth_user_id = auth.uid()
            AND doctors.is_active = true
        )
    );

-- ============================================
-- MEDICAL HISTORY POLICIES
-- ============================================

-- Allow kiosk to create/update medical history for in_progress sessions
CREATE POLICY "Allow medical history creation"
    ON medical_history
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions
            WHERE sessions.session_id = medical_history.session_id
            AND sessions.status = 'in_progress'
        )
    );

CREATE POLICY "Allow medical history updates"
    ON medical_history
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            WHERE sessions.session_id = medical_history.session_id
            AND sessions.status = 'in_progress'
        )
    );

-- Doctors can view medical history
CREATE POLICY "Doctors can view medical history"
    ON medical_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = medical_history.session_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- ============================================
-- QUESTION RESPONSES POLICIES
-- ============================================

-- Allow kiosk to insert question responses
CREATE POLICY "Allow question response creation"
    ON question_responses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions
            WHERE sessions.session_id = question_responses.session_id
            AND sessions.status = 'in_progress'
        )
    );

-- Doctors can view question responses
CREATE POLICY "Doctors can view question responses"
    ON question_responses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = question_responses.session_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- ============================================
-- DOCUMENTS POLICIES
-- ============================================

-- Allow kiosk to upload documents
CREATE POLICY "Allow document upload"
    ON documents
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions
            WHERE sessions.session_id = documents.session_id
            AND sessions.status = 'in_progress'
        )
    );

-- Doctors can view documents
CREATE POLICY "Doctors can view documents"
    ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = documents.session_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- ============================================
-- MEDICINES POLICIES
-- ============================================

-- System can insert extracted medicines
CREATE POLICY "Allow medicine extraction"
    ON medicines
    FOR INSERT
    WITH CHECK (true);

-- Doctors can view extracted medicines
CREATE POLICY "Doctors can view medicines"
    ON medicines
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            JOIN sessions ON sessions.session_id = documents.session_id
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE documents.document_id = medicines.document_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- ============================================
-- DOCTORS TABLE POLICIES
-- ============================================

-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile"
    ON doctors
    FOR SELECT
    USING (auth_user_id = auth.uid());

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile"
    ON doctors
    FOR UPDATE
    USING (auth_user_id = auth.uid());

-- ============================================
-- AI SUMMARIES POLICIES
-- ============================================

-- System can create AI summaries
CREATE POLICY "Allow AI summary creation"
    ON ai_summaries
    FOR INSERT
    WITH CHECK (true);

-- Doctors can view AI summaries
CREATE POLICY "Doctors can view AI summaries"
    ON ai_summaries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = ai_summaries.session_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- Doctors can update and approve AI summaries
CREATE POLICY "Doctors can update AI summaries"
    ON ai_summaries
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = ai_summaries.session_id
            AND sessions.status = 'submitted'
            AND doctors.is_active = true
        )
    );

-- ============================================
-- AYUSH ASSESSMENTS POLICIES
-- ============================================

-- Allow AYUSH assessment creation for in_progress sessions
CREATE POLICY "Allow AYUSH assessment creation"
    ON ayush_assessments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions
            WHERE sessions.session_id = ayush_assessments.session_id
            AND sessions.status = 'in_progress'
        )
    );

-- Doctors can view AYUSH assessments
CREATE POLICY "Doctors can view AYUSH assessments"
    ON ayush_assessments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sessions
            JOIN doctors ON doctors.auth_user_id = auth.uid()
            WHERE sessions.session_id = ayush_assessments.session_id
            AND sessions.status IN ('submitted', 'reviewed')
            AND doctors.is_active = true
        )
    );

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Note: Storage bucket policies should be configured through Supabase dashboard
-- Bucket: medical-documents
-- Policy: Private bucket
-- Upload policy: Allow authenticated users (kiosk sessions) to upload
-- Download policy: Allow authenticated doctors to download
-- Path format: medical-documents/{session_id}/{document_id}-{filename}