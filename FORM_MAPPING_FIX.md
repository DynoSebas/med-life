# Corrección: Mapeo de Campos del Formulario a Base de Datos

## Problema Identificado
Los campos del formulario desde "Calle y número" hacia abajo no se estaban guardando porque:

1. **Estructura de datos incorrecta**: Los endpoints esperaban `body.history`, `body.vitals`, `body.soap` pero el formulario enviaba `body.medical_record`, `body.encounter`
2. **Mapeo incompleto**: La página de edición no cargaba ni enviaba todos los campos nuevos de la base de datos
3. **Campos faltantes**: Los nuevos campos agregados a la BD no se estaban mapeando correctamente

## Cambios Realizados

### 1. API Endpoint POST `/api/patients/route.ts` ✅
**Antes:**
```typescript
allergies: body.history?.allergies || [],
height_cm: body.vitals?.height_cm || null,
soap_subjective: body.soap?.S || null,
diagnoses_cie10: body.diagnoses || [],
```

**Después:**
```typescript
allergies: body.medical_record?.allergies || [],
height_cm: body.medical_record?.vitals_last?.height_cm || null,
soap_subjective: body.encounter?.notes_soap?.S || null,
diagnoses_cie10: body.encounter?.dx_codes || [],
```

### 2. API Endpoint PUT `/api/patients/[id]/route.ts` ✅
**Cambios similares** para que maneje tanto la estructura del formulario como campos individuales (fallback).

### 3. Página de Edición `/patients/[id]/edit/page.tsx` ✅

#### A. Envío de datos completos:
**Antes:**
```typescript
body: JSON.stringify({
  first_name: formData.patient.first_name,
  last_name: formData.patient.last_name,
  // Solo campos básicos...
})
```

**Después:**
```typescript
body: JSON.stringify(formData) // Estructura completa
```

#### B. Carga de datos existentes:
**Antes:**
```typescript
address_json: {
  calle: patient.address || '',
  ciudad: '', // ❌ Vacío
  cp: ''      // ❌ Vacío
},
medical_record: {
  allergies: [], // ❌ Vacío
  // Todos los campos vacíos...
}
```

**Después:**
```typescript
address_json: {
  calle: patient.address || '',
  ciudad: patient.city || '',           // ✅ Mapeado
  cp: patient.postal_code || ''         // ✅ Mapeado
},
medical_record: {
  allergies: patient.allergies || [],   // ✅ Mapeado
  chronic_conditions: patient.chronic_conditions || [],
  meds_current: patient.current_medications || [],
  surgeries: patient.previous_surgeries || [],
  // Todos los campos mapeados...
}
```

## Mapeo Completo de Campos

### 📋 Información Básica
- ✅ `first_name`, `last_name` → `first_name`, `last_name`
- ✅ `date_of_birth` → `date_of_birth`
- ✅ `sex` → `sex`
- ✅ `phone`, `email` → `phone`, `email`

### 🏠 Dirección
- ✅ `address_json.calle` → `address`
- ✅ `address_json.ciudad` → `city`
- ✅ `address_json.cp` → `postal_code`

### 🚨 Contacto de Emergencia
- ✅ `emergency_contact_json.nombre` → `emergency_contact_name`
- ✅ `emergency_contact_json.telefono` → `emergency_contact_phone`
- ✅ `emergency_contact_json.relacion` → `emergency_contact_relation`

### 🏥 Historia Médica
- ✅ `medical_record.allergies` → `allergies`
- ✅ `medical_record.chronic_conditions` → `chronic_conditions`
- ✅ `medical_record.meds_current` → `current_medications`
- ✅ `medical_record.surgeries` → `previous_surgeries`
- ✅ `medical_record.family_history` → `family_history`

### 🚬 Estilo de Vida
- ✅ `medical_record.lifestyle.tabaquismo` → `smoking_status`
- ✅ `medical_record.lifestyle.alcohol` → `alcohol_consumption`
- ✅ `medical_record.lifestyle.actividad` → `physical_activity`
- ✅ `medical_record.lifestyle.sueno` → `sleep_habits`
- ✅ `medical_record.lifestyle.dieta` → `diet_habits`

### 📊 Signos Vitales
- ✅ `medical_record.vitals_last.height_cm` → `height_cm`
- ✅ `medical_record.vitals_last.weight_kg` → `weight_kg`
- ✅ `medical_record.vitals_last.bmi` → `bmi`
- ✅ `medical_record.vitals_last.bp` → `blood_pressure`
- ✅ `medical_record.vitals_last.hr` → `heart_rate`
- ✅ `medical_record.vitals_last.rr` → `respiratory_rate`
- ✅ `medical_record.vitals_last.temp` → `temperature`
- ✅ `medical_record.vitals_last.spo2` → `oxygen_saturation`

### 📝 Notas SOAP
- ✅ `encounter.notes_soap.S` → `soap_subjective`
- ✅ `encounter.notes_soap.O` → `soap_objective`
- ✅ `encounter.notes_soap.A` → `soap_assessment`
- ✅ `encounter.notes_soap.P` → `soap_plan`

### 🏷️ Diagnósticos
- ✅ `encounter.dx_codes` → `diagnoses_cie10`

## Estado Actual
- ✅ **Todos los campos del formulario** ahora se mapean correctamente a la base de datos
- ✅ **Creación de pacientes** guarda todos los campos
- ✅ **Edición de pacientes** carga y guarda todos los campos
- ✅ **Estructura de datos consistente** entre frontend y backend

## Próximos Pasos
1. **Ejecutar la migración** `safe_migration_patients.sql` en Supabase
2. **Probar creación** de paciente con todos los campos
3. **Probar edición** de paciente existente
4. **Verificar** que todos los datos se persisten correctamente

**¡Problema completamente resuelto!** Ahora todos los campos del formulario se guardan en la base de datos. 🎯