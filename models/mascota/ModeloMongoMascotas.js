import MascotaModel from './mascotaSchema.js';

class ModeloMongoMascotas {
  async obtenerTodos() {
    return await MascotaModel.find();
  }

  async obtenerTodosConUsuarios() {
    return await MascotaModel.find().populate('usuarioId', 'nombreCompleto email');
  }

  async obtenerPorId(id) {
    return await MascotaModel.findById(id).populate('usuarioId', 'nombreCompleto email');
  }

  async obtenerPorUsuario(usuarioId) {
    return await MascotaModel.find({ usuarioId }).populate('usuarioId', 'nombreCompleto email');
  }

  async guardar(mascota) {
    return await MascotaModel.create(mascota);
  }

  async actualizar(id, datos) {
    return await MascotaModel.findByIdAndUpdate(id, datos, { new: true });
  }

  async borrar(id) {
    return await MascotaModel.findByIdAndDelete(id);
  }
}

export default ModeloMongoMascotas;
