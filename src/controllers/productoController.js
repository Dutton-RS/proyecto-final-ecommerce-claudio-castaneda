


import productoService from '../services/productoService.js';

class ProductoController {
  // Obtener todos los productos activos
  async obtenerTodos(req, res) {
    try {
      const productos = await productoService.obtenerTodos();
      res.status(200).json({
        total: productos.length,
        productos
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener productos: ${error.message}` });
    }
  }

  // Obtener producto por ID
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      const producto = await productoService.obtenerPorId(id);
      res.status(200).json(producto);
    } catch (error) {
      res.status(404).json({ mensaje: error.message });
    }
  }

  // Crear un nuevo producto
  async crear(req, res) {
    try {
      const producto = await productoService.crear(req.body);
      res.status(201).json({
        mensaje: `Producto creado: ${producto.nombre} ($${producto.precio})`,
        producto
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al crear producto: ${error.message}` });
    }
  }

  // Actualizar un producto
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      const producto = await productoService.actualizar(id, req.body);
      res.status(200).json({
        mensaje: `Producto ${id} actualizado`,
        producto
      });
    } catch (error) {
      res.status(404).json({ mensaje: `Error al actualizar producto: ${error.message}` });
    }
  }

  // Eliminar un producto (soft delete)
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      const producto = await productoService.eliminar(id);
      res.status(200).json({
        mensaje: 'Producto eliminado (soft delete)',
        producto
      });
    } catch (error) {
      res.status(404).json({ mensaje: `Error al eliminar producto: ${error.message}` });
    }
  }

  // Eliminar un producto permanentemente (hard delete)
  async eliminarPermanentemente(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      const resultado = await productoService.eliminarPermanentemente(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(404).json({ mensaje: `Error al eliminar producto permanentemente: ${error.message}` });
    }
  }

  // Filtrar productos
  async filtrar(req, res) {
    try {
      const productos = await productoService.filtrar(req.query);
      res.json({
        total: productos.length,
        filtros_aplicados: req.query,
        productos
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al filtrar productos: ${error.message}` });
    }
  }


  // Buscar productos por texto
  async buscarPorTexto(req, res) {
    try {
      const { texto } = req.query;
      if (!texto) {
        return res.status(400).json({ mensaje: 'Texto de búsqueda es requerido' });
      }
      const productos = await productoService.buscarPorTexto(texto);
      res.status(200).json({
        total: productos.length,
        texto_buscado: texto,
        productos
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al buscar productos: ${error.message}` });
    }
  }

  // Obtener productos con stock
  async obtenerConStock(req, res) {
    try {
      const productos = await productoService.obtenerConStock();
      res.status(200).json({
        total: productos.length,
        productos
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener productos con stock: ${error.message}` });
    }
  }

  // Obtener productos agotados
  async obtenerAgotados(req, res) {
    try {
      const productos = await productoService.obtenerAgotados();
      res.status(200).json({
        total: productos.length,
        productos
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener productos agotados: ${error.message}` });
    }
  }

  // Actualizar stock de un producto
  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      if (typeof stock !== 'number') {
        return res.status(400).json({ mensaje: 'Stock debe ser un número' });
      }
      const producto = await productoService.actualizarStock(id, stock);
      res.status(200).json({
        mensaje: `Stock del producto ${id} actualizado a ${stock}`,
        producto
      });
    } catch (error) {
      res.status(404).json({ mensaje: `Error al actualizar stock: ${error.message}` });
    }
  }

  // Reducir stock de un producto
  async reducirStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      if (!id) {
        return res.status(400).json({ mensaje: 'ID de producto es requerido' });
      }
      if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ mensaje: 'Cantidad debe ser un número positivo' });
      }
      const producto = await productoService.reducirStock(id, cantidad);
      res.status(200).json({
        mensaje: `Stock del producto ${id} reducido en ${cantidad}`,
        producto
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al reducir stock: ${error.message}` });
    }
  }

  // Obtener productos por categoría
  async obtenerPorCategoria(req, res) {
    try {
      const { categoria } = req.params;
      if (!categoria) {
        return res.status(400).json({ mensaje: 'Categoría es requerida' });
      }
      const productos = await productoService.obtenerPorCategoria(categoria);
      res.status(200).json({
        total: productos.length,
        categoria,
        productos
      });
    } catch (error) {
      res.status(400).json({ mensaje: `Error al obtener productos por categoría: ${error.message}` });
    }
  }

  // Obtener todas las categorías
  async obtenerCategorias(req, res) {
    try {
      const categorias = await productoService.obtenerCategorias();
      res.status(200).json({
        total: categorias.length,
        categorias
      });
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener categorías: ${error.message}` });
    }
  }

  // Obtener estadísticas de productos
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await productoService.obtenerEstadisticas();
      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(500).json({ mensaje: `Error al obtener estadísticas: ${error.message}` });
    }
  }
}

export default new ProductoController();