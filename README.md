# ProjectOps Dashboard

Dashboard interno para gestión de proyectos construido con Angular 20 (Signals, Zoneless y Standalone) con sistema multi-agente inteligente integrado.

## Características

- Angular 20 con arquitectura standalone
- Change Detection Zoneless
- Signals para manejo de estado reactivo
- Lazy loading de módulos
- Sistema de diseño modular
- TypeScript 5.8 estricto
- **Sistema Multi-Agente con Claude Code** - 8 agentes especializados para desarrollo automatizado
- Base de datos JSON local con persistencia en localStorage

## Estructura del Proyecto

```
projectops-dashboard/
├── .claude/
│   └── agents/                # Sistema Multi-Agente Claude Code
│       ├── README.md          # Guía completa del sistema
│       ├── meta-project-manager.md
│       ├── database-agent.md
│       ├── fullstack-agent.md
│       ├── tester-agent.md
│       ├── ui-ux-agent.md
│       ├── security-agent.md
│       ├── optimization-agent.md
│       └── documentation-agent.md
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── agents/        # Infraestructura del sistema de agentes
│   │   │   │   ├── models/    # Interfaces y tipos
│   │   │   │   ├── services/  # Motor de agentes, registry, comunicación
│   │   │   │   ├── strategies/# Estrategias de coordinación
│   │   │   │   └── executors/ # Ejecutores de acciones
│   │   │   ├── services/      # Servicios core (DB, Auth, etc.)
│   │   │   ├── models/        # Modelos de dominio
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   └── guards/        # Route guards
│   │   ├── shared/            # Componentes, pipes compartidos
│   │   ├── features/          # Módulos de funcionalidades
│   │   │   ├── projects/      # Gestión de proyectos
│   │   │   ├── tasks/         # Gestión de tareas
│   │   │   ├── team/          # Gestión del equipo
│   │   │   ├── metrics/       # Dashboard de métricas
│   │   │   └── agents/        # Dashboard de agentes (NEW)
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── database.json      # Base de datos JSON local
│   ├── styles/                # Estilos globales
│   └── environments/          # Configuración de entornos
└── ...
```

## Tecnologías

- Angular 20
- TypeScript 5.6
- SCSS
- Chart.js (para métricas)
- pnpm (gestor de paquetes)

## Requisitos Previos

- Node.js 18+
- pnpm 9.0.0+

Si no tienes pnpm instalado:

```bash
npm install -g pnpm
```

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm start
```

La aplicación estará disponible en `http://localhost:4200/`

## Build

```bash
pnpm build
```

Los archivos de producción se generarán en el directorio `dist/`

## Características de Angular 20

### Zoneless Change Detection
La aplicación utiliza el sistema de detección de cambios sin Zone.js mediante:
```typescript
provideExperimentalZonelessChangeDetection()
```

### Signals
Todos los servicios utilizan Signals para manejo de estado reactivo:
```typescript
private projectsState = signal<Project[]>([]);
readonly projects = this.projectsState.asReadonly();
```

### Standalone Components
Todos los componentes son standalone, no requieren NgModules.

## Rutas Principales

- `/projects` - Board de proyectos
- `/projects/:id` - Detalle de proyecto
- `/tasks` - Lista de tareas
- `/tasks/:id` - Detalle de tarea
- `/team` - Vista del equipo
- `/metrics` - Dashboard de métricas
- `/agents` - **Dashboard de Agentes IA** (Nuevo)

## API Endpoints

La aplicación espera los siguientes endpoints:

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/team`
- `GET /api/metrics`

## Comandos Útiles con pnpm

```bash
# Instalar dependencias
pnpm install

# Agregar una dependencia
pnpm add <paquete>

# Agregar una dependencia de desarrollo
pnpm add -D <paquete>

# Actualizar dependencias
pnpm update

# Limpiar caché de pnpm
pnpm store prune

