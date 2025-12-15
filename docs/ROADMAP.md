# 🗺️ Roadmap - ProjectOps Dashboard Redesign

**Última actualización**: 2025-12-15
**Branch**: `feat/tailwind-redesign`
**Estado actual**: En progreso (40% completado)

---

## 📊 Estado General

### ✅ Completado (40%)

#### 1. Setup Técnico
- ✅ Tailwind CSS 3 instalado y configurado
- ✅ `tailwind.config.js` creado con paleta de colores
- ✅ `styles.scss` configurado con directives correctas
- ✅ Build funcionando correctamente (40.78 kB CSS)
- ✅ PostCSS y Autoprefixer configurados

#### 2. Componentes Base Migrados (3/6)
- ✅ **ButtonComponent** - 7 variantes, 3 tamaños, estados hover/focus/disabled
- ✅ **CardComponent** - 4 variantes (default, elevated, bordered, glass)
- ✅ **StatusBadgeComponent** - 8 variantes, 3 tamaños, animaciones
- ❌ **ModalComponent** - Pendiente
- ❌ **OffcanvasComponent** - Pendiente
- ❌ **LoaderComponent** - Pendiente

#### 3. Layout Components (1/3)
- ✅ **HeaderComponent** - Diseño con gradiente, glassmorphism, navegación responsiva
- ❌ **SidebarComponent** - No implementado aún (opcional)
- ❌ **FooterComponent** - No implementado aún

#### 4. Features Migrados (4/5)
- ✅ **Projects Board** (ProjectsBoardComponent, ProjectCardComponent)
  - Kanban board con 4 columnas
  - Cards con gradient header y SVG patterns
  - Hover effects y transiciones

- ✅ **Tasks List** (TasksListComponent, TaskItemComponent, TaskFiltersComponent)
  - Lista de tareas con stats summary
  - Priority strips con animación
  - Filtros funcionales

- ✅ **Team Overview** (TeamOverviewComponent, MemberCardComponent)
  - Grid de miembros responsivo
  - Avatars con colores dinámicos
  - Skills chips y availability bars

- ✅ **Metrics Dashboard** (MetricsDashboardComponent, KpiCardComponent)
  - KPI cards con iconos y trends
  - Progress bars
  - Badges de tendencia con SVG arrows

- ❌ **Agents Dashboard** - No migrado aún (usa estilos SCSS antiguos)

---

## 🚧 En Progreso / Pendiente (60%)

### 🎨 Fase Crítica: REDISEÑO COMPLETO
**Prioridad**: ALTA
**Razón**: Diseño actual muy identificable como IA, necesita look profesional y minimalista

#### Problemas Identificados con el Diseño Actual:
1. **Uso excesivo de gradientes** - Demasiados gradientes de colores brillantes (primary + accent)
2. **Patrones SVG genéricos** - Los patterns de fondo son clichés de IA
3. **Animaciones obvias** - Hover effects muy predecibles (scale, shadow-xl)
4. **Colores demasiado saturados** - Primary indigo + accent pink muy común en diseños AI
5. **Glassmorphism sobreusado** - Backdrop blur en header muy "2023"
6. **Spacing inconsistente** - Algunos componentes tienen demasiado padding
7. **Falta de jerarquía visual clara** - Todo tiene la misma importancia visual

#### Nuevo Enfoque Minimalista y Profesional:

##### 1. Sistema de Color Rediseñado
```javascript
// Paleta más sobria y profesional
colors: {
  // Neutral-first approach
  gray: {
    // Usar grises cálidos, no fríos
    50: '#fafaf9',
    100: '#f5f5f4',
    // ...
    900: '#1c1917',
  },

  // Un solo color de acento (no dos)
  // Opción 1: Azul profesional (ej: Stripe, Linear)
  blue: {
    500: '#2563eb',
    600: '#1d4ed8',
    // ...
  },

  // Opción 2: Verde menta (ej: Notion, Figma)
  emerald: {
    500: '#10b981',
    600: '#059669',
    // ...
  },

  // Sin secondary accent, usar grises para contraste
}
```

