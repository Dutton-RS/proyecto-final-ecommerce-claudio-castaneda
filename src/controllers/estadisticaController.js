import UsuarioService from '../services/usuarioService.js';
import ProductoService from '../services/productoService.js';

class EstadisticaController {

  async obtenerEstadisticas(req, res) {
    try {
      const { tipo } = req.query;

      if (tipo === 'usuarios') {
        const estadisticas = await UsuarioService.obtenerEstadisticas();
        res.json(estadisticas);
      } else if (tipo === 'productos') {
        const estadisticas = await ProductoService.obtenerEstadisticas();
        res.json(estadisticas);
      } else {
        const usuarios = await UsuarioService.obtenerTodos();
        const productos = await ProductoService.obtenerTodos();
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