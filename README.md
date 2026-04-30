# Emotis Regalos

Tienda de artículos promocionales y regalos conmemorativos en Lima, Perú. Especializados en tazas, polos, piscos, vinos y artículos personalizables para bodas, cumpleaños, aniversarios y campañas corporativas.

## Estructura del Monorepo

```
emotis/
├── backend/              # Django REST Framework API
│   ├── emotis_backend/  # Configuración Django
│   ├── users/           # App: Usuarios
│   ├── products/        # App: Catálogo
│   ├── carts/           # App: Carrito
│   ├── orders/          # App: Pedidos
│   ├── coupons/         # App: Cupones
│   ├── media/           # Archivos subidos
│   ├── .env             # Variables de entorno
│   └── requirements.txt
├── frontend/            # Next.js (por implementar)
├── docker-compose.yml   # Orquestación de contenedores
└── README.md
```

## Tecnologías

### Backend
- **Python 3.14+** con **Django 6.0+**
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de datos principal
- **Simple JWT** - Autenticación JWT
- **CORS Headers** - Integración con Next.js

### Frontend (Próximamente)
- **Next.js 14+** con **React**
- **TypeScript**
- **Tailwind CSS**

## Configuración del Backend

Ver [backend/README.md](./backend/README.md) para instrucciones detalladas.

### Inicio Rápido

```bash
cd backend
python -m venv venv
.\venv\Scripts\pip.exe install -r requirements.txt
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver 8000
```

API disponible en: `http://127.0.0.1:8000/api/`

## Estado del Proyecto

- [x] Configuración inicial del monorepo
- [x] Backend Django REST Framework completo
  - [x] Modelos: Usuarios, Productos, Carrito, Pedidos, Cupones
  - [x] API endpoints con JWT
  - [x] Panel de administración
  - [x] Datos iniciales (categorías, productos, cupones)
- [ ] Frontend Next.js
- [ ] Integración completa

## Scripts Útiles

### Backend
```bash
# Crear superusuario
python manage.py createsuperuser

# Cargar datos iniciales
python manage.py loaddata products/fixtures/initial_data.json
python manage.py loaddata orders/fixtures/initial_data.json
python manage.py loaddata coupons/fixtures/initial_data.json

# Probar API
python test_api.py
```

## Equipo

Desarrollado para Emotis Regalos - Lima, Perú
