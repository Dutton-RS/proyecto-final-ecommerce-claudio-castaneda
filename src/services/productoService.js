

import Producto from '../models/Producto.js';

class ProductoService {
  // Obtener todos los productos activos
  async obtenerTodos() {
    try {
      return await Producto.getAll();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Obtener producto por ID
  async obtenerPorId(id) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      const producto = await Producto.getById(id);
      if (!producto) throw new Error('Producto no encontrado o no está activo');
      return producto;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // Crear un nuevo producto
  async crear(datosProducto) {
    try {
      if (!datosProducto.nombre || !datosProducto.precio || !datosProducto.categoria) {
        throw new Error('Nombre, precio y categoría son requeridos');
      }
      if (datosProducto.precio <= 0) throw new Error('El precio debe ser mayor a 0');
      if (typeof datosProducto.stock !== 'undefined' && datosProducto.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      const productoNormalizado = {
        ...datosProducto,
        nombre: datosProducto.nombre.trim(),
        categoria: datosProducto.categoria.trim(),
        stock: datosProducto.stock || 0,
        descripcion: datosProducto.descripcion?.trim() || ''
      };

      return await Producto.create(productoNormalizado);
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Actualizar un producto
  async actualizar(id, datosProducto) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      if (datosProducto.nombre && datosProducto.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
      }
      if (datosProducto.precio && datosProducto.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      if (typeof datosProducto.stock !== 'undefined' && datosProducto.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      const datosNormalizados = {
        ...datosProducto,
        nombre: datosProducto.nombre?.trim(),
        categoria: datosProducto.categoria?.trim(),
        descripcion: datosProducto.descripcion?.trim()
      };

      const producto = await Producto.update(id, datosNormalizados);
      if (!producto) throw new Error('Producto no encontrado o no está activo');
      return producto;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // Eliminar un producto (soft delete)
  async eliminar(id) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      const producto = await Producto.delete(id);
      if (!producto) throw new Error('Producto no encontrado o no está activo');
      return producto;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  // Eliminar un producto permanentemente (hard delete)
  async eliminarPermanentemente(id) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      const resultado = await Producto.deleteForever(id);
      if (!resultado) throw new Error('No se pudo eliminar el producto');
      return { message: 'Producto eliminado permanentemente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto permanentemente: ${error.message}`);
    }
  }

  // Filtrar productos
  async filtrar(filtros) {
    try {
      if (filtros.precio_min && filtros.precio_min < 0) {
        throw new Error('El precio mínimo no puede ser negativo');
      }
      if (filtros.precio_max && filtros.precio_max < 0) {
        throw new Error('El precio máximo no puede ser negativo');
      }
      if (filtros.stock_min && filtros.stock_min < 0) {
        throw new Error('El stock mínimo no puede ser negativo');
      }
      if (filtros.stock_max && filtros.stock_max < 0) {
        throw new Error('El stock máximo no puede ser negativo');
      }

      return await Producto.filter(filtros);
    } catch (error) {
      throw new Error(`Error al filtrar productos: ${error.message}`);
    }
  }


  // Buscar productos por texto
  async buscarPorTexto(texto) {
    try {
      if (!texto || texto.trim() === '') throw new Error('Texto de búsqueda es requerido');
      return await Producto.buscarPorTexto(texto.trim());
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`);
    }
  }

  // Obtener productos con stock
  async obtenerConStock() {
    try {
      return await Producto.getConStock();
    } catch (error) {
      throw new Error(`Error al obtener productos con stock: ${error.message}`);
    }
  }

  // Obtener productos agotados
  async obtenerAgotados() {
    try {
      return await Producto.getAgotados();
    } catch (error) {
      throw new Error(`Error al obtener productos agotados: ${error.message}`);
    }
  }

  // Actualizar stock de un producto
  async actualizarStock(id, nuevoStock) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      if (typeof nuevoStock !== 'number' || nuevoStock < 0) {
        throw new Error('El stock debe ser un número no negativo');
      }
      const producto = await Producto.actualizarStock(id, nuevoStock);
      if (!producto) throw new Error('Producto no encontrado o no está activo');
      return producto;
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  // Reducir stock de un producto
  async reducirStock(id, cantidad = 1) {
    try {
      if (!id) throw new Error('ID de producto es requerido');
      if (typeof cantidad !== 'number' || cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
      }
      const producto = await Producto.reducirStock(id, cantidad);
      if (!producto) throw new Error('Producto no encontrado o no está activo');
      return producto;
    } catch (error) {
      throw new Error(`Error al reducir stock: ${error.message}`);
    }
  }

  // Obtener productos por categoría
  async obtenerPorCategoria(categoria) {
    try {
      if (!categoria || categoria.trim() === '') throw new Error('Categoría es requerida');
      return await Producto.getPorCategoria(categoria.trim());
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`);
    }
  }

  // Obtener todas las categorías
  async obtenerCategorias() {
    try {
      return await Producto.getCategorias();
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  // Obtener estadísticas de productos
  async obtenerEstadisticas() {
    try {
      const productos = await Producto.getAll();
      const total = await Producto.contarProductos();
      const precioPromedio = total > 0 
        ? productos.reduce((sum, p) => sum + p.precio, 0) / total 
        : 0;

      const categorias = productos.reduce((acc, p) => {
        acc[p.categoria] = (acc[p.categoria] || 0) + 1;
        return acc;
      }, {});

      const stockTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
      const productosAgotados = await Producto.getAgotados();

      return {
        tipo: 'productos',
        total,
        precio_promedio: Math.round(precioPromedio * 100) / 100,
        stock_total: stockTotal,
        productos_agotados: productosAgotados.length,
        por_categoria: categorias
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

export default new ProductoService();