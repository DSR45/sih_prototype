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