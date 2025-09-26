-- Nueva tabla: consultations (Consultas Médicas)
-- Estructura para almacenar consultas médicas individuales por paciente

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Información de la consulta
    consultation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    consultation_time TIME DEFAULT CURRENT_TIME,
    
    -- Notas SOAP
    soap_subjective TEXT,        -- (S) Subjetivo - Lo que dice el paciente
    soap_objective TEXT,         -- (O) Objetivo - Exploración física, signos vitales
    soap_assessment TEXT,        -- (A) Análisis - Evaluación médica, diagnóstico
    soap_plan TEXT,              -- (P) Plan - Tratamiento, seguimiento
    
    -- Diagnósticos CIE-10 específicos de esta consulta
    diagnoses_cie10 JSONB DEFAULT '[]'::jsonb,
    
    -- Signos vitales específicos de esta consulta (opcional)
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(4,1),
    blood_pressure VARCHAR(20),
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    temperature DECIMAL(4,1),
    oxygen_saturation INTEGER,
    
    -- Medicamentos recetados en esta consulta
    prescribed_medications JSONB DEFAULT '[]'::jsonb,
    
    -- Estudios solicitados
    requested_studies JSONB DEFAULT '[]'::jsonb,
    
    -- Próxima cita sugerida
    next_appointment_suggested DATE,
    follow_up_notes TEXT,
    
    -- Estado de la consulta
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'cancelled')),
    
    -- Notas adicionales privadas del médico
    private_notes TEXT,
    
    -- Metadatos
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX idx_consultations_date ON consultations(consultation_date DESC);
CREATE INDEX idx_consultations_patient_date ON consultations(patient_id, consultation_date DESC);

-- Índices GIN para campos JSONB
CREATE INDEX idx_consultations_diagnoses ON consultations USING GIN (diagnoses_cie10);
CREATE INDEX idx_consultations_medications ON consultations USING GIN (prescribed_medications);
CREATE INDEX idx_consultations_studies ON consultations USING GIN (requested_studies);

-- Constraints de validación
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_height_range 
    CHECK (height_cm IS NULL OR (height_cm >= 30 AND height_cm <= 300));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_weight_range 
    CHECK (weight_kg IS NULL OR (weight_kg >= 0.5 AND weight_kg <= 500));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_bmi_range 
    CHECK (bmi IS NULL OR (bmi >= 10 AND bmi <= 100));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_hr_range 
    CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_rr_range 
    CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 5 AND respiratory_rate <= 60));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_temp_range 
    CHECK (temperature IS NULL OR (temperature >= 30 AND temperature <= 45));
    
ALTER TABLE consultations ADD CONSTRAINT chk_consultation_spo2_range 
    CHECK (oxygen_saturation IS NULL OR (oxygen_saturation >= 50 AND oxygen_saturation <= 100));

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE consultations IS 'Consultas médicas individuales por paciente';
COMMENT ON COLUMN consultations.patient_id IS 'ID del paciente (FK)';
COMMENT ON COLUMN consultations.doctor_id IS 'ID del médico que realizó la consulta (FK)';
COMMENT ON COLUMN consultations.consultation_date IS 'Fecha de la consulta';
COMMENT ON COLUMN consultations.soap_subjective IS 'SOAP - Subjetivo: síntomas reportados por el paciente';
COMMENT ON COLUMN consultations.soap_objective IS 'SOAP - Objetivo: exploración física y signos vitales';
COMMENT ON COLUMN consultations.soap_assessment IS 'SOAP - Análisis: evaluación médica y diagnóstico';
COMMENT ON COLUMN consultations.soap_plan IS 'SOAP - Plan: tratamiento y seguimiento';
COMMENT ON COLUMN consultations.diagnoses_cie10 IS 'Array de diagnósticos CIE-10 para esta consulta';
COMMENT ON COLUMN consultations.prescribed_medications IS 'Medicamentos recetados en formato JSON';
COMMENT ON COLUMN consultations.requested_studies IS 'Estudios médicos solicitados en formato JSON';
COMMENT ON COLUMN consultations.status IS 'Estado de la consulta: draft, completed, cancelled';

-- Vista para consultas con información del paciente y médico
CREATE VIEW consultations_with_details AS
SELECT 
    c.*,
    p.first_name || ' ' || p.last_name as patient_name,
    p.date_of_birth as patient_birth_date,
    EXTRACT(YEAR FROM AGE(p.date_of_birth::date)) as patient_age,
    u.first_name || ' ' || u.last_name as doctor_name,
    u.role as doctor_role
FROM consultations c
LEFT JOIN patients p ON c.patient_id = p.id
LEFT JOIN users u ON c.doctor_id = u.id
WHERE p.is_active = true
ORDER BY c.consultation_date DESC, c.created_at DESC;

COMMENT ON VIEW consultations_with_details IS 'Vista de consultas con detalles del paciente y médico';