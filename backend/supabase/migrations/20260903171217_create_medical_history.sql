CREATE TABLE medical_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    history_present_illness TEXT,
    past_medical_history TEXT,
    past_surgical_history TEXT,
    allergies TEXT,
    family_history TEXT,
    personal_history TEXT,
    review_of_systems TEXT,
    voice_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);