##### 2. Tipografía Refinada
```javascript
fontFamily: {
  // Fuente profesional y limpia
  sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
  // Sin font-display ni font-mono a menos que sea necesario
},
fontSize: {
  // Escala más conservadora
  xs: '0.8125rem',    // 13px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  // Evitar tamaños muy grandes (3xl, 4xl, 5xl)
}
```

##### 3. Componentes Minimalistas

**ButtonComponent Rediseñado:**
```typescript
// Menos variantes, más consistencia
variants: {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-300 text-gray-700 hover:border-gray-400',
  ghost: 'text-gray-700 hover:bg-gray-100',
}

// Sin: danger, success, warning variants (sobreusados por IA)
// Sin: shadow effects ni scale transforms
// Sin: ring focus exagerados (usar subtle border)
```

**CardComponent Rediseñado:**
```typescript
// Una sola variante simple
'bg-white border border-gray-200 rounded-lg'

// Sin:
// - Glass morphism
// - Shadow-xl
// - Hover scale
// - Gradientes en headers
// - SVG patterns

// Usar bordes sutiles en lugar de sombras
```

**StatusBadgeComponent Rediseñado:**
```typescript
// Colores más apagados, backgrounds sutiles
variants: {
  active: 'bg-green-50 text-green-700 border border-green-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  // ...
}

// Sin:
// - Animated dots pulsing
// - Ring borders múltiples
// - Backgrounds muy saturados
```

##### 4. Layout Minimalista

**HeaderComponent Rediseñado:**
```html
<!-- Header simple, sin gradiente -->
<header class="border-b border-gray-200 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo simple, sans emoji -->
      <div class="text-lg font-semibold text-gray-900">
        ProjectOps
      </div>

      <!-- Nav minimalista -->
      <nav class="flex space-x-1">
        <a class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
          Projects
        </a>
        <!-- ... -->
      </nav>
    </div>
  </div>
</header>

<!-- Sin:
- Gradient backgrounds
- Glassmorphism
- Emoji icons
- Rounded pill nav items
- Backdrop blur
-->
```

##### 5. Features Rediseñadas

**ProjectCard Minimalista:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
  <!-- Sin gradient header -->
  <!-- Sin SVG patterns -->

  <!-- Header simple -->
  <div class="flex items-start justify-between mb-3">
    <h3 class="text-base font-semibold text-gray-900">
      {{ project.name }}
    </h3>
    <span class="text-xs text-gray-500">
      {{ project.status }}
    </span>
  </div>

  <p class="text-sm text-gray-600 mb-4 line-clamp-2">
    {{ project.description }}
  </p>

  <!-- Stats minimalistas -->
  <div class="flex items-center gap-4 text-xs text-gray-500">
    <span>{{ project.taskCount }} tasks</span>
    <span>{{ project.progress }}%</span>
  </div>

  <!-- Progress bar sutil -->
  <div class="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
    <div class="h-full bg-gray-900" [style.width.%]="project.progress"></div>
  </div>
</div>
```

**TaskItem Minimalista:**
```html
<div class="border-b border-gray-200 py-3 hover:bg-gray-50">
  <div class="flex items-center gap-3">
    <!-- Checkbox simple -->
    <input type="checkbox" class="rounded border-gray-300">

    <!-- Contenido -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">
        {{ task.title }}
      </p>
      <p class="text-xs text-gray-500">
        {{ task.project }}
      </p>
    </div>

    <!-- Priority badge sutil -->
    <span class="text-xs text-gray-500">
      {{ task.priority }}
    </span>

    <!-- Due date -->
    <span class="text-xs text-gray-500">
      {{ task.dueDate | date:'MMM d' }}
    </span>
  </div>
</div>

