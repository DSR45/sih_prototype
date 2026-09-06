-- MediKiosk Demo Seed Data
-- This file contains demo data for testing and presentation

-- ============================================
-- DEMO PATIENTS
-- ============================================

INSERT INTO patients (patient_id, full_name, age, gender, phone, preferred_language) VALUES
('MK-10001', 'Rahul Sharma', 24, 'Male', '9876543210', 'Hindi'),
('MK-10002', 'Priya Verma', 32, 'Female', '9876543211', 'English'),
('MK-10003', 'Amit Kumar', 45, 'Male', '9876543212', 'Hindi');

-- ============================================
-- DEMO DOCTORS
-- ============================================

-- Note: auth_user_id should be populated after creating Supabase Auth users
-- For now, inserting without auth_user_id for schema validation

INSERT INTO doctors (full_name, email, specialization, department, phone, is_active) VALUES
('Dr. Anjali Singh', 'anjali.singh@medikiosk.demo', 'General Medicine', 'General Medicine', '9123456789', true),
('Dr. Rajesh Patel', 'rajesh.patel@medikiosk.demo', 'Internal Medicine', 'Internal Medicine', '9123456790', true);

-- ============================================
-- DEMO SESSION 1: Submitted Case (Headache)
-- ============================================

INSERT INTO sessions (session_id, patient_id, visit_date, department, language_used, chief_complaint, complaint_category, consent_given, consent_timestamp, red_flag, status)
VALUES (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'MK-10001',
    NOW() - INTERVAL '1 hour',
    'General Medicine',
    'Hindi',
    'I have had a headache for three days.',
    'Headache',
    true,
    NOW() - INTERVAL '1 hour',
    false,
    'submitted'
);

INSERT INTO medical_history (session_id, history_present_illness, past_medical_history, current_medications, allergies, past_surgical_history, family_history, personal_history, review_of_systems)
VALUES (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'Headache for three days, moderate severity, frontal region, no radiation.',
    'No known chronic disease',
    'Paracetamol 500mg taken once yesterday',
    'No known drug allergy',
    'None',
    'No significant family history',
    'Normal diet and sleep pattern',
    'No vomiting, no fever, no loss of consciousness, no visual disturbances'
);

INSERT INTO question_responses (session_id, question, answer, question_category)
VALUES 
('aaaaaaaa-1111-1111-1111-111111111111', 'When did your headache begin?', 'Three days ago', 'Headache'),
('aaaaaaaa-1111-1111-1111-111111111111', 'How severe is the pain?', 'Moderate', 'Headache'),
('aaaaaaaa-1111-1111-1111-111111111111', 'Where is the pain located?', 'Front of my head', 'Headache'),
('aaaaaaaa-1111-1111-1111-111111111111', 'Do you have any associated symptoms?', 'Mild dizziness, no vomiting', 'Headache');

INSERT INTO ai_summaries (session_id, ai_summary, doctor_edited, timeline_json)
VALUES (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'AI Draft Clinical Summary

Patient:
- Name: Rahul Sharma
- Age/Gender: 24 years, Male
- Patient ID: MK-10001

Chief Complaint:
- Headache for 3 days

History of Present Illness:
- Moderate severity frontal headache
- Started 3 days ago
- No radiation
- Associated with mild dizziness
- No vomiting or visual disturbances

Relevant Negatives:
- No fever
- No loss of consciousness
- No neck stiffness

Past Medical History:
- No known chronic disease

Current Medications:
- Paracetamol 500mg (taken once)

Allergies:
- No known drug allergy

Doctor Verification Required:
This is an AI-generated draft. Doctor must verify before use.',
    false,
    '{"events": [{"date": "3 days ago", "event": "Headache onset"}]}'
);

-- ============================================
-- DEMO SESSION 2: In Progress Case (Fever)
-- ============================================

INSERT INTO sessions (session_id, patient_id, visit_date, department, language_used, chief_complaint, complaint_category, consent_given, consent_timestamp, red_flag, status)
VALUES (
    'bbbbbbbb-2222-2222-2222-222222222222',
    'MK-10002',
    NOW() - INTERVAL '30 minutes',
    'General Medicine',
    'English',
    'I have fever and body ache since yesterday.',
    'Fever',
    true,
    NOW() - INTERVAL '30 minutes',
    false,
    'in_progress'
);

