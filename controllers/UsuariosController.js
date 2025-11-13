import Usuario  from '../models/usuario/index.js';
import Mascota from '../models/mascota/index.js';

class ControllerUsuarios {
  obtenerTodos = async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const usuario = await Usuario.obtenerPorId(req.params.id);
      if (!usuario || (!usuario.id && !usuario._id)) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  };

  guardar = async (req, res) => {
    try {
      const { nombreCompleto, direccion, email, password } = req.body;
  
      if (!nombreCompleto || nombreCompleto.trim() === "") {
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }
  
      if (!email || email.trim() === "") {
        return res.status(400).json({ message: "El email es obligatorio" });
      }

      if (!password || password.trim() === "") {
        return res.status(400).json({ message: "La contraseña es obligatoria" });
      }
  
      const nuevo = await Usuario.guardar({ 
        nombreCompleto, 
        direccion, 
        email, 
        password 
      });
      res.status(201).json({ message: 'Usuario creado correctamente', usuario: nuevo });
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const actualizado = await Usuario.actualizar(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  };

  borrar = async (req, res) => {
    try {
      const borrado = await Usuario.borrar(req.params.id);
      if (!borrado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado', borrado });
    } catch (error) {
      res.status(500).json({ message: 'Error al borrar usuario', error: error.message });
    }
  };

  obtenerMascotasDelUsuario = async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await ModeloMongoUsuarios.obtenerPorId(id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      const mascotas = await Mascota.obtenerPorUsuario(id);

      res.json({
        usuario: {
          id: usuario._id,
          nombreCompleto: usuario.nombreCompleto,
          email: usuario.email,
        },
        mascotas,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener mascotas del usuario', error: error.message });
    }
  };
}

export default ControllerUsuarios;
