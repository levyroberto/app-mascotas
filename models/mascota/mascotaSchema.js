import mongoose from 'mongoose';

const mascotaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  raza: { type: String, required: true },
  edad: { type: Number, required: false, default: null },
  foto: { type: String, required: false, default: null },
  cantidadVacunas: { type: Number, required: false, default: 0 },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
});

export default mongoose.model('Mascota', mascotaSchema);
