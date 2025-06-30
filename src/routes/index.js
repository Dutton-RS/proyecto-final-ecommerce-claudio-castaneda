import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import productoRoutes from './productoRoutes.js';
import estadisticaRoutes from './estadisticaRoutes.js';

const router = Router();

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.json({
    mensaje: '¡Bienvenido a la API!',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      estadisticas: '/api/estadisticas'
    }
  });
});

// Rutas principales
router.use('/usuarios', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/estadisticas', estadisticaRoutes);

export default router;

