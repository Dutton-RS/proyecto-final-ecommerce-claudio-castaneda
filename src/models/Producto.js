
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

const productosCollection = collection(db, 'products');

class Producto {
  
  // Función para normalizar texto
  normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Obtener todos los productos activos
  async getDocs() {
    try {
      const q = query(productosCollection, where("activo", "==", true));
      const querySnapshot = await getDocs(q);
      const productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return productos;
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      throw error;
    }
  }

  // Obtener todos los productos (alias para getDocs)
  async getAll() {
    return await this.getDocs();
  }

  // Obtener producto por ID (activo)
  async getById(id) {
    try {
      const docRef = doc(productosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const producto = { id: docSnap.id, ...docSnap.data() };
        // Solo retornar si está activo
        return producto.activo ? producto : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error obteniendo producto por ID:", error);
      throw error;
    }
  }

  // Crear nuevo producto
  async create(productData) {
    try {
      const nuevoProducto = {
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        ...productData
      };
      
      const docRef = await addDoc(productosCollection, nuevoProducto);
      
      return {
        id: docRef.id,
        ...nuevoProducto
      };
    } catch (error) {
      console.error("Error creando producto:", error);
      throw error;
    }
  }

  // Actualizar producto
  async update(id, productData) {
    try {
      const docRef = doc(productosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || !docSnap.data().activo) {
        return null;
      }

      const datosActualizacion = {
        ...productData,
        fechaActualizacion: new Date()
      };

      await updateDoc(docRef, datosActualizacion);
      
      // Retornar el producto actualizado
      const productoActualizado = await getDoc(docRef);
      return {
        id: productoActualizado.id,
        ...productoActualizado.data()
      };
    } catch (error) {
      console.error("Error actualizando producto:", error);
      throw error;
    }
  }

  // Eliminar producto (soft delete)
  async delete(id) {
    try {
      const docRef = doc(productosCollection, id);
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
      console.error("Error eliminando producto:", error);
      throw error;
    }
  }

  // Eliminar producto permanentemente (hard delete)
  async deleteForever(id) {
    try {
      const docRef = doc(productosCollection, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error eliminando producto permanentemente:", error);
      throw error;
    }
  }

  // Filtrar productos
  async filter(filters = {}) {
    try {
      let q = query(productosCollection, where("activo", "==", true));
      
      // Aplicar filtros de Firestore cuando sea posible
      if (filters.categoria) {
        q = query(q, where("categoria", "==", filters.categoria));
      }

      // Para filtros adicionales (stock, etc.)
      if (filters.stock_min) {
        const stockMin = parseInt(filters.stock_min);
        if (!isNaN(stockMin)) {
          q = query(q, where("stock", ">=", stockMin));
        }
      }

      if (filters.stock_max) {
        const stockMax = parseInt(filters.stock_max);
        if (!isNaN(stockMax)) {
          q = query(q, where("stock", "<=", stockMax));
        }
      }

      if (filters.precio_min) {
        const precioMin = parseFloat(filters.precio_min);
        if (!isNaN(precioMin)) {
          q = query(q, where("precio", ">=", precioMin));
        }
      }

      if (filters.precio_max) {
        const precioMax = parseFloat(filters.precio_max);
        if (!isNaN(precioMax)) {
          q = query(q, where("precio", "<=", precioMax));
        }
      }

      // Aplicar ordenamiento si se especifica
      if (filters.ordenar) {
        switch (filters.ordenar.toLowerCase()) {
          case 'precio_asc':
            q = query(q, orderBy("precio", "asc"));
            break;
          case 'precio_desc':
            q = query(q, orderBy("precio", "desc"));
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
      let productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Filtros que requieren procesamiento en el cliente
      if (filters.nombre) {
        const nombreFiltro = this.normalizar(filters.nombre);
        productos = productos.filter(p =>
          this.normalizar(p.nombre).includes(nombreFiltro)
        );
      }

      // Si no se aplicó ordenamiento en Firestore, aplicarlo aquí
      if (filters.ordenar && !['precio_asc', 'precio_desc', 'nombre', 'fecha_desc'].includes(filters.ordenar.toLowerCase())) {
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

      return productos;
    } catch (error) {
      console.error("Error filtrando productos:", error);
      throw error;
    }
  }

  // Buscar productos por texto (búsqueda simple)
  async buscarPorTexto(texto) {
    try {
      const productos = await this.getDocs();
      const textoBusqueda = this.normalizar(texto);
      
      return productos.filter(producto => {
        const nombre = this.normalizar(producto.nombre || '');
        const descripcion = this.normalizar(producto.descripcion || '');
        const categoria = this.normalizar(producto.categoria || '');
        
        return nombre.includes(textoBusqueda) || 
               descripcion.includes(textoBusqueda) || 
               categoria.includes(textoBusqueda);
      });
    } catch (error) {
      console.error("Error buscando productos:", error);
      throw error;
    }
  }

  // Obtener productos con stock disponible
  async getConStock() {
    try {
      const q = query(
        productosCollection, 
        where("activo", "==", true),
        where("stock", ">", 0)
      );
      
      const querySnapshot = await getDocs(q);
      const productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return productos;
    } catch (error) {
      console.error("Error obteniendo productos con stock:", error);
      throw error;
    }
  }

  // Obtener productos agotados
  async getAgotados() {
    try {
      const q = query(
        productosCollection, 
        where("activo", "==", true),
        where("stock", "==", 0)
      );
      
      const querySnapshot = await getDocs(q);
      const productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return productos;
    } catch (error) {
      console.error("Error obteniendo productos agotados:", error);
      throw error;
    }
  }

  // Actualizar stock de un producto
  async actualizarStock(id, nuevoStock) {
    try {
      const docRef = doc(productosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || !docSnap.data().activo) {
        return null;
      }

      await updateDoc(docRef, {
        stock: parseInt(nuevoStock),
        fechaActualizacion: new Date()
      });
      
      const productoActualizado = await getDoc(docRef);
      return {
        id: productoActualizado.id,
        ...productoActualizado.data()
      };
    } catch (error) {
      console.error("Error actualizando stock:", error);
      throw error;
    }
  }

  // Reducir stock (útil para ventas)
  async reducirStock(id, cantidad = 1) {
    try {
      const docRef = doc(productosCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || !docSnap.data().activo) {
        return null;
      }

      const producto = docSnap.data();
      const nuevoStock = producto.stock - cantidad;
      
      if (nuevoStock < 0) {
        throw new Error("Stock insuficiente");
      }

      await updateDoc(docRef, {
        stock: nuevoStock,
        fechaActualizacion: new Date()
      });
      
      const productoActualizado = await getDoc(docRef);
      return {
        id: productoActualizado.id,
        ...productoActualizado.data()
      };
    } catch (error) {
      console.error("Error reduciendo stock:", error);
      throw error;
    }
  }
  async getPorCategoria(categoria) {
    try {
      const q = query(
        productosCollection, 
        where("activo", "==", true),
        where("categoria", "==", categoria)
      );
      
      const querySnapshot = await getDocs(q);
      const productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return productos;
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error);
      throw error;
    }
  }

  // Obtener categorías únicas
  async getCategorias() {
    try {
      const productos = await this.getDocs();
      const categorias = [...new Set(productos.map(p => p.categoria))];
      return categorias.filter(cat => cat); // Filtrar valores undefined/null
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      throw error;
    }
  }

  // Contar productos activos
  async contarProductos() {
    try {
      const productos = await this.getDocs();
      return productos.length;
    } catch (error) {
      console.error("Error contando productos:", error);
      throw error;
    }
  }
}

export default new Producto();