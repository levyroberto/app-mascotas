import Usuario from './usuarioSchema.js';
import Mascota from '../mascota/mascotaSchema.js';

class ModeloMongoUsuarios {
  async obtenerTodos() {
    return await Usuario.find();
  }

  async obtenerPorId(id) {
    return await Usuario.findById(id);
  }

  async guardar(usuario) {
    try {
      return await Usuario.create(usuario);
    } catch (error) {
      if (error.message.includes('email') || error.code === 11000) {
        throw new Error('Ya existe un usuario con ese correo electrónico');
      }
      throw new Error('Error al guardar el usuario');
    }
  }

  async agregarMascota(id, mascotaId) {
    return await Usuario.findByIdAndUpdate(id, { $push: { mascotas: mascotaId } }, { new: true });
  }
 
  async borrarMascota(id, mascotaId) {
    return await Usuario.findByIdAndUpdate(id, { $pull: { mascotas: mascotaId } }, { new: true });
  }

  async actualizar(id, datos) {
    return await Usuario.findByIdAndUpdate(id, datos, { new: true });
  }

  async borrar(id) {
    await Mascota.deleteMany({ usuarioId: id });
    return await Usuario.findByIdAndDelete(id);
  }
}

export default ModeloMongoUsuarios;
