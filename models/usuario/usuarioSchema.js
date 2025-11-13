import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  password: {
    type: String,
    required: true
  },
  mascotas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mascota' }]
});

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

usuarioSchema.pre('save', async function (next) {
  const existente = await mongoose.models.Usuario.findOne({ email: this.email });

  if (existente && existente._id.toString() !== this._id?.toString()) {
    return next(new Error('Ya existe un usuario con ese email'));
  }

  next();
});

usuarioSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
