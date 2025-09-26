-- Med-Life Sample Data
-- For development and testing

-- Insert sample services
INSERT INTO public.services (name, description, duration_minutes, base_price, channel, color) VALUES
('Consulta General', 'Consulta médica general', 30, 500.00, 'presencial', '#3B82F6'),
('Consulta Especialista', 'Consulta con médico especialista', 45, 800.00, 'ambos', '#EF4444'),
('Telemedicina', 'Consulta médica por videollamada', 20, 400.00, 'telemedicina', '#10B981'),
('Chequeo Anual', 'Examen médico completo anual', 60, 1200.00, 'presencial', '#F59E0B'),
('Vacunación', 'Aplicación de vacunas', 15, 200.00, 'presencial', '#8B5CF6'),
('Electrocardiograma', 'ECG de rutina', 20, 300.00, 'presencial', '#EC4899'),
('Análisis de Laboratorio', 'Estudios de laboratorio básicos', 10, 150.00, 'presencial', '#6B7280');

-- First create auth users (Supabase auth system)
-- These would normally be created through the Supabase auth signup process
-- For development, we'll create them directly in auth.users

-- Insert into auth.users first (Supabase auth system)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'admin@medlife.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'dr.martinez@medlife.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'dra.lopez@medlife.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'recepcion@medlife.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE);

