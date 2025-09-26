# Med-Life - Sistema de Gestión Médica

<div align="center">
  <h1>🏥 Med-Life</h1>
  <p><strong>Sistema completo de gestión médica con Next.js y Supabase</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
  ![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=for-the-badge&logo=supabase)
</div>

## 📋 Descripción

Med-Life es un sistema integral de gestión médica diseñado para clínicas y consultorios médicos. Ofrece una solución completa para la administración de pacientes, citas, servicios médicos, expedientes clínicos y reportes.

## ✨ Características Principales

- **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- **TypeScript**: Desarrollo con tipado estático
- **Componentes Reutilizables**: UI components modulares
- **Optimizado**: Built con Next.js 15 y App Router
- **Accesibilidad**: Siguiendo mejores prácticas para aplicaciones médicas

## 🛠️ Tecnologías

- [Next.js 15](https://nextjs.org) - Framework de React con App Router
- [TypeScript](https://typescriptlang.org) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com) - Framework de CSS utilitario
- [Supabase](https://supabase.com) - Base de datos PostgreSQL y autenticación
- [Lucide React](https://lucide.dev) - Iconos SVG
- [React Hook Form](https://react-hook-form.com) - Manejo de formularios
- [Zod](https://zod.dev) - Validación de esquemas

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/med-life.git
cd med-life
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

4. Ejecuta las migraciones de base de datos:
```sql
-- En tu panel de Supabase, ejecuta:
-- database/schema.sql (crear tablas)
-- database/seed.sql (datos de ejemplo)
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                      # App Router de Next.js
│   ├── (dashboard)/          # Grupo de rutas del dashboard
│   │   ├── dashboard/        # Panel principal
│   │   ├── patients/         # Gestión de pacientes
│   │   ├── appointments/     # Agenda de citas
│   │   └── services/         # Catálogo de servicios
│   ├── api/                  # API Routes
│   │   ├── patients/         # CRUD de pacientes
│   │   ├── appointments/     # CRUD de citas
│   │   └── services/         # CRUD de servicios
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout raíz
│   └── page.tsx              # Página de inicio
├── components/               # Componentes reutilizables
│   ├── ui/                   # Componentes base (Button, Card, etc.)
│   ├── sidebar.tsx           # Navegación lateral
│   ├── data-table.tsx        # Tabla de datos reutilizable
│   └── dashboard-layout.tsx  # Layout del dashboard
├── lib/                      # Utilidades y configuración
│   ├── supabase/             # Cliente de Supabase
│   ├── types/                # Tipos TypeScript
│   └── utils.ts              # Funciones utilitarias
└── database/                 # Esquemas y migraciones
    ├── schema.sql            # Estructura de base de datos
    └── seed.sql              # Datos de ejemplo
```

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:
- **users** - Usuarios del sistema (médicos, recepcionistas, admins)
- **patients** - Información de pacientes
- **services** - Catálogo de servicios médicos
- **appointments** - Citas médicas programadas
- **medical_records** - Expedientes clínicos (SOAP + vitales)
- **campaigns** - Campañas de marketing médico
- **audit_logs** - Registro de auditoría

## 🔐 Roles y Permisos

- **Admin**: Acceso completo al sistema
- **Médico**: Pacientes, expedientes, sus citas y servicios
- **Recepción**: Agenda y pacientes (expediente solo lectura)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
