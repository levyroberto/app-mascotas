import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  direccion: { type: String, required: false },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mascotas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mascota' }]
});

usuarioSchema.pre('save', async function (next) {
  const existente = await mongoose.models.Usuario.findOne({ email: this.email });
  if (existente) {
    return next(new Error('Ya existe un usuario con ese email'));
  }
  next();
});

usuarioSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('El email ya está registrado'));
  } else {
    next(error);
  }
});

export default mongoose.model('Usuario', usuarioSchema);
