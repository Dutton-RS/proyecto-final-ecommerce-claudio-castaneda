import usuarioService from '../services/usuarioService.js';
import productoService from '../services/productoService.js';

class EstadisticaController {

  async obtenerEstadisticas(req, res) {
    try {
      const { tipo } = req.query;

      if (tipo === 'usuarios') {
        const estadisticas = await usuarioService.obtenerEstadisticas();
        res.json(estadisticas);
      } else if (tipo === 'productos') {
        const estadisticas = await productoService.obtenerEstadisticas();
        res.json(estadisticas);
      } else {
        const usuarios = await usuarioService.obtenerTodos();
        const productos = await productoService.obtenerTodos();
        res.json({
          usuarios: usuarios.length,
          productos: productos.length,
          mensaje: 'Usa ?tipo=usuarios o ?tipo=productos para estadísticas específicas'
        });
      }
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  }
}

export default new EstadisticaController();