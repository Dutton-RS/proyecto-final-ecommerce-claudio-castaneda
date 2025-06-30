
import { db } from "../data/data.js"; // Importa la configuración de Firebase
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

const usuariosCollection = collection(db, 'users');


class Usuario {
  
  // Función para normalizar texto
  normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Obtener todos los usuarios activos
  async getDocs() {
    try {
      const q = query(usuariosCollection, where("activo", "==", true));
      const querySnapshot = await getDocs(q);
      const usuarios = [];
      
      querySnapshot.forEach((doc) => {
        usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return usuarios;
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      throw error;
    }
  }

  // Obtener todos los usuarios (alias para getDocs)
  async getAll() {
    return await this.getDocs();
  }

  // Obtener usuario por ID (activo)
  async getById(id) {
    try {
      const docRef = doc(usuariosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const usuario = { id: docSnap.id, ...docSnap.data() };
        // Solo retornar si está activo
        return usuario.activo ? usuario : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error obteniendo usuario por ID:", error);
      throw error;
    }
  }

  // Crear nuevo usuario
  async create(userData) {
    try {
      const nuevoUsuario = {
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        ...userData
      };
      
      const docRef = await addDoc(usuariosCollection, nuevoUsuario);
      
      return {
        id: docRef.id,
        ...nuevoUsuario
      };
    } catch (error) {
      console.error("Error creando usuario:", error);
      throw error;
    }
  }

  // Actualizar usuario
  async update(id, userData) {
    try {
      const docRef = doc(usuariosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || !docSnap.data().activo) {
        return null;
      }

      const datosActualizacion = {
        ...userData,
        fechaActualizacion: new Date()
      };

      await updateDoc(docRef, datosActualizacion);
      
      // Retornar el usuario actualizado
      const usuarioActualizado = await getDoc(docRef);
      return {
        id: usuarioActualizado.id,
        ...usuarioActualizado.data()
      };
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      throw error;
    }
  }

  // Eliminar producto (soft delete)
  async delete(id) {
    try {
      const docRef = doc(usuariosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || !docSnap.data().activo) {
        return null;
      }

      await updateDoc(docRef, {
        activo: false,
        fechaEliminacion: new Date()
      });

      return {
        id: docSnap.id,
        ...docSnap.data(),
        activo: false
      };
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      throw error;
    }
  }

  // Eliminar usuario permanentemente (hard delete)
  async deleteForever(id) {
    try {
      const docRef = doc(usuariosCollection, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error eliminando usuario permanentemente:", error);
      throw error;
    }
  }
//-------------COMIENZO adaptacion TOKEN a Usuarios---------------------------------------------------------------


  // MODIFICACIÓN NECESARIA AQUÍ: Método para obtener usuario por email
  async getByEmail(email) { // <-- This is the method the authController expects
    try {
      // Create a query to find documents where the 'email' field matches the provided email
      const q = query(usuariosCollection, where('email', '==', email));
      
      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if any documents were found
      if (querySnapshot.empty) {
        return null; // No user found with that email
      }

      // Assuming email is unique, return the first document found.
      // If emails are not unique, you might need to handle multiple results or enforce uniqueness.
      const docSnap = querySnapshot.docs[0]; // Get the first document from the results
      
      // Return the user data, including its ID
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error("Error obteniendo usuario por email:", error);
      throw error; // Re-throw the error for the service/controller to handle
    }
  }

  
//-------------FIN adaptacion TOKEN a Usuarios---------------------------------------------------------------

  // Filtrar usuarios
  async filter(filters = {}) {
    try {
      let q = query(usuariosCollection, where("activo", "==", true));
      
      // Aplicar filtros de Firestore cuando sea posible
      if (filters.categoria) {
        q = query(q, where("categoria", "==", filters.categoria));
      }


      if (filters.edad_min) {
        const edadMin = parseFloat(filters.edad_min);
        if (!isNaN(edadMin)) {
          q = query(q, where("edad", ">=", edadMin));
        }
      }

      if (filters.edad_max) {
        const edadMax = parseFloat(filters.edad_max);
        if (!isNaN(edadMax)) {
          q = query(q, where("edad", "<=", edadMax));
        }
      }

      // Aplicar ordenamiento si se especifica
      if (filters.ordenar) {
        switch (filters.ordenar.toLowerCase()) {
          case 'edad_asc':
            q = query(q, orderBy("edad", "asc"));
            break;
          case 'edad_desc':
            q = query(q, orderBy("edad", "desc"));
            break;
          case 'nombre':
            q = query(q, orderBy("nombre", "asc"));
            break;
          case 'fecha_desc':
            q = query(q, orderBy("fechaCreacion", "desc"));
            break;
        }
      }

      // Aplicar límite si se especifica
      if (filters.limite) {
        const limite = parseInt(filters.limite);
        if (!isNaN(limite) && limite > 0) {
          q = query(q, limit(limite));
        }
      }

      const querySnapshot = await getDocs(q);
      let usuarios = [];
      
      querySnapshot.forEach((doc) => {
        usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Filtros que requieren procesamiento en el cliente
      
      if (filters.nombre) {
        const nombreFiltro = this.normalizar(filters.nombre);
        usuarios = usuarios.filter(p =>
          this.normalizar(p.nombre).includes(nombreFiltro)
        );
      }

      // Si no se aplicó ordenamiento en Firestore, aplicarlo aquí
      if (filters.ordenar && !['edad_asc', 'edad_desc', 'nombre', 'fecha_desc'].includes(filters.ordenar.toLowerCase())) {
        // Ordenamientos personalizados adicionales
        switch (filters.ordenar.toLowerCase()) {
          case 'nombre_desc':
            productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
          case 'fecha_asc':
            productos.sort((a, b) => a.fechaCreacion - b.fechaCreacion);
            break;
        }
      }

      return usuarios;
    } catch (error) {
      console.error("Error filtrando usuarios:", error);
      throw error;
    }
  }

  // Buscar usuarios por texto (búsqueda simple)
  async buscarPorTexto(texto) {
    try {
      const usuarios = await this.getDocs();
      const textoBusqueda = this.normalizar(texto);
      
      return usuarios.filter(usuario => {
        const nombre = this.normalizar(usuario.nombre || '');
        const descripcion = this.normalizar(usuario.descripcion || '');
        const categoria = this.normalizar(usuario.categoria || '');
        
        return nombre.includes(textoBusqueda) || 
               descripcion.includes(textoBusqueda) || 
               categoria.includes(textoBusqueda);
      });
    } catch (error) {
      console.error("Error buscando usuarios:", error);
      throw error;
    }
  }

  

  // Obtener categorías únicas
  async getCategorias() {
    try {
      const usuarios = await this.getDocs();
      const categorias = [...new Set(usuarios.map(p => p.categoria))];
      return categorias.filter(cat => cat); // Filtrar valores undefined/null
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      throw error;
    }
  }

  // Contar usuarios activos
  async contarUsuarios() {
    try {
      const usuarios = await this.getDocs();
      return usuarios.length;
    } catch (error) {
      console.error("Error contando usuarios:", error);
      throw error;
    }
  }
}

export default new Usuario();