INSERT INTO medical_history (session_id, history_present_illness, past_medical_history, current_medications, allergies)
VALUES (
    'bbbbbbbb-2222-2222-2222-222222222222',
    'Fever and generalized body ache since yesterday evening.',
    'Known case of hypertension on medication',
    'Amlodipine 5mg once daily',
    'No known drug allergy'
);

INSERT INTO question_responses (session_id, question, answer, question_category)
VALUES 
('bbbbbbbb-2222-2222-2222-222222222222', 'When did the fever start?', 'Yesterday evening', 'Fever'),
('bbbbbbbb-2222-2222-2222-222222222222', 'Have you measured your temperature?', 'Yes, it was 101 degrees', 'Fever'),
('bbbbbbbb-2222-2222-2222-222222222222', 'Do you have any other symptoms?', 'Body ache and mild headache', 'Fever');

-- ============================================
-- DEMO SESSION 3: Reviewed Case (Cough)
-- ============================================

INSERT INTO sessions (session_id, patient_id, visit_date, department, language_used, chief_complaint, complaint_category, consent_given, consent_timestamp, red_flag, status)
VALUES (
    'cccccccc-3333-3333-3333-333333333333',
    'MK-10003',
    NOW() - INTERVAL '2 hours',
    'General Medicine',
    'Hindi',
    'Persistent cough for one week.',
    'Cough',
    true,
    NOW() - INTERVAL '2 hours',
    false,
    'reviewed'
);

INSERT INTO medical_history (session_id, history_present_illness, past_medical_history, current_medications, allergies, past_surgical_history)
VALUES (
    'cccccccc-3333-3333-3333-333333333333',
    'Dry cough for one week, worse at night, no fever.',
    'Known case of diabetes mellitus on oral hypoglycemics',
    'Metformin 500mg twice daily, Glimepiride 1mg once daily',
    'No known drug allergy',
    'Appendectomy 5 years ago'
);

INSERT INTO question_responses (session_id, question, answer, question_category)
VALUES 
('cccccccc-3333-3333-3333-333333333333', 'When did the cough start?', 'One week ago', 'Cough'),
('cccccccc-3333-3333-3333-333333333333', 'Is it a dry or wet cough?', 'Dry cough', 'Cough'),
('cccccccc-3333-3333-3333-333333333333', 'When is it worse?', 'At night', 'Cough'),
('cccccccc-3333-3333-3333-333333333333', 'Do you have fever?', 'No fever', 'Cough');

INSERT INTO ai_summaries (session_id, ai_summary, doctor_summary, doctor_edited, approved_by, approved_at)
VALUES (
    'cccccccc-3333-3333-3333-333333333333',
    'AI Draft Clinical Summary

Patient: Amit Kumar, 45/M, MK-10003

Chief Complaint: Persistent dry cough for 1 week

History: Dry cough, worse at night, no fever, no breathlessness.

Past Medical History: Diabetes mellitus

Current Medications: Metformin 500mg BD, Glimepiride 1mg OD

Doctor verification required.',
    'Patient: Amit Kumar, 45/M, MK-10003

Chief Complaint: Dry cough x 1 week

HPI: Dry irritating cough for 1 week, worse at night. No fever, no dyspnea, no hemoptysis.

PMH: Type 2 DM on OHA

Medications: Metformin 500mg BD, Glimepiride 1mg OD

Allergies: NKDA

Plan: Symptomatic treatment advised. Follow up if not improving in 3 days.',
    true,
    (SELECT doctor_id FROM doctors WHERE email = 'anjali.singh@medikiosk.demo'),
    NOW() - INTERVAL '1 hour 30 minutes'
);

-- ============================================
-- NOTES
-- ============================================

-- To link doctors to Supabase Auth:
-- 1. Create doctor users in Supabase Auth
-- 2. Update doctors table with auth_user_id:
--    UPDATE doctors SET auth_user_id = '<auth_user_id>' WHERE email = 'doctor@example.com';

-- To test document upload:
-- 1. Upload files to Supabase Storage bucket 'medical-documents'
-- 2. Insert document records with file_url pointing to storage path
-- 3. Run OCR processing
-- 4. Extract medicines if applicable