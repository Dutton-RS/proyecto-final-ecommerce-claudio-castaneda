import { Router } from 'express';
import EstadisticaController from '../controllers/estadisticaController.js';

const router = Router();

router.get('/', EstadisticaController.obtenerEstadisticas); // Obtener estadísticas generales o específicas

export default router;