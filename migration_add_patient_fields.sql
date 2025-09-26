-- Migration: Add missing patient fields
-- Date: 2025-09-26
-- Description: Add all missing fields from the patient forms to the patients table

-- First, let's check the current structure
-- Run this query to see current columns:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'patients' ORDER BY ordinal_position;

-- Add basic identification fields
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS sex VARCHAR(1) CHECK (sex IN ('M', 'F', 'X')),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(50);

-- Add medical history fields (using JSONB for complex data)
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS allergies JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS chronic_conditions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS current_medications JSONB DEFAULT '[]'::jsonb,  
ADD COLUMN IF NOT EXISTS previous_surgeries JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS family_history JSONB DEFAULT '{}'::jsonb;

-- Add lifestyle fields
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS smoking_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS alcohol_consumption VARCHAR(50),
ADD COLUMN IF NOT EXISTS physical_activity VARCHAR(100),
ADD COLUMN IF NOT EXISTS sleep_habits VARCHAR(100),
ADD COLUMN IF NOT EXISTS diet_habits VARCHAR(200);

-- Add vital signs fields
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS height_cm DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS bmi DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS blood_pressure VARCHAR(20),
ADD COLUMN IF NOT EXISTS heart_rate INTEGER,
ADD COLUMN IF NOT EXISTS respiratory_rate INTEGER,
ADD COLUMN IF NOT EXISTS temperature DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS oxygen_saturation INTEGER;

-- Add SOAP notes fields
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS soap_subjective TEXT,
ADD COLUMN IF NOT EXISTS soap_objective TEXT,
ADD COLUMN IF NOT EXISTS soap_assessment TEXT,
ADD COLUMN IF NOT EXISTS soap_plan TEXT;

-- Add diagnoses field
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS diagnoses_cie10 JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN patients.allergies IS 'Array of patient allergies';
COMMENT ON COLUMN patients.chronic_conditions IS 'Array of chronic medical conditions';
COMMENT ON COLUMN patients.current_medications IS 'Array of current medications with drug, dose, frequency, notes';
COMMENT ON COLUMN patients.previous_surgeries IS 'Array of previous surgeries';
COMMENT ON COLUMN patients.family_history IS 'Object with family medical history';
COMMENT ON COLUMN patients.diagnoses_cie10 IS 'Array of CIE-10 diagnosis codes';

-- Create indexes for commonly queried JSON fields
CREATE INDEX IF NOT EXISTS idx_patients_allergies ON patients USING GIN (allergies);
CREATE INDEX IF NOT EXISTS idx_patients_chronic_conditions ON patients USING GIN (chronic_conditions);
CREATE INDEX IF NOT EXISTS idx_patients_diagnoses ON patients USING GIN (diagnoses_cie10);

-- Add constraints for vital signs
ALTER TABLE patients ADD CONSTRAINT chk_height_range CHECK (height_cm IS NULL OR (height_cm >= 30 AND height_cm <= 300));
ALTER TABLE patients ADD CONSTRAINT chk_weight_range CHECK (weight_kg IS NULL OR (weight_kg >= 0.5 AND weight_kg <= 500));
ALTER TABLE patients ADD CONSTRAINT chk_bmi_range CHECK (bmi IS NULL OR (bmi >= 10 AND bmi <= 100));
ALTER TABLE patients ADD CONSTRAINT chk_hr_range CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250));
ALTER TABLE patients ADD CONSTRAINT chk_rr_range CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 5 AND respiratory_rate <= 60));
ALTER TABLE patients ADD CONSTRAINT chk_temp_range CHECK (temperature IS NULL OR (temperature >= 30 AND temperature <= 45));
ALTER TABLE patients ADD CONSTRAINT chk_spo2_range CHECK (oxygen_saturation IS NULL OR (oxygen_saturation >= 50 AND oxygen_saturation <= 100));