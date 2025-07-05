🛍️ Proyecto Final E-commerce - Claudio Castañeda

API REST construida con Node.js y Express, que permite realizar operaciones CRUD sobre una base de datos en Firebase Firestore. Esta API está diseñada para gestionar productos y usuarios en un sistema de ecommerce, incluyendo funcionalidades como filtrado, estadísticas y manejo avanzado de stock.

⸻

📦 Tecnologías Utilizadas
    •   Node.js
    •   Express.js
    •   Firebase Firestore
    •   CORS
    •   JWT (autenticación)
    •   Dotenv
    •   Morgan (logger HTTP)

⸻

💻 Entorno de Desarrollo
    •   💻 MacBook Air M4 – 24 GB RAM
    •   🧠 Editor: Visual Studio Code
    •   🗂️ Base de datos: Firebase Firestore
    •   🔐 Autenticación: Middleware con tokens JWT
    •   🧪 Testing y consumo de API: Postman

⸻

🔐 Autenticación

Las rutas protegidas requieren un token JWT válido.
Las rutas públicas están bajo /api/auth:
    •   POST /api/auth/register → Registro de usuario
    •   POST /api/auth/login → Inicio de sesión

⸻

🧩 Estructura del Proyecto

proyecto-final-ecommerce-claudio-castaneda/
│
├── .env                          # Variables de entorno
├── README.md                     # Documentación del proyecto
├── package.json                  # Dependencias y scripts
├── server.js                     # Punto de entrada del servidor
├── vercel.json                   # Configuración para despliegue en Vercel
│
├── src/
│   ├── controllers/              # Lógica de control para rutas
│   │   ├── authController.js
│   │   ├── estadisticaController.js
│   │   ├── productoController.js
│   │   └── usuarioController.js
│   │
│   ├── data/
│   │   └── data.js               # Datos simulados o estáticos
│   │
│   ├── middleware/              # Middlewares personalizados
│   │   ├── authentication.js
│   │   └── cors.js
│   │
│   ├── models/                  # Definición de modelos de datos
│   │   ├── Producto.js
│   │   └── Usuario.js
│   │
│   ├── routes/                  # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── estadisticaRoutes.js
│   │   ├── index.js
│   │   ├── productoRoutes.js
│   │   └── usuarioRoutes.js
│   │
│   ├── services/                # Lógica de negocio / servicios
│   │   ├── productoService.js
│   │   └── usuarioService.js
│   │
│   └── utils/                   # Funciones utilitarias
│       └── token-generator.js
⸻

🔧 Cómo iniciar el proyecto

npm run start

⸻

🧪 Rutas disponibles (para usar en Postman)

Prefijo de todas las rutas protegidas: /api
Requieren Token JWT (Bearer Token) salvo /api/auth

🔐 Autenticación

Método  Ruta                      Descripción
POST    /api/auth/register        Registro de nuevo usuario
POST    /api/auth/login           Inicio de sesión (genera token)

📁 Productos

📌 Consultas específicas

Método  Ruta                      Descripción

GET /api/filtrar                  Filtrado por múltiples criterios
GET /api/buscar?texto=keyboard    Búsqueda por texto
GET /api/con-stock                Solo productos con stock
GET /api/agotados                 Productos sin stock
GET /api/estadisticas             Métricas generales
GET /api/categorias               Lista única de categorías
GET /api/categoria/:categoria     Productos por categoría específica

🔁 CRUD General

Método  Ruta                      Descripción
GET /api/                         Todos los productos
GET /api/:id                      Producto por ID
POST    /api/                     Crear producto
PUT /api/:id                      Actualizar producto
PUT /api/:id/stock                Modificar stock manual
PUT /api/:id/reducir-stock        Reducir stock automático
DELETE  /api/:id                  Eliminar (soft delete) - Modifica el campo "activo" de true a false. (Esto lo inhabilita para la lectura pero no lo borra fisicamente)
DELETE  /api/:id/permanente       Eliminar permanente (Lo elimina fisicamente)


⸻

🧾 Ejemplo de documento - Colección Products

{
  "activo": true,
  "categoria": "accesorios",
  "nombre": "Magic Keyboard",
  "descripcion": "Teclado inalámbrico de Apple con Touch ID.",
  "fechaCreacion": "2025-06-24T00:00:00-03:00",
  "fechaActualizacion": "2025-06-24T22:46:04-03:00",
  "precio": 149.99,
  "stock": 25000000
}

Reglas sugeridas (validación lógica):
    •   precio > 0
    •   stock ≥ 0
    •   activo debe ser true o false
    •   categoria debe coincidir con un listado permitido ("accesorios", "celulares", etc.)

⸻

👤 Ejemplo de documento - Colección Users

{
  "activo": true,
  "categoria": "Silver",
  "nombre": "Juan",
  "email": "juan@mail.com",
  "edad": 30,
  "password": "juan1234",
  "descripción": "Masculino"
}

Reglas sugeridas:
    •   email único y válido
    •   edad entre 13 y 99
    •   password mínimo 8 caracteres (en producción debe estar cifrada)

⸻

🌐 Middleware
    •   corsMiddleware.js → Permite el acceso desde cualquier origen (o definido)
    •   authentication.js → Verifica tokens JWT para proteger rutas
    •   token-generator.js → Genera tokens seguros para el login

⸻

🚀 Despliegue

Este proyecto es apto para despliegue en:
    •   Vercel (incluye vercel.json)
    •   Render
    •   Railway
    •   Firebase Hosting (para frontend) + API backend externa

⸻

📫 Contacto

Desarrollado por: Claudio Castañeda
📧 Email: cgc_ar@yahoo.com.ar
🔗 GitHub: (https://github.com/Dutton-RS)
💻 Proyecto creado con mucha dedicacion y esfuerzo en Visual Studio Code – macOS Sequoia 15.5 M4
