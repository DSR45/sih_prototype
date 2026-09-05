
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