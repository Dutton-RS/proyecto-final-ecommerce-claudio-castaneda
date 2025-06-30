


// productoRoutes.js
import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();

// RUTAS ESPECÍFICAS DEBEN IR PRIMERO (como /filtrar, /buscar, /con-stock, etc.)
router.get('/filtrar', UsuarioController.filtrar); // <--- THIS MUST BE BEFORE /:id
router.get('/buscar', UsuarioController.buscarPorTexto); // This too
// router.get('/con-stock', UsuarioController.obtenerConStock); // This too
// router.get('/agotados', UsuarioController.obtenerAgotados); // This too
router.get('/estadisticas', UsuarioController.obtenerEstadisticas); // This too
router.get('/categorias', UsuarioController.obtenerCategorias); // This too

// RUTAS CON PARÁMETROS ESPECÍFICOS DEBEN IR ANTES DE /:id SI TIENEN NOMBRES FIJOS
router.get('/categoria/:categoria', UsuarioController.obtenerPorCategoria);


// RUTAS GENERALES (como / o /:id) VAN AL FINAL
router.get('/', UsuarioController.obtenerTodos); // For GET /api/productos
router.get('/:id', UsuarioController.obtenerPorId); // For GET /api/productos/:id

// Rutas POST/PUT/DELETE no tienen el mismo problema de orden con GET
router.post('/', UsuarioController.crear);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);
router.delete('/:id/permanente', UsuarioController.eliminarPermanentemente);
// router.put('/:id/stock', UsuarioController.actualizarStock);
// router.put('/:id/reducir-stock', UsuarioController.reducirStock);


export default router;



