-- Med-Life Simple Seed Data (sin usuarios auth)
-- Solo datos básicos para testing

-- Insert sample services
INSERT INTO public.services (name, description, duration_minutes, base_price, channel, color) VALUES
('Consulta General', 'Consulta médica general', 30, 500.00, 'presencial', '#3B82F6'),
('Consulta Especialista', 'Consulta con médico especialista', 45, 800.00, 'ambos', '#EF4444'),
('Telemedicina', 'Consulta médica por videollamada', 20, 400.00, 'telemedicina', '#10B981'),
('Chequeo Anual', 'Examen médico completo anual', 60, 1200.00, 'presencial', '#F59E0B'),
('Vacunación', 'Aplicación de vacunas', 15, 200.00, 'presencial', '#8B5CF6'),
('Electrocardiograma', 'ECG de rutina', 20, 300.00, 'presencial', '#EC4899'),
('Análisis de Laboratorio', 'Estudios de laboratorio básicos', 10, 150.00, 'presencial', '#6B7280');

-- Insert sample patients (sin created_by por ahora)
INSERT INTO public.patients (first_name, last_name, date_of_birth, phone, email, address, tags) VALUES
('Juan', 'Pérez', '1985-03-15', '+52 55 1111 1111', 'juan.perez@email.com', 'Av. Insurgentes 123, CDMX', ARRAY['diabetes', 'hipertension']),
('María', 'González', '1990-07-22', '+52 55 2222 2222', 'maria.gonzalez@email.com', 'Calle Reforma 456, CDMX', ARRAY['embarazo']),
('Pedro', 'Rodríguez', '1978-12-10', '+52 55 3333 3333', 'pedro.rodriguez@email.com', 'Col. Roma Norte 789, CDMX', ARRAY['adulto_mayor']),
('Ana', 'Martín', '1995-05-08', '+52 55 4444 4444', 'ana.martin@email.com', 'Polanco 321, CDMX', ARRAY['joven']),
('Carlos', 'Sánchez', '1980-11-30', '+52 55 5555 5555', 'carlos.sanchez@email.com', 'Coyoacán 654, CDMX', ARRAY['deportista']);

-- Insert sample campaign (sin created_by por ahora)
INSERT INTO public.campaigns (title, message, channel, target_age_min, target_age_max, schedule_type, schedule_month, schedule_day) VALUES
('Día de las Madres - Chequeo Especial', 
 'Celebra el Día de las Madres cuidando tu salud. 20% de descuento en chequeos completos durante todo mayo.',
 'email',
 25, 60,
 'yearly', 5, 1); -- Mayo 1