import mongoose from 'mongoose';

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mascotasdb');
    console.log('🟢 Conectado a MongoDB');
    console.log('🟢 Base de datos:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('🔴 Error al conectar con MongoDB:', error);
  }
};
