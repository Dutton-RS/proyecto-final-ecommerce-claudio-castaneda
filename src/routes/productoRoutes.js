

// productoRoutes.js
import express from 'express';
import ProductoController from '../controllers/productoController.js';

const router = express.Router();

// RUTAS ESPECÍFICAS DEBEN IR PRIMERO (como /filtrar, /buscar, /con-stock, etc.)
router.get('/filtrar', ProductoController.filtrar); // <--- THIS MUST BE BEFORE /:id
router.get('/buscar', ProductoController.buscarPorTexto); 
router.get('/con-stock', ProductoController.obtenerConStock); 
router.get('/agotados', ProductoController.obtenerAgotados); 
router.get('/estadisticas', ProductoController.obtenerEstadisticas); 
router.get('/categorias', ProductoController.obtenerCategorias); 

// RUTAS CON PARÁMETROS ESPECÍFICOS DEBEN IR ANTES DE /:id SI TIENEN NOMBRES FIJOS
router.get('/categoria/:categoria', ProductoController.obtenerPorCategoria);


// RUTAS GENERALES (como / o /:id) VAN AL FINAL
router.get('/', ProductoController.obtenerTodos); // For GET /api/productos
router.get('/:id', ProductoController.obtenerPorId); // For GET /api/productos/:id

// Rutas POST/PUT/DELETE no tienen el mismo problema de orden con GET
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);
router.delete('/:id/permanente', ProductoController.eliminarPermanentemente);
router.put('/:id/stock', ProductoController.actualizarStock);
router.put('/:id/reducir-stock', ProductoController.reducirStock);


export default router;
