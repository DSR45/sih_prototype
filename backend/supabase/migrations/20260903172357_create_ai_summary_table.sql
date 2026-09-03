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