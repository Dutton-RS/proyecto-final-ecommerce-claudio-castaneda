


// productoRoutes.js
import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();

// RUTAS ESPECÍFICAS 
router.get('/filtrar', UsuarioController.filtrar); 
router.get('/buscar', UsuarioController.buscarPorTexto); 
router.get('/estadisticas', UsuarioController.obtenerEstadisticas); 
router.get('/categorias', UsuarioController.obtenerCategorias); 

// RUTAS CON PARÁMETROS ESPECÍFICOS 
router.get('/categoria/:categoria', UsuarioController.obtenerPorCategoria);


// RUTAS GENERALES 
router.get('/', UsuarioController.obtenerTodos); // Para GET /api/usuarios
router.get('/:id', UsuarioController.obtenerPorId); // Para GET /api/usuarios/:id

// Rutas POST/PUT/DELETE 
router.post('/', UsuarioController.crear);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);
router.delete('/:id/permanente', UsuarioController.eliminarPermanentemente);



export default router;



