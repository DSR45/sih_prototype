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
