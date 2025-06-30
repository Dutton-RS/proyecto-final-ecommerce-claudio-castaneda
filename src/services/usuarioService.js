


// // src/services/UsuarioService.js

import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs'; 

class UsuarioService {
  // Obtener todos los usuarios activos
  async obtenerTodos() {
    try {
      return await Usuario.getAll();
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Obtener usuario por ID
  async obtenerPorId(id) {
    try {
      if (!id) throw new Error('ID de usuario es requerido');
      const usuario = await Usuario.getById(id);
      if (!usuario) throw new Error('Usuario no encontrado o no está activo');
      return usuario;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  // Crear un nuevo usuario
  async crear(datosUsuario) {
    try {
      // Validaciones mejoradas para usuario (email y password)
      if (!datosUsuario.nombre || !datosUsuario.email || !datosUsuario.password || !datosUsuario.categoria) {
        throw new Error('Nombre, email, contraseña y categoría son requeridos.');
      }
      if (datosUsuario.edad !== undefined && datosUsuario.edad <= 0) { // Check for existence before checking value
        throw new Error('La edad debe ser mayor a 0');
      }
      if (datosUsuario.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
      }
      if (datosUsuario.email.trim() === '') {
        throw new Error('El email no puede estar vacío');
      }
      if (datosUsuario.password.trim() === '') {
        throw new Error('La contraseña no puede estar vacía');
      }
      if (datosUsuario.categoria.trim() === '') {
        throw new Error('La categoría no puede estar vacía');
      }

      // --- MODIFICACIÓN CLAVE AQUÍ ---
      // Hash the password BEFORE creating the user
      const hashedPassword = await bcrypt.hash(datosUsuario.password, 10); // 10 es el costo del salt (rondas), un buen valor
      // --- FIN MODIFICACIÓN CLAVE ---

      const usuarioNormalizado = {
        ...datosUsuario,
        nombre: datosUsuario.nombre.trim(),
        email: datosUsuario.email.trim(), // Asegurarse de normalizar también el email
        password: hashedPassword, // <--- Guardar la contraseña HASHEADA
        categoria: datosUsuario.categoria.trim(),
        edad: datosUsuario.edad || 0, // Asegurarse que edad tiene un valor por defecto si no viene
        descripcion: datosUsuario.descripcion?.trim() || ''
      };

      // Opcional: Verificar si ya existe un usuario con ese email antes de crear
      const existingUser = await Usuario.getByEmail(usuarioNormalizado.email);
      if (existingUser) {
        throw new Error('Ya existe un usuario registrado con este email.');
      }

      return await Usuario.create(usuarioNormalizado);
    } catch (error) {
      // Re-lanzar el error para que sea manejado por el controlador
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Actualizar un usuario
  async actualizar(id, datosUsuario) {
    try {
      if (!id) throw new Error('ID de usuario es requerido');
      if (!datosUsuario || Object.keys(datosUsuario).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar.');
      }

      const datosNormalizados = {};

      if (datosUsuario.nombre !== undefined) {
        const trimmedNombre = datosUsuario.nombre?.trim();
        if (trimmedNombre === '') throw new Error('El nombre no puede estar vacío');
        datosNormalizados.nombre = trimmedNombre;
      }

      if (datosUsuario.edad !== undefined) {
        if (datosUsuario.edad <= 0) throw new Error('La edad debe ser mayor a 0');
        datosNormalizados.edad = datosUsuario.edad;
      }

      if (datosUsuario.categoria !== undefined) {
        const trimmedCategoria = datosUsuario.categoria?.trim();
        if (trimmedCategoria === '') throw new Error('La categoría no puede estar vacía');
        datosNormalizados.categoria = trimmedCategoria;
      }

      if (datosUsuario.descripcion !== undefined) {
        datosNormalizados.descripcion = datosUsuario.descripcion?.trim();
      }

      // MODIFICACIÓN: Si la contraseña se está actualizando, también debe ser hasheada
      if (datosUsuario.password !== undefined && datosUsuario.password.trim() !== '') {
        datosNormalizados.password = await bcrypt.hash(datosUsuario.password, 10);
      }

      datosNormalizados.fechaActualizacion = new Date();

      if (Object.keys(datosNormalizados).length === 1 && datosNormalizados.fechaActualizacion) {
          throw new Error('No se proporcionaron campos válidos para actualizar.');
      }

      const usuario = await Usuario.update(id, datosNormalizados);
      if (!usuario) throw new Error('Usuario no encontrado o no está activo');
      return usuario;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Eliminar un usuario (soft delete)
  async eliminar(id) {
    try {
      if (!id) throw new Error('ID de usuario es requerido');
      const usuario = await Usuario.delete(id);
      if (!usuario) throw new Error('Usuario no encontrado o no está activo');
      return usuario;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Eliminar un usuario permanentemente (hard delete)
  async eliminarPermanentemente(id) {
    try {
      if (!id) throw new Error('ID de usuario es requerido');
      const resultado = await Usuario.deleteForever(id);
      if (!resultado) throw new Error('No se pudo eliminar el usuario');
      return { message: 'Usuario eliminado permanentemente' };
    } catch (error) {
      throw new Error(`Error al eliminar usuario permanentemente: ${error.message}`);
    }
  }

  // Filtrar usuarios
  async filtrar(filtros) {
    try {
      if (filtros.edad_min && filtros.edad_min < 0) {
        throw new Error('La edad mínima no puede ser negativa');
      }
      if (filtros.edad_max && filtros.edad_max < 0) {
        throw new Error('La edad máxima no puede ser negativo');
      }
      if (filtros.nombre && filtros.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
      }
      if (filtros.categoria && filtros.categoria.trim() === '') {
        throw new Error('La categoría no puede estar vacía');
      }
      if (filtros.edad_min && filtros.edad_max && filtros.edad_min > filtros.edad_max) {
        throw new Error('La edad mínima no puede ser mayor que la máxima');
      }

      return await Usuario.filter(filtros);
    } catch (error) {
      throw new Error(`Error al filtrar usuario: ${error.message}`);
    }
  }

  // Buscar productos por texto (cambiado a usuarios)
  async buscarPorTexto(texto) {
    try {
      if (!texto || texto.trim() === '') throw new Error('Texto de búsqueda es requerido');
      return await Usuario.buscarPorTexto(texto.trim());
    } catch (error) {
      throw new Error(`Error al buscar usuarios: ${error.message}`);
    }
  }

  // Obtener productos por categoría (cambiado a usuarios)
  async obtenerPorCategoria(categoria) {
    try {
      // Necesitas implementar getPorCategoria en Usuario.js si quieres usarlo
      // Actualmente, tu Usuario.js tiene el método getCategorias, pero no getPorCategoria
      // Si Usuario.js no tiene getPorCategoria, esta línea causará un error
      // Puedes implementar un método similar a filter con un filtro directo por categoría.
      throw new Error('Método obtenerPorCategoria no implementado en el modelo Usuario.');
      // return await Usuario.getPorCategoria(categoria.trim());
    } catch (error) {
      throw new Error(`Error al obtener usuarios por categoría: ${error.message}`);
    }
  }

  // Obtener todas las categorías
  async obtenerCategorias() {
    try {
      return await Usuario.getCategorias();
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  // Obtener estadísticas de usuarios
  async obtenerEstadisticas() {
    try {
      const usuarios = await Usuario.getAll();
      const total = await Usuario.contarUsuarios();
      const edadPromedio = total > 0
        ? usuarios.reduce((sum, p) => sum + p.edad, 0) / total
        : 0;

      const categorias = usuarios.reduce((acc, p) => {
        acc[p.categoria] = (acc[p.categoria] || 0) + 1;
        return acc;
      }, {});


      return {
        tipo: 'usuarios',
        total,
        edad_promedio: Math.round(edadPromedio * 100) / 100,
        por_categoria: categorias
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

export default new UsuarioService();



