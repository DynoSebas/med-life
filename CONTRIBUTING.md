# Contribución a Med-Life

¡Gracias por tu interés en contribuir a Med-Life! Este documento proporciona pautas para contribuir a este proyecto.

## 🤝 Cómo Contribuir

### 1. Fork del Proyecto
1. Fork el repositorio en GitHub
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/med-life.git
   cd med-life
   ```

### 2. Configurar Desarrollo
1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno siguiendo el README.md

3. Ejecuta el proyecto en desarrollo:
   ```bash
   npm run dev
   ```

### 3. Crear una Nueva Feature
1. Crea una rama desde main:
   ```bash
   git checkout -b feature/nombre-de-la-feature
   ```

2. Realiza tus cambios siguiendo las convenciones del código

3. Haz commits siguiendo las convenciones:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```

### 4. Enviar Pull Request
1. Push a tu fork:
   ```bash
   git push origin feature/nombre-de-la-feature
   ```

2. Crea un Pull Request desde GitHub

## 📝 Convenciones de Código

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comillas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o corregir tests
- `chore:` Cambios en build o herramientas auxiliares

### Código TypeScript
- Usar TypeScript estricto
- Tipos explícitos cuando sea necesario
- Nombres descriptivos para variables y funciones
- Comentarios JSDoc para funciones públicas

### React/Next.js
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Uso de Server Components cuando sea posible
- Manejo de estados con useState/useContext según corresponda

### CSS/Tailwind
- Usar clases de Tailwind antes que CSS custom
- Componentes de UI reutilizables
- Design responsive mobile-first

## 🐛 Reportar Bugs

Usa GitHub Issues para reportar bugs. Incluye:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Screenshots** si es relevante
5. **Información del entorno** (OS, browser, versión de Node)

## 💡 Solicitar Features

Para solicitar nuevas funcionalidades:

1. Busca si ya existe un issue similar
2. Describe claramente la funcionalidad deseada
3. Explica el caso de uso y beneficios
4. Incluye mockups o ejemplos si es posible

## 🔍 Process de Review

### Criterios de Aceptación
- [ ] Código sigue las convenciones establecidas
- [ ] Tests pasando (cuando aplique)
- [ ] Documentación actualizada
- [ ] No introduce breaking changes sin justificación
- [ ] Performance no se ve afectada negativamente

### Revisores
- Al menos un maintainer debe aprovar el PR
- Los cambios críticos requieren 2 aprobaciones
- Feedback constructivo es bienvenido

## 🚀 Releases

### Versionado
Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible hacia atrás
- **PATCH**: Bug fixes compatibles hacia atrás

### Changelog
Mantenemos un CHANGELOG.md actualizado con:
- Nuevas features
- Bug fixes
- Breaking changes
- Deprecaciones

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## ❓ Preguntas

Si tienes preguntas sobre contribución:
- Abre un issue con la etiqueta "question"
- Contacta a los maintainers
- Revisa las discusiones existentes

## 🙏 Reconocimientos

Agradecemos a todos los contribuidores que hacen posible Med-Life. Cada contribución, sin importar el tamaño, es valiosa para el proyecto.

---

**¡Gracias por contribuir a Med-Life!** 🏥✨