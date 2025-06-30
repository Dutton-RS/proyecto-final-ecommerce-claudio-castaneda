

import UsuarioService from '../services/usuarioService.js';

class UsuarioController {
  // Obtener todos los usuarios activos
  async obtenerTodos(req, res) {
    try {
      const usuarios = await UsuarioService.obtenerTodos();
      res.status(200).json({
        total: usuarios.length,
        usuarios
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener usuarios: ${error.message}` });
    }
  }

  // Obtener usuario por ID
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de usuario es requerido' });
      }
      const usuario = await UsuarioService.obtenerPorId(id);
      res.status(200).json(usuario);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }

  // Crear un nuevo usuario
  async crear(req, res) {
    try {
      const usuario = await UsuarioService.crear(req.body);
      res.status(201).json({
        mensaje: `Usuario creado: ${usuario.nombre}`,
        usuario
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al crear usuario: ${error.message}` });
    }
  }

  // Actualizar un usuario
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de usuario es requerido' });
      }
      const usuario = await UsuarioService.actualizar(id, req.body);
      res.status(200).json({
        mensaje: `Usuario ${id} actualizado`,
        usuario
      });
    } catch (error) {
      res.status(404).json({ mensaje: `Error al actualizar usuario: ${error.message}` });
    }
  }

  // Eliminar un producto (soft delete)
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de usuario es requerido' });
      }
      const usuario = await UsuarioService.eliminar(id);
      res.status(200).json({
        mensaje: 'Usuario eliminado (soft delete)',
        usuario
      });
    } catch (error) {
      res.status(404).json({ mensaje: `Error al eliminar usuario: ${error.message}` });
    }
  }

  // Eliminar un producto permanentemente (hard delete)
  async eliminarPermanentemente(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de usuario es requerido' });
      }
      const resultado = await UsuarioService.eliminarPermanentemente(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(404).json({ mensaje: `Error al eliminar usuario permanentemente: ${error.message}` });
    }
  }

  // Filtrar usuarios
  async filtrar(req, res) {
    try {
      const usuarios = await UsuarioService.filtrar(req.query);
      res.json({
        total: usuarios.length,
        filtros_aplicados: req.query,
        usuarios
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al filtrar usuarios: ${error.message}` });
    }
  }

  // Buscar usuarios por texto
  async buscarPorTexto(req, res) {
    try {
      const { texto } = req.query;
      if (!texto) {
        return res.status(400).json({ mensaje: 'Texto de búsqueda es requerido' });
      }
      const usuarios = await UsuarioService.buscarPorTexto(texto);
      res.status(200).json({
        total: usuarios.length,
        texto_buscado: texto,
        usuarios
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al buscar usuarios: ${error.message}` });
    }
  }

  // Obtener productos por categoría
  async obtenerPorCategoria(req, res) {
    try {
      const { categoria } = req.params;
      if (!categoria) {
        return res.status(400).json({ mensaje: 'Categoría es requerida' });
      }
      const usuarios = await UsuarioService.obtenerPorCategoria(categoria);
      res.status(200).json({
        total: usuarios.length,
        categoria,
        usuarios
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al obtener usuarios por categoría: ${error.message}` });
    }
  }

  // Obtener todas las categorías
  async obtenerCategorias(req, res) {
    try {
      const categorias = await UsuarioService.obtenerCategorias();
      res.status(200).json({
        total: categorias.length,
        categorias
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener categorías: ${error.message}` });
    }
  }

  // Obtener estadísticas de usuarios
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await UsuarioService.obtenerEstadisticas();
      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener estadísticas: ${error.message}` });
    }
  }
}

export default new UsuarioController();
