
import cors from 'cors';

// Configuración de CORS
const corsOptions = {
  
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', 
      'https://tu-dominio.com', 
      
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(null, false); // <--- CHANGE THIS LINE
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Encabezados permitidos
  credentials: true, // Permitir cookies y credenciales (si es necesario)
  optionsSuccessStatus: 200, // Estado para solicitudes OPTIONS
};

// Middleware de CORS
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
