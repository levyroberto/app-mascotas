import mongoose from 'mongoose';

const mascotaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  raza: { type: String, required: true },
  edad: { type: Number, required: true },
  cantidadVacunas: { type: Number, required: true },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
});

export default mongoose.model('Mascota', mascotaSchema);
