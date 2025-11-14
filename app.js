import express from 'express';
import usuariosRouter from './router/usuariosRouter.js';
import authRouter from './router/authRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/auth', authRouter);

export default app;