<!-- Sin:
- Priority color strips
- Animated hovers
- Iconos decorativos
-->
```

**KpiCard Minimalista:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6">
  <!-- Sin gradientes de fondo -->
  <!-- Sin iconos emoji grandes -->

  <div class="text-sm text-gray-500 mb-1">
    {{ kpi.label }}
  </div>

  <div class="flex items-baseline gap-2">
    <span class="text-2xl font-semibold text-gray-900">
      {{ kpi.value }}
    </span>
    <span class="text-sm text-gray-500">
      {{ kpi.unit }}
    </span>
  </div>

  <!-- Trend sutil -->
  <div class="mt-2 text-xs" [class]="trendClass">
    {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}% from last month
  </div>
</div>
```

**MemberCard Minimalista:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6">
  <div class="flex items-center gap-3 mb-4">
    <!-- Avatar simple, sin gradiente -->
    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <span class="text-lg font-medium text-gray-600">
        {{ member.initials }}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-semibold text-gray-900 truncate">
        {{ member.name }}
      </h3>
      <p class="text-xs text-gray-500">
        {{ member.role }}
      </p>
    </div>
  </div>

  <!-- Skills simples -->
  <div class="flex flex-wrap gap-1.5">
    <span *ngFor="let skill of member.skills"
          class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
      {{ skill }}
    </span>
  </div>
