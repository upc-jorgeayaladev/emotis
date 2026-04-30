# Emotis Regalos - Frontend

Frontend para la tienda de artículos promocionales y regalos conmemorativos "Emotis Regalos" en Lima, Perú.

## Tecnologías

- **Next.js 16+** con **React 19+**
- **TypeScript**
- **Tailwind CSS** para estilos
- **Axios** para cliente HTTP
- **Context API** para gestión de estado

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── layout.tsx         # Layout principal con providers
│   │   ├── page.tsx          # Página de inicio
│   │   ├── login/            # Login
│   │   ├── register/         # Registro
│   │   ├── products/         # Catálogo
│   │   │   ├── page.tsx      # Lista de productos
│   │   │   └── [slug]/      # Detalle de producto
│   │   ├── cart/             # Carrito
│   │   ├── checkout/         # Finalizar compra
│   │   └── orders/          # Pedidos
│   │       ├── page.tsx      # Lista de pedidos
│   │       └── [id]/        # Detalle de pedido
│   ├── components/           # Componentes reutilizables
│   ├── context/              # Context providers
│   │   ├── AuthContext.tsx   # Autenticación
│   │   └── CartContext.tsx   # Carrito
│   ├── lib/                  # Utilidades
│   │   └── api.ts           # Cliente API (axios)
│   └── types/                # Tipos TypeScript
│       └── index.ts
├── public/                   # Archivos estáticos
├── .env.local               # Variables de entorno
└── package.json
```

## Configuración

### Variables de Entorno (.env.local)

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## Funcionalidades

### Página Principal
- Hero section con CTA
- Categorías destacadas
- Productos destacados
- Navegación con carrito y autenticación

### Autenticación
- Registro de usuarios con campos específicos para Perú
- Login con JWT (access y refresh tokens)
- Persistencia de sesión en localStorage
- Renovación automática de token

### Catálogo
- Lista de productos con filtros
- Búsqueda por texto
- Filtro por categoría
- Ordenamiento (precio, fecha)
- Página de detalle con variantes
- Opciones de personalización

### Carrito
- Agregar productos con variantes y personalización
- Actualizar cantidades
- Eliminar items
- Resumen de pedido
- Persistencia en backend

### Checkout
- Formulario de dirección de envío
- Selección de método de envío
- Aplicación de cupones de descuento
- Cálculo de totales

### Pedidos
- Lista de pedidos del usuario
- Detalle de pedido con estado
- Historial de compras

## Integración con Backend

El frontend se conecta al backend Django REST Framework mediante:
- **API Client** (`src/lib/api.ts`): Centraliza todas las llamadas a la API
- **JWT Tokens**: Almacenados en localStorage
- **Interceptors**: Renovación automática de tokens expirados
- **CORS**: Configurado en backend para `http://localhost:3000`

## Scripts Disponibles

```bash
npm run dev      # Servidor desarrollo en localhost:3000
npm run build    # Construir para producción
npm run start    # Servidor producción
npm run lint     # Linter
```

## Notas

- El frontend asume que el backend corre en `http://127.0.0.1:8000`
- Las imágenes se sirven desde el backend Django
- La autenticación usa JWT con refresh tokens
- El carrito es persistente y se sincroniza con el backend
