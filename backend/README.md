# Emotis Regalos - Backend API

Backend para la tienda de artículos promocionales y regalos conmemorativos "Emotis Regalos" ubicada en Lima, Perú.

## Tecnologías

- **Python 3.14+**
- **Django 6.0+**
- **Django REST Framework**
- **PostgreSQL** (producción) / **SQLite** (desarrollo)
- **Simple JWT** para autenticación
- **CORS Headers** para integración con Next.js
- **Django Filter** para filtrado avanzado

## Estructura del Proyecto

```
backend/
├── emotis_backend/          # Configuración principal Django
│   ├── settings.py         # Configuración (env, CORS, JWT, DRF)
│   ├── urls.py             # Rutas principales
│   └── wsgi.py
├── users/                  # App: Usuarios y autenticación
│   ├── models.py          # CustomUser, UserAddress
│   ├── serializers.py     # Registro, login, perfil
│   ├── views.py           # API endpoints
│   └── admin.py          # Panel de administración
├── products/              # App: Catálogo de productos
│   ├── models.py         # Category, Product, ProductVariant, ProductImage
│   ├── serializers.py    # Serializers anidados
│   ├── views.py          # ViewSets con filtros
│   └── admin.py          # Gestión en admin
├── carts/                 # App: Carrito de compras
│   ├── models.py         # Cart, CartItem
│   ├── serializers.py
│   ├── views.py
│   └── admin.py
├── orders/                # App: Pedidos
│   ├── models.py         # Order, OrderItem, ShippingMethod
│   ├── serializers.py
│   ├── views.py
│   └── admin.py
├── coupons/               # App: Cupones y descuentos
│   ├── models.py         # Coupon, CouponUsage
│   ├── serializers.py
│   ├── views.py
│   └── admin.py
├── fixtures/              # Datos iniciales
├── media/                 # Archivos subidos (imágenes)
├── .env                   # Variables de entorno
└── manage.py
```

## Configuración

### 1. Variables de Entorno (.env)

```env
SECRET_KEY=tu_clave_secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL (descomentar para producción)
# DB_NAME=emotis_db
# DB_USER=postgres
# DB_PASSWORD=tu_password
# DB_HOST=localhost
# DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 2. Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# O instalar manualmente:
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary python-dotenv pillow django-filter
```

### 3. Migraciones y Datos Iniciales

```bash
# Aplicar migraciones
python manage.py migrate

# Cargar datos iniciales (categorías, productos, métodos de envío, cupones)
python manage.py loaddata products/fixtures/initial_data.json
python manage.py loaddata orders/fixtures/initial_data.json
python manage.py loaddata coupons/fixtures/initial_data.json

# Crear superusuario
python manage.py createsuperuser
```

### 4. Ejecutar Servidor

```bash
python manage.py runserver 8000
```

La API estará disponible en: `http://127.0.0.1:8000/api/`

## Endpoints de la API

### Autenticación (`/api/users/`)

- `POST /api/users/register/` - Registro de usuario
- `POST /api/users/login/` - Login (obtiene JWT tokens)
- `POST /api/users/logout/` - Logout (blacklist token)
- `GET /api/users/profile/` - Perfil del usuario
- `GET/POST /api/users/addresses/` - Listar/crear direcciones
- `GET/PUT/DELETE /api/users/addresses/<id>/` - Detalle de dirección
- `POST /api/token/` - Obtener JWT token (SimpleJWT)
- `POST /api/token/refresh/` - Refresh token

### Productos (`/api/products/`)

- `GET /api/products/categories/` - Listar categorías
- `GET /api/products/categories/<slug>/` - Detalle de categoría
- `GET /api/products/products/` - Listar productos (filtros: `?category=1`, `?search=taza`, `?ordering=base_price`)
- `GET /api/products/products/<slug>/` - Detalle de producto
- `GET /api/products/variants/` - Listar variantes
- `GET /api/products/images/` - Listar imágenes
- `GET /api/products/customization-options/` - Opciones de personalización

### Carrito (`/api/carts/`)

- `GET /api/carts/cart/` - Ver carrito actual
- `POST /api/carts/items/` - Agregar item al carrito
- `PUT /api/carts/items/<id>/` - Actualizar cantidad
- `DELETE /api/carts/items/<id>/` - Eliminar item
- `DELETE /api/carts/clear/` - Vaciar carrito

### Pedidos (`/api/orders/`)

- `GET /api/orders/shipping-methods/` - Métodos de envío
- `GET/POST /api/orders/orders/` - Listar/crear pedidos
- `GET /api/orders/orders/<id>/` - Detalle de pedido

## Modelos Principales

### Usuarios
- **CustomUser**: Usuario personalizado con email como username, teléfono, dirección en Lima
- **UserAddress**: Múltiples direcciones de envío por usuario

### Productos
- **Category**: Categorías y subcategorías (Tazas, Polos, Piscos, Bodas, etc.)
- **Product**: Productos base con precio y opción de personalización
- **ProductVariant**: Variantes con JSONField para atributos (talla, color)
- **ProductImage**: Imágenes de productos
- **CustomizationOption**: Opciones de personalización (texto, imagen, archivo)

### Carrito y Pedidos
- **Cart**: Carrito persistente (usuario o sesión)
- **CartItem**: Items con cantidad y datos de personalización JSON
- **Order**: Pedido con dirección, método de envío, cupón
- **OrderItem**: Items del pedido con precio histórico

### Cupones
- **Coupon**: Cupones con descuento porcentual o fijo, fechas de validez
- **CouponUsage**: Registro de uso de cupones

## Características

- ✓ Autenticación JWT con SimpleJWT
- ✓ CORS configurado para Next.js
- ✓ Filtros y búsqueda en productos
- ✓ Carrito persistente en backend
- ✓ Soporte para productos personalizables
- ✓ Variantes con atributos flexibles (JSONField)
- ✓ Cupones y descuentos
- ✓ Panel de administración configurado
- ✓ Datos iniciales de ejemplo

## Pruebas

```bash
# Ejecutar script de pruebas
python test_api.py
```

## Migración a PostgreSQL

Para usar PostgreSQL en producción:

1. Descomentar configuración de PostgreSQL en `settings.py`
2. Crear base de datos: `createdb emotis_db`
3. Configurar variables en `.env`
4. Ejecutar migraciones: `python manage.py migrate`

## Admin Panel

Acceder a: `http://127.0.0.1:8000/admin/`

Credenciales por defecto:
- Email: `admin@emotis.com`
- Password: `admin123`