# Ver árbol de dependencias
pnpm list --depth=1
```

## Ventajas de pnpm

- **Eficiencia de espacio**: Usa enlaces simbólicos para compartir dependencias entre proyectos
- **Velocidad**: Instalación más rápida que npm y yarn
- **Seguridad**: Manejo estricto de dependencias y peer dependencies
- **Determinismo**: Lockfile consistente entre máquinas

## Configuración

Configurar la URL de la API en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## Sistema Multi-Agente con Claude Code

Este proyecto incluye un sistema multi-agente inteligente que permite automatizar tareas de desarrollo usando Claude Code.

### Arquitectura del Sistema

```
Usuario
   ↓
Meta Project Manager (Coordinador)
   ├→ Database Agent        (Operaciones de BD)
   ├→ Fullstack Agent       (Desarrollo Angular/TypeScript)
   ├→ Tester Agent          (Tests unitarios y E2E)
   ├→ UI/UX Agent           (Diseño de interfaces)
   ├→ Security Agent        (Auditorías de seguridad)
   ├→ Optimization Agent    (Optimización de performance)
   └→ Documentation Agent   (Generación de documentación)
   ↓
Consolidated Result
```

### 8 Agentes Especializados

#### 🎯 Meta Project Manager
**Coordinador principal** que analiza solicitudes, descompone tareas complejas, asigna trabajo a agentes especializados y consolida resultados.

#### 🗄️ Database Agent
**Especialista en bases de datos** - Maneja CRUD, schemas, migraciones y validaciones de datos.

#### 💻 Fullstack Agent
**Desarrollador Full-Stack** - Experto en Angular 20, TypeScript 5.8, Signals y arquitectura de aplicaciones.

#### 🧪 Tester Agent
**Especialista en Testing** - Crea tests unitarios, E2E y analiza cobertura de código.

#### 🎨 UI/UX Agent
**Diseñador de Interfaces** - Especialista en componentes visuales, responsive design y accesibilidad WCAG 2.1.

#### 🔒 Security Agent
**Auditor de Seguridad** - Escanea vulnerabilidades, verifica OWASP compliance y valida inputs.

#### ⚡ Optimization Agent
**Optimizador de Performance** - Mejora velocidad, reduce bundle size, detecta memory leaks.

#### 📚 Documentation Agent
**Generador de Documentación** - Crea y mantiene documentación técnica, README y diagramas.

### Cómo Usar el Sistema de Agentes

#### Opción 1: Invocar al Meta Agent (Recomendado)

Para tareas complejas que requieren múltiples agentes:

```
@meta-project-manager Implementar sistema de notificaciones en tiempo real con base de datos, UI, tests y documentación
```

El Meta Agent automáticamente:
1. Analiza la solicitud
2. Descompone en subtareas
3. Asigna a los agentes apropiados
4. Coordina la ejecución
5. Consolida y reporta resultados

#### Opción 2: Invocar Agentes Específicos

Para tareas específicas:

```
@database-agent Crear schema para tabla de notificaciones

@fullstack-agent Implementar servicio de notificaciones

@ui-ux-agent Diseñar componente de notificaciones

@tester-agent Generar tests para NotificationService

@security-agent Auditar seguridad del sistema de notificaciones

@documentation-agent Documentar API de notificaciones
```

### Ejemplos de Uso

**Crear una nueva feature completa:**
```
@meta-project-manager Crear feature de comentarios en tareas:
- Base de datos para almacenar comentarios
- Servicio y componente Angular
- UI responsive y accesible
- Tests con 80%+ coverage
- Documentación completa
```

**Auditoría y mejora:**
```
@meta-project-manager Auditar el módulo de autenticación:
- Escanear vulnerabilidades
- Optimizar performance
- Verificar cobertura de tests
- Actualizar documentación
```

### Dashboard de Agentes

Visita `/agents` para monitorear:
- Estado de todos los agentes
- Cola de tareas
- Métricas de performance
- Logs de comunicación entre agentes

Para más información detallada sobre el sistema de agentes, consulta [.claude/agents/README.md](.claude/agents/README.md)