</div>
```

---

### 📋 Tareas Pendientes - Fase de Rediseño

#### Componentes Base (Rediseñar 6 componentes)
- [ ] **ButtonComponent** - Simplificar variantes, remover shadows y scales
- [ ] **CardComponent** - Una sola variante, borders en lugar de shadows
- [ ] **StatusBadgeComponent** - Colores más sutiles, sin animations
- [ ] **ModalComponent** - Crear versión minimalista
- [ ] **LoaderComponent** - Spinner simple sin colores llamativos
- [ ] **InputComponent** - Crear inputs simples (actualmente no existe)

#### Layout (Rediseñar 2 componentes)
- [ ] **HeaderComponent** - Remover gradiente, hacer minimalista
- [ ] **FooterComponent** - Crear si es necesario (actualmente no existe)

#### Features (Rediseñar 5 features)
- [ ] **Projects Board**
  - [ ] ProjectsBoardComponent - Grid más espaciado
  - [ ] ProjectCardComponent - Remover gradient header, SVG patterns
  - [ ] ProjectFiltersComponent - Filtros más sutiles

- [ ] **Tasks List**
  - [ ] TasksListComponent - Tabla más limpia
  - [ ] TaskItemComponent - Remover priority strip animado
  - [ ] TaskFiltersComponent - Simplificar

- [ ] **Team Overview**
  - [ ] TeamOverviewComponent - Grid más simple
  - [ ] MemberCardComponent - Avatar simple sin gradientes

- [ ] **Metrics Dashboard**
  - [ ] MetricsDashboardComponent - Layout más espaciado
  - [ ] KpiCardComponent - Sin gradientes, iconos emoji

- [ ] **Agents Dashboard** (No migrado)
  - [ ] AgentsDashboardComponent - Crear versión minimalista desde cero
  - [ ] AgentCardComponent - Cards simples con borders

#### Sistema de Diseño
- [ ] **Actualizar tailwind.config.js**
  - [ ] Nueva paleta de colores (neutral-first)
  - [ ] Tipografía refinada (solo Inter var)
  - [ ] Remover custom shadows exageradas
  - [ ] Remover custom animations innecesarias

- [ ] **Actualizar styles.scss**
  - [ ] Remover utilities @layer innecesarias
  - [ ] Agregar reset CSS mejorado
  - [ ] Variables CSS para temas (preparar dark mode)

#### Animaciones y Polish
- [ ] **Transiciones sutiles**
  - [ ] Usar solo `transition-colors` (no transform, scale)
  - [ ] Duration más rápida (150ms en lugar de 300ms)
  - [ ] Remover bounce, pulse animations

- [ ] **Loading states**
  - [ ] Skeleton loaders minimalistas (solo gray-200)
  - [ ] Sin shimmer effects exagerados

- [ ] **Hover states**
  - [ ] Solo cambios de color o border
  - [ ] Sin scale transforms
  - [ ] Sin shadow elevations

#### Responsive Design
- [ ] **Mobile optimization** (< 640px)
  - [ ] Reducir padding en mobile
  - [ ] Stack layouts apropiadamente
  - [ ] Touch targets 44x44px mínimo

- [ ] **Tablet** (640px - 1024px)
  - [ ] 2 columnas en grids
  - [ ] Sidebar colapsado

- [ ] **Desktop** (> 1024px)
  - [ ] Max width contenedor (no full width)
  - [ ] Spacing generoso

#### Accessibility
- [ ] **ARIA labels** - Agregar a todos los iconos
- [ ] **Focus states** - Sutiles pero visibles
- [ ] **Keyboard navigation** - Tab order lógico
- [ ] **Color contrast** - WCAG AA compliance
- [ ] **Touch targets** - Mínimo 44x44px

---

### 🧪 Testing y Optimización

#### Testing
- [ ] **Tests unitarios** - Actualizar snapshots
- [ ] **E2E tests** - Smoke tests básicos
- [ ] **Accessibility tests** - aXe o Lighthouse
- [ ] **Visual regression** - Chromatic o Percy (opcional)

#### Optimización
- [ ] **Bundle analysis** - Verificar tamaño < 500KB initial
- [ ] **CSS purge** - Verificar que funcione correctamente
- [ ] **Lighthouse audit** - Score > 90 en todas las categorías
- [ ] **Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1

---

### 📚 Documentación

- [ ] **README.md** - Actualizar con nuevo sistema de diseño
- [ ] **STYLE_GUIDE.md** - Crear guía completa
- [ ] **CHANGELOG.md** - Documentar todos los cambios
- [ ] **Component docs** - Storybook o similar (opcional)

---

## 🎯 Objetivos del Rediseño Minimalista

### Principios de Diseño

1. **Menos es más**
   - Usar solo lo necesario
   - Evitar decoraciones innecesarias
   - Priorizar contenido sobre estética

2. **Consistencia sobre variedad**
   - Pocos componentes, bien ejecutados
   - Una paleta de color (no múltiples acentos)
   - Espaciado consistente (múltiplos de 4px)

3. **Funcionalidad sobre forma**
   - Diseño al servicio del contenido
   - Interacciones predecibles
   - Sin animaciones distractoras

4. **Profesionalismo**
   - Look corporativo, no playful
   - Tipografía seria (Inter)
   - Colores sobrios (grises + un acento)

### Referencias de Diseño Profesional

- **Linear** (linear.app) - Minimalismo extremo, escala de grises
- **Stripe** (stripe.com/docs) - Profesional, azul como único acento
- **Vercel** (vercel.com) - Blanco y negro con acentos sutiles
- **Notion** (notion.so) - Limpio, funcional, sin distracciones
- **Height** (height.app) - Project management minimalista

---

## ⏱️ Estimación de Tiempo

### Rediseño Completo
- **Sistema de diseño**: 1 hora
- **Componentes base** (6): 3-4 horas
- **Layout** (2): 1 hora
- **Features** (5): 5-6 horas
- **Animaciones**: 30 min
- **Responsive**: 1 hora
- **Accessibility**: 1 hora
- **Testing**: 1-2 horas
- **Optimización**: 1 hora
- **Documentación**: 1 hora

**Total estimado**: 15-18 horas

---

## 📝 Notas Importantes

### Commits Realizados Hasta Ahora
```
4def833 feat(redesign): migrar de Tailwind 4 a Tailwind 3
62987b6 fix(styles): corregir configuración de Tailwind 4
cb6b52c chore(redesign): limpiar imports no usados
6a33e0a feat(redesign): migrar Metrics Dashboard a Tailwind 4
24626e8 feat(redesign): migrar Team Overview a Tailwind 4
```

### Próximo Commit Será
```
feat(redesign): rediseño minimalista del sistema de diseño

- Actualizar paleta de colores a neutral-first
- Simplificar tipografía (solo Inter var)
- Remover gradientes y efectos exagerados
- Nueva filosofía: profesional, limpio, minimalista
```

---

**Generado**: 2025-12-15
**Próxima revisión**: Después de recibir referencia de diseño del usuario
