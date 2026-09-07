CREATE TABLE ayush_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    prakriti VARCHAR(30),
    vikriti VARCHAR(30),
    agni VARCHAR(30),
    koshtha VARCHAR(30),
    ahara TEXT,
    vihara TEXT,
    nidana TEXT,
    samprapti_notes TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);