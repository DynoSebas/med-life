-- Safe migration script for patients table
-- This version handles different possible current states

-- Step 1: Create patients table if it doesn't exist
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    tags JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Add new columns safely
DO $$
BEGIN
    -- Basic identification fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'sex') THEN
        ALTER TABLE patients ADD COLUMN sex VARCHAR(1) CHECK (sex IN ('M', 'F', 'X'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'city') THEN
        ALTER TABLE patients ADD COLUMN city VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'postal_code') THEN
        ALTER TABLE patients ADD COLUMN postal_code VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'emergency_contact_relation') THEN
        ALTER TABLE patients ADD COLUMN emergency_contact_relation VARCHAR(50);
    END IF;
    
    -- Medical history fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'allergies') THEN
        ALTER TABLE patients ADD COLUMN allergies JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'chronic_conditions') THEN
        ALTER TABLE patients ADD COLUMN chronic_conditions JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'current_medications') THEN
        ALTER TABLE patients ADD COLUMN current_medications JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'previous_surgeries') THEN
        ALTER TABLE patients ADD COLUMN previous_surgeries JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'family_history') THEN
        ALTER TABLE patients ADD COLUMN family_history JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    -- Lifestyle fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'smoking_status') THEN
        ALTER TABLE patients ADD COLUMN smoking_status VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'alcohol_consumption') THEN
        ALTER TABLE patients ADD COLUMN alcohol_consumption VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'physical_activity') THEN
        ALTER TABLE patients ADD COLUMN physical_activity VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'sleep_habits') THEN
        ALTER TABLE patients ADD COLUMN sleep_habits VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'diet_habits') THEN
        ALTER TABLE patients ADD COLUMN diet_habits VARCHAR(200);
    END IF;
    
    -- Vital signs fields  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'height_cm') THEN
        ALTER TABLE patients ADD COLUMN height_cm DECIMAL(5,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'weight_kg') THEN
        ALTER TABLE patients ADD COLUMN weight_kg DECIMAL(5,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'bmi') THEN
        ALTER TABLE patients ADD COLUMN bmi DECIMAL(4,1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'blood_pressure') THEN
        ALTER TABLE patients ADD COLUMN blood_pressure VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'heart_rate') THEN
        ALTER TABLE patients ADD COLUMN heart_rate INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'respiratory_rate') THEN
        ALTER TABLE patients ADD COLUMN respiratory_rate INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'temperature') THEN
        ALTER TABLE patients ADD COLUMN temperature DECIMAL(4,1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'oxygen_saturation') THEN
        ALTER TABLE patients ADD COLUMN oxygen_saturation INTEGER;
    END IF;
    
    -- SOAP notes fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'soap_subjective') THEN
        ALTER TABLE patients ADD COLUMN soap_subjective TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'soap_objective') THEN
        ALTER TABLE patients ADD COLUMN soap_objective TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'soap_assessment') THEN
        ALTER TABLE patients ADD COLUMN soap_assessment TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'soap_plan') THEN
        ALTER TABLE patients ADD COLUMN soap_plan TEXT;
    END IF;
    
    -- Diagnoses field
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'diagnoses_cie10') THEN
        ALTER TABLE patients ADD COLUMN diagnoses_cie10 JSONB DEFAULT '[]'::jsonb;
    END IF;
    
END $$;

-- Step 3: Add comments
COMMENT ON COLUMN patients.allergies IS 'Array of patient allergies';
COMMENT ON COLUMN patients.chronic_conditions IS 'Array of chronic medical conditions';
COMMENT ON COLUMN patients.current_medications IS 'Array of current medications with drug, dose, frequency, notes';
COMMENT ON COLUMN patients.previous_surgeries IS 'Array of previous surgeries';
COMMENT ON COLUMN patients.family_history IS 'Object with family medical history';
COMMENT ON COLUMN patients.diagnoses_cie10 IS 'Array of CIE-10 diagnosis codes';

-- Step 4: Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_patients_allergies ON patients USING GIN (allergies);
CREATE INDEX IF NOT EXISTS idx_patients_chronic_conditions ON patients USING GIN (chronic_conditions);
CREATE INDEX IF NOT EXISTS idx_patients_diagnoses ON patients USING GIN (diagnoses_cie10);
CREATE INDEX IF NOT EXISTS idx_patients_active ON patients (is_active);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients (created_at);

-- Step 5: Add constraints (with error handling)
DO $$
BEGIN
    -- Add constraints only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_height_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_height_range CHECK (height_cm IS NULL OR (height_cm >= 30 AND height_cm <= 300));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_weight_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_weight_range CHECK (weight_kg IS NULL OR (weight_kg >= 0.5 AND weight_kg <= 500));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_bmi_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_bmi_range CHECK (bmi IS NULL OR (bmi >= 10 AND bmi <= 100));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_hr_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_hr_range CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_rr_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_rr_range CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 5 AND respiratory_rate <= 60));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_temp_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_temp_range CHECK (temperature IS NULL OR (temperature >= 30 AND temperature <= 45));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'chk_spo2_range') THEN
        ALTER TABLE patients ADD CONSTRAINT chk_spo2_range CHECK (oxygen_saturation IS NULL OR (oxygen_saturation >= 50 AND oxygen_saturation <= 100));
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Some constraints may already exist or there was an error: %', SQLERRM;
END $$;

-- Step 6: Verify the migration
SELECT 
    'Migration completed. Current patients table structure:' as message,
    COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'patients' AND table_schema = 'public';

-- Show all columns for verification
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'patients' 
  AND table_schema = 'public'
ORDER BY ordinal_position;