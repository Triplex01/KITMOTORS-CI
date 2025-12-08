# Luxe Admin Dashboard

Admin Dashboard moderno pour gestion de notificaciones push, documentos de vehículos y actualizaciones en tiempo real.

## Características

- ✅ **Autenticación de Admin** - Login seguro con JWT
- ✅ **Dashboard en Tiempo Real** - Estadísticas en vivo con WebSocket
- ✅ **Gestión de Notificaciones** - Crear y enviar push notifications
- ✅ **Gestión de Documentos** - Upload, validación y aprobación de docs
- ✅ **Gestión de Vehículos** - Aprobar mises à jour de información
- ✅ **Interfaz Moderna** - Diseño Luxury con Tailwind CSS
- ✅ **Responsive** - Mobile-first design
- ✅ **Componentes Accesibles** - Construido con Radix UI

## Stack Tecnológico

### Frontend
- **React 18** - Librería de UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Styling
- **React Router** - Enrutamiento
- **Zustand** - State management
- **Socket.IO Client** - Tiempo real
- **Axios** - HTTP client
- **React Hot Toast** - Notificaciones UI
- **React Dropzone** - File upload
- **Lucide React** - Icons
- **Day.js** - Date formatting

## Instalación

### Prerrequisitos
- Node.js >= 16
- npm o pnpm

### Pasos de instalación

```bash
# Instalar dependencias
npm install

# Instalar extensión plugin Vite React (si no está incluido)
npm install -D @vitejs/plugin-react

# Iniciar dev server
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx
│   └── Sidebar.tsx
├── pages/               # Páginas principales
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── NotificationsPage.tsx
│   ├── DocumentsPage.tsx
│   ├── VehiclesPage.tsx
│   └── SettingsPage.tsx
├── stores/              # Estado global (Zustand)
│   ├── authStore.ts
│   ├── notificationStore.ts
│   └── vehicleStore.ts
├── services/            # Servicios API y WebSocket
│   ├── api.ts
│   └── socket.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── App.tsx              # Componente raíz
├── main.tsx             # Entrada
└── index.css            # Estilos globales
```

## Páginas Principales

### 1. Login (`/login`)
- Autenticación de administrador
- JWT token management
- Validación de credenciales

### 2. Dashboard (`/`)
- Vista general de estadísticas
- Cards de KPIs (usuarios, vehículos, documentos, etc.)
- Actividades recientes
- Acciones rápidas

### 3. Notificaciones (`/notifications`)
- Crear y enviar push notifications
- Listar todas las notificaciones enviadas
- Monitorear tasa de lectura
- Filtrar por estado

### 4. Documentos (`/documents`)
- Upload drag-and-drop de PDFs
- Validación de archivos
- Aprobar/rechazar documentos
- Organización por tipo
- Download de documentos

### 5. Vehículos (`/vehicles`)
- Listar todos los vehículos
- Filtrar por estado
- Gestionar documentos asociados
- Aprobar/rechazar mises à jour de información
- Visualizar detalles del vehículo

### 6. Paramètres (`/settings`)
- Configurar notificaciones
- Ajustes de seguridad
- Límites de upload
- Preferences admin

## Variables de Entorno

```env
# API
REACT_APP_API_URL=http://localhost:3000/api

# WebSocket
REACT_APP_SOCKET_URL=http://localhost:3000

# Otros
REACT_APP_ENV=development
```

## Scripts Disponibles

```bash
npm run dev         # Iniciar dev server
npm run build       # Build para producción
npm run preview     # Preview de build
npm run lint        # Linter (ESLint)
npm run type-check  # Verificar tipos TypeScript
```

## Funcionalidades del Backend Requeridas

El proyecto espera una API REST en `http://localhost:3000` con los siguientes endpoints:

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get perfil

### Notificaciones
- `GET /api/notifications` - Listar
- `POST /api/notifications` - Crear
- `PUT /api/notifications/:id` - Actualizar
- `DELETE /api/notifications/:id` - Eliminar
- `POST /api/notifications/:id/send` - Enviar

### Vehículos
- `GET /api/vehicles` - Listar
- `GET /api/vehicles/:id` - Obtener uno
- `POST /api/vehicles` - Crear
- `PUT /api/vehicles/:id` - Actualizar

### Documentos
- `GET /api/documents` - Listar
- `GET /api/documents/vehicle/:vehicleId` - Por vehículo
- `POST /api/documents` - Upload
- `POST /api/documents/:id/approve` - Aprobar
- `POST /api/documents/:id/reject` - Rechazar

### Mises à Jour
- `GET /api/updates` - Listar
- `GET /api/updates?status=pending` - Pendientes
- `POST /api/updates/:id/approve` - Aprobar
- `POST /api/updates/:id/reject` - Rechazar

## WebSocket Events

El cliente escucha los siguientes eventos:

- `dashboard:update` - Actualización de estadísticas
- `notification:sent` - Notificación enviada
- `document:status-changed` - Cambio de estado de documento
- `vehicle:update-request` - Nueva solicitud de actualización

## Estilos y Temas

### Colores Luxury
- Primary: `#2d261c` (Luxury 900)
- Secondary: `#ffc107` (Gold)
- Background: `#faf9f7` (Luxury 50)

### Tipografía
- Serif: Playfair Display (títulos)
- Sans: Inter (body text)

## Mejoras Futuras

- [ ] Exportar reportes en PDF/Excel
- [ ] Gráficos avanzados (Chart.js, Recharts)
- [ ] Búsqueda avanzada de documentos
- [ ] Paginación de listas
- [ ] Filtros avanzados por fecha/tipo
- [ ] Integración con storage (AWS S3, Azure Blob)
- [ ] Dark mode
- [ ] Multi-idioma i18n
- [ ] 2FA (Two-Factor Authentication)
- [ ] Auditoría y logs de acciones

## Licencia

© 2025 Luxe Drive Hub. All rights reserved.
