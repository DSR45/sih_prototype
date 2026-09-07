-- Insert Doctor into MediKiosk Database
-- This script inserts a new doctor into the doctors table

-- ============================================
-- INSERT NEW DOCTOR
-- ============================================

-- Example 1: Insert Dr. Ananya Mehta (General Medicine)
INSERT INTO doctors (
    full_name, 
    email, 
    specialization, 
    department, 
    phone, 
    is_active
) VALUES (
    'Dr. Ananya Mehta',
    'ananya.mehta@medikiosk.health',
    'General Medicine',
    'General Medicine',
    '9123456791',
    true
);

-- Example 2: Insert Dr. Rohan Kapoor (Internal Medicine)
INSERT INTO doctors (
    full_name, 
    email, 
    specialization, 
    department, 
    phone, 
    is_active
) VALUES (
    'Dr. Rohan Kapoor',
    'rohan.kapoor@medikiosk.health',
    'Internal Medicine',
    'Internal Medicine',
    '9123456792',
    true
);

-- Example 3: Insert with specific doctor_id (optional)
INSERT INTO doctors (
    doctor_id,
    full_name, 
    email, 
    specialization, 
    department, 
    phone, 
    is_active
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Dr. Priya Sharma',
    'priya.sharma@medikiosk.health',
    'Pediatrics',
    'Pediatrics',
    '9123456793',
    true
);

-- ============================================
-- VERIFY INSERTION
-- ============================================

-- Check all doctors
SELECT 
    doctor_id,
    full_name,
    email,
    specialization,
    department,
    phone,
    is_active,
    created_at
FROM doctors
ORDER BY created_at DESC;

-- ============================================
-- LINK TO SUPABASE AUTH (Optional)
-- ============================================

-- After creating a user in Supabase Auth, link them to the doctor:
-- UPDATE doctors 
-- SET auth_user_id = '<supabase_auth_user_uuid>' 
-- WHERE email = 'doctor@example.com';

-- Example:
-- UPDATE doctors 
-- SET auth_user_id = '123e4567-e89b-12d3-a456-426614174000' 
-- WHERE email = 'ananya.mehta@medikiosk.health';

-- ============================================
-- TEMPLATE FOR NEW DOCTOR
-- ============================================

/*
INSERT INTO doctors (
    full_name, 
    email, 
    specialization, 
    department, 
    phone, 
    is_active
) VALUES (
    'Dr. [Full Name]',
    '[email]@medikiosk.health',
    '[Specialization]',
    '[Department]',
    '[10-digit phone]',
    true
);
*/

-- ============================================
-- COMMON SPECIALIZATIONS
-- ============================================
-- General Medicine
-- Internal Medicine
-- Pediatrics
-- Cardiology
-- Orthopedics
-- Dermatology
-- Gynecology
-- ENT (Ear, Nose, Throat)
-- Ophthalmology
-- Psychiatry
-- Surgery
-- Radiology
-- Anesthesiology

-- ============================================
-- NOTES
-- ============================================
-- 1. doctor_id is auto-generated (UUID) if not provided
-- 2. email must be unique
-- 3. auth_user_id can be added later after Supabase Auth setup
-- 4. is_active defaults to true
-- 5. created_at is automatically set to current timestamp