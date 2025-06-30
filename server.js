
// server.js

import express from 'express';
import corsMiddleware from './src/middleware/cors.js';
import routes from './src/routes/index.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRouter from './src/routes/authRoutes.js';
import { authentication } from './src/middleware/authentication.js'; // Importar middleware de autenticación

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware global
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas sin autenticación (o rutas de autenticación)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MONTAR LAS RUTAS DE AUTENTICACIÓN PRIMERO Y SIN EL MIDDLEWARE DE AUTENTICACIÓN
app.use('/api/auth', authRouter); // <--- Este path es para autenticación (login, register)

// Rutas principales de la API que SÍ requieren autenticación

app.use('/api', authentication, routes); 

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ mensaje: `Error del servidor: ${err.message}` });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
