CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_visit_date ON sessions(visit_date DESC);
CREATE INDEX idx_documents_session_id ON documents(session_id);
CREATE INDEX idx_medicines_document_id ON medicines(document_id);
CREATE INDEX idx_ai_summaries_approved_by ON ai_summaries(approved_by);