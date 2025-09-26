# Instrucciones para Aplicar la Migración de Campos de Pacientes

## Pasos para Ejecutar la Migración

### 1. Diagnóstico Inicial (IMPORTANTE)

Primero ejecuta el script de diagnóstico para ver la estructura actual:

1. Ve a tu panel de Supabase (https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor**
4. Copia y pega el contenido del archivo `check_patients_table.sql`
5. Ejecuta el script para ver qué columnas existen actualmente

### 2. Aplicar la Migración Segura

**Usar el script seguro** `safe_migration_patients.sql` en lugar de `migration_add_patient_fields.sql`:

1. En el **SQL Editor** de Supabase
2. Copia y pega el contenido del archivo `safe_migration_patients.sql`
3. Ejecuta el script (este script maneja automáticamente si la tabla existe o no)

### 2. Verificar que los Campos se Agregaron Correctamente

Ejecuta esta consulta para verificar la estructura de la tabla:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;
```

### 3. Campos Agregados

La migración agrega los siguientes campos a la tabla `patients`:

#### Identificación Adicional:
- `sex` (VARCHAR(1)) - Sexo del paciente
- `city` (VARCHAR(100)) - Ciudad
- `postal_code` (VARCHAR(10)) - Código postal  
- `emergency_contact_relation` (VARCHAR(50)) - Relación del contacto de emergencia

#### Historia Médica (JSONB):
- `allergies` - Array de alergias
- `chronic_conditions` - Array de condiciones crónicas
- `current_medications` - Array de medicamentos actuales con estructura: {drug, dose, frequency, notes}
- `previous_surgeries` - Array de cirugías previas
- `family_history` - Objeto con antecedentes familiares

#### Estilo de Vida:
- `smoking_status` (VARCHAR(50)) - Estado de tabaquismo
- `alcohol_consumption` (VARCHAR(50)) - Consumo de alcohol
- `physical_activity` (VARCHAR(100)) - Actividad física
- `sleep_habits` (VARCHAR(100)) - Hábitos de sueño
- `diet_habits` (VARCHAR(200)) - Hábitos alimenticios

#### Signos Vitales:
- `height_cm` (DECIMAL(5,2)) - Talla en centímetros
- `weight_kg` (DECIMAL(5,2)) - Peso en kilogramos
- `bmi` (DECIMAL(4,1)) - Índice de masa corporal
- `blood_pressure` (VARCHAR(20)) - Presión arterial
- `heart_rate` (INTEGER) - Frecuencia cardíaca
- `respiratory_rate` (INTEGER) - Frecuencia respiratoria
- `temperature` (DECIMAL(4,1)) - Temperatura
- `oxygen_saturation` (INTEGER) - Saturación de oxígeno

#### Notas SOAP:
- `soap_subjective` (TEXT) - Subjetivo
- `soap_objective` (TEXT) - Objetivo
- `soap_assessment` (TEXT) - Análisis
- `soap_plan` (TEXT) - Plan

#### Diagnósticos:
- `diagnoses_cie10` (JSONB) - Array de códigos de diagnóstico CIE-10

### 4. Verificar Funcionamiento

Después de aplicar la migración:

1. Inicia la aplicación: `npm run dev`
2. Intenta crear un nuevo paciente con todos los campos del formulario
3. Verifica que todos los datos se guarden correctamente
4. Intenta editar un paciente existente

### 5. Rollback (si es necesario)

Si necesitas revertir los cambios, ejecuta:

```sql
-- Remover campos agregados
ALTER TABLE patients 
DROP COLUMN IF EXISTS sex,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS emergency_contact_relation,
DROP COLUMN IF EXISTS allergies,
DROP COLUMN IF EXISTS chronic_conditions,
DROP COLUMN IF EXISTS current_medications,
DROP COLUMN IF EXISTS previous_surgeries,
DROP COLUMN IF EXISTS family_history,
DROP COLUMN IF EXISTS smoking_status,
DROP COLUMN IF EXISTS alcohol_consumption,
DROP COLUMN IF EXISTS physical_activity,
DROP COLUMN IF EXISTS sleep_habits,
DROP COLUMN IF EXISTS diet_habits,
DROP COLUMN IF EXISTS height_cm,
DROP COLUMN IF EXISTS weight_kg,
DROP COLUMN IF EXISTS bmi,
DROP COLUMN IF EXISTS blood_pressure,
DROP COLUMN IF EXISTS heart_rate,
DROP COLUMN IF EXISTS respiratory_rate,
DROP COLUMN IF EXISTS temperature,
DROP COLUMN IF EXISTS oxygen_saturation,
DROP COLUMN IF EXISTS soap_subjective,
DROP COLUMN IF EXISTS soap_objective,
DROP COLUMN IF EXISTS soap_assessment,
DROP COLUMN IF EXISTS soap_plan,
DROP COLUMN IF EXISTS diagnoses_cie10;

-- Remover índices
DROP INDEX IF EXISTS idx_patients_allergies;
DROP INDEX IF EXISTS idx_patients_chronic_conditions;
DROP INDEX IF EXISTS idx_patients_diagnoses;
```

## Archivos Modificados

1. `migration_add_patient_fields.sql` - Script de migración
2. `src/lib/types/database.ts` - Tipos TypeScript actualizados
3. `src/app/api/patients/route.ts` - Endpoint POST actualizado
4. `src/app/api/patients/[id]/route.ts` - Endpoint PUT actualizado

## Notas Importantes

- Los campos JSON (allergies, chronic_conditions, etc.) usan JSONB para mejor rendimiento
- Se agregaron constraints para validar rangos en signos vitales
- Se crearon índices GIN para búsquedas eficientes en campos JSON
- Todos los campos nuevos son opcionales (nullable)
- Los endpoints soportan tanto el formato actual como el nuevo formato de datos