import express from 'express';
import usuariosRouter from './router/usuariosRouter.js';

const app = express();
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);


export default app;