-- Now insert into public.users (our app-specific user data)
INSERT INTO public.users (id, email, first_name, last_name, role, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@medlife.com', 'Ana', 'García', 'admin', '+52 55 1234 5678'),
('22222222-2222-2222-2222-222222222222', 'dr.martinez@medlife.com', 'Carlos', 'Martínez', 'medico', '+52 55 2345 6789'),
('33333333-3333-3333-3333-333333333333', 'dra.lopez@medlife.com', 'María', 'López', 'medico', '+52 55 3456 7890'),
('44444444-4444-4444-4444-444444444444', 'recepcion@medlife.com', 'Sofía', 'Hernández', 'recepcion', '+52 55 4567 8901');

-- Insert sample patients
INSERT INTO public.patients (first_name, last_name, date_of_birth, phone, email, address, tags, created_by) VALUES
('Juan', 'Pérez', '1985-03-15', '+52 55 1111 1111', 'juan.perez@email.com', 'Av. Insurgentes 123, CDMX', ARRAY['diabetes', 'hipertension'], '44444444-4444-4444-4444-444444444444'),
('María', 'González', '1990-07-22', '+52 55 2222 2222', 'maria.gonzalez@email.com', 'Calle Reforma 456, CDMX', ARRAY['embarazo'], '44444444-4444-4444-4444-444444444444'),
('Pedro', 'Rodríguez', '1978-12-10', '+52 55 3333 3333', 'pedro.rodriguez@email.com', 'Col. Roma Norte 789, CDMX', ARRAY['adulto_mayor'], '44444444-4444-4444-4444-444444444444'),
('Ana', 'Martín', '1995-05-08', '+52 55 4444 4444', 'ana.martin@email.com', 'Polanco 321, CDMX', ARRAY['joven'], '44444444-4444-4444-4444-444444444444'),
('Carlos', 'Sánchez', '1980-11-30', '+52 55 5555 5555', 'carlos.sanchez@email.com', 'Coyoacán 654, CDMX', ARRAY['deportista'], '44444444-4444-4444-4444-444444444444');

-- Insert sample appointments (some in the past, some future)
INSERT INTO public.appointments (patient_id, doctor_id, service_id, start_time, end_time, status, duration_minutes, price, notes, created_by) VALUES
-- Past appointments
((SELECT id FROM public.patients WHERE first_name = 'Juan' AND last_name = 'Pérez'), 
 '22222222-2222-2222-2222-222222222222',
 (SELECT id FROM public.services WHERE name = 'Consulta General'),
 '2025-09-20 09:00:00+00', '2025-09-20 09:30:00+00', 'atendida', 30, 500.00, 'Control de diabetes', '44444444-4444-4444-4444-444444444444'),

((SELECT id FROM public.patients WHERE first_name = 'María' AND last_name = 'González'), 
 '33333333-3333-3333-3333-333333333333',
 (SELECT id FROM public.services WHERE name = 'Consulta Especialista'),
 '2025-09-22 14:00:00+00', '2025-09-22 14:45:00+00', 'atendida', 45, 800.00, 'Control prenatal', '44444444-4444-4444-4444-444444444444'),

-- Future appointments
((SELECT id FROM public.patients WHERE first_name = 'Pedro' AND last_name = 'Rodríguez'), 
 '22222222-2222-2222-2222-222222222222',
 (SELECT id FROM public.services WHERE name = 'Chequeo Anual'),
 '2025-09-26 10:00:00+00', '2025-09-26 11:00:00+00', 'programada', 60, 1200.00, 'Chequeo anual', '44444444-4444-4444-4444-444444444444'),

((SELECT id FROM public.patients WHERE first_name = 'Ana' AND last_name = 'Martín'), 
 '33333333-3333-3333-3333-333333333333',
 (SELECT id FROM public.services WHERE name = 'Telemedicina'),
 '2025-09-27 16:00:00+00', '2025-09-27 16:20:00+00', 'confirmada', 20, 400.00, 'Consulta de seguimiento', '44444444-4444-4444-4444-444444444444'),

((SELECT id FROM public.patients WHERE first_name = 'Carlos' AND last_name = 'Sánchez'), 
 '22222222-2222-2222-2222-222222222222',
 (SELECT id FROM public.services WHERE name = 'Electrocardiograma'),
 '2025-09-28 11:30:00+00', '2025-09-28 11:50:00+00', 'programada', 20, 300.00, 'ECG de rutina', '44444444-4444-4444-4444-444444444444');

-- Insert sample medical records for attended appointments
INSERT INTO public.medical_records (patient_id, appointment_id, doctor_id, allergies, chronic_diseases, current_medications, subjective, objective, assessment, plan, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, weight, height, diagnoses, created_by) VALUES
-- Juan Pérez medical record
((SELECT id FROM public.patients WHERE first_name = 'Juan' AND last_name = 'Pérez'),
 (SELECT id FROM public.appointments WHERE notes = 'Control de diabetes'),
 '22222222-2222-2222-2222-222222222222',
 'Ninguna conocida',
 'Diabetes Mellitus Tipo 2, Hipertensión Arterial',
 'Metformina 850mg c/12h, Enalapril 10mg c/24h',
 'Paciente refiere sentirse bien, sin síntomas. Toma medicamentos regularmente.',
 'Paciente consciente, orientado, sin datos de descompensación. Glucómetro: 110 mg/dl',
 'Diabetes controlada, tensión arterial en meta',
 'Continuar tratamiento actual, cita en 3 meses, laboratorios de control',
 130, 80, 72, 78.5, 1.75,
 '[{"code": "E11.9", "description": "Diabetes mellitus tipo 2 sin complicaciones"}]',
 '22222222-2222-2222-2222-222222222222'),

-- María González medical record
((SELECT id FROM public.patients WHERE first_name = 'María' AND last_name = 'González'),
 (SELECT id FROM public.appointments WHERE notes = 'Control prenatal'),
 '33333333-3333-3333-3333-333333333333',
 'Penicilina',
 'Ninguna',
 'Ácido fólico 5mg c/24h, Hierro 65mg c/24h',
 'Paciente embarazada de 20 semanas, sin molestias. Movimientos fetales presentes.',
 'Abdomen con altura uterina acorde a edad gestacional. FCF: 140 lpm',
 'Embarazo de bajo riesgo, evolución normal',
 'Continuar suplementos, USG morfológico, cita en 4 semanas',
 110, 70, 76, 62.0, 1.65,
 '[{"code": "Z34.9", "description": "Supervisión de embarazo normal"}]',
 '33333333-3333-3333-3333-333333333333');

-- Insert sample service overrides
INSERT INTO public.service_overrides (service_id, doctor_id, duration_minutes, price) VALUES
((SELECT id FROM public.services WHERE name = 'Consulta Especialista'), 
 '33333333-3333-3333-3333-333333333333', 50, 900.00), -- Dra. López takes longer and charges more
((SELECT id FROM public.services WHERE name = 'Telemedicina'), 
 '22222222-2222-2222-2222-222222222222', 25, 450.00); -- Dr. Martínez takes longer for telemedicine

-- Insert sample campaign
INSERT INTO public.campaigns (title, message, channel, target_age_min, target_age_max, schedule_type, schedule_month, schedule_day, created_by) VALUES
('Día de las Madres - Chequeo Especial', 
 'Celebra el Día de las Madres cuidando tu salud. 20% de descuento en chequeos completos durante todo mayo.',
 'email',
 25, 60,
 'yearly', 5, 1, -- Mayo 1
 '11111111-1111-1111-1111-111111111111');

-- Insert sample campaign sends
INSERT INTO public.campaign_sends (campaign_id, patient_id, channel, delivered_at) VALUES
((SELECT id FROM public.campaigns WHERE title LIKE 'Día de las Madres%'),
 (SELECT id FROM public.patients WHERE first_name = 'María' AND last_name = 'González'),
 'email', NOW() - INTERVAL '1 day'),
((SELECT id FROM public.campaigns WHERE title LIKE 'Día de las Madres%'),
 (SELECT id FROM public.patients WHERE first_name = 'Ana' AND last_name = 'Martín'),
 'email', NOW() - INTERVAL '1 day');