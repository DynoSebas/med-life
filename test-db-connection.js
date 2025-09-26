const { createClient } = require('@supabase/supabase-js');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verificando configuración...');
console.log('URL:', supabaseUrl ? '✓ Configurada' : '❌ No encontrada');
console.log('Service Key:', supabaseServiceKey ? '✓ Configurada' : '❌ No encontrada');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas correctamente');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('\n🚀 Probando conexión a la base de datos...');
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .single();
    
    if (error) {
      console.log('⚠️  La tabla users no existe o hay un error:', error.message);
    } else {
      console.log('✓ Conexión exitosa a la tabla users');
    }
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }

  // Verificar tablas existentes
  console.log('\n📋 Verificando tablas existentes...');
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.log('⚠️  No se pudieron obtener las tablas:', error.message);
    } else {
      console.log('Tablas encontradas:', tables.map(t => t.table_name));
    }
  } catch (err) {
    console.error('❌ Error obteniendo tablas:', err.message);
  }

  // Probar tabla de pacientes
  console.log('\n👥 Verificando tabla de pacientes...');
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('⚠️  Error en tabla patients:', error.message);
    } else {
      console.log(`✓ Encontrados ${patients.length} pacientes`);
      if (patients.length > 0) {
        console.log('Primer paciente:', patients[0]);
      }
    }
  } catch (err) {
    console.error('❌ Error consultando pacientes:', err.message);
  }

  // Probar tabla de servicios
  console.log('\n🏥 Verificando tabla de servicios...');
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('⚠️  Error en tabla services:', error.message);
    } else {
      console.log(`✓ Encontrados ${services.length} servicios`);
    }
  } catch (err) {
    console.error('❌ Error consultando servicios:', err.message);
  }
}

// Ejecutar pruebas
testConnection().then(() => {
  console.log('\n✨ Pruebas de conexión completadas');
  process.exit(0);
}).catch((err) => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});