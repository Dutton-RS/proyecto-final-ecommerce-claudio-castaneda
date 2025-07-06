

// productoRoutes.js
import express from 'express';
import ProductoController from '../controllers/productoController.js';

const router = express.Router();

// RUTAS ESPECÍFICAS 
router.get('/filtrar', ProductoController.filtrar); 
router.get('/buscar', ProductoController.buscarPorTexto); 
router.get('/con-stock', ProductoController.obtenerConStock); 
router.get('/agotados', ProductoController.obtenerAgotados); 
router.get('/estadisticas', ProductoController.obtenerEstadisticas); 
router.get('/categorias', ProductoController.obtenerCategorias); 

// RUTAS CON PARÁMETROS ESPECÍFICOS 
router.get('/categoria/:categoria', ProductoController.obtenerPorCategoria);


// RUTAS GENERALES 
router.get('/', ProductoController.obtenerTodos); // Para GET /api/productos
router.get('/:id', ProductoController.obtenerPorId); // Para GET /api/productos/:id

// Rutas POST/PUT/DELETE 
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);
router.delete('/:id/permanente', ProductoController.eliminarPermanentemente);
router.put('/:id/stock', ProductoController.actualizarStock);
router.put('/:id/reducir-stock', ProductoController.reducirStock);


export default router;
