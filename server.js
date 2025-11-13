import express from 'express';
import RouterUsuarios from './router/usuariosRouter.js';
import RouterMascotas from './router/mascotasRouter.js';
import { conectarDB } from './config/db.js';

class Server {
  #port = null;
  #routerUsuarios = null;
  #routerMascotas = null;

  constructor(port) {
    this.#port = port;

    this.#routerUsuarios = RouterUsuarios;
    this.#routerMascotas = RouterMascotas;

    if (process.env.MODO_PERSISTENCIA === 'mongo') {
      conectarDB();
    }
  }

  start() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    app.use('/api/usuarios', this.#routerUsuarios);
    app.use('/api/mascotas', this.#routerMascotas);

    const server = app.listen(this.#port, () => {
      console.log(`Servidor escuchando en http://localhost:${this.#port}`);
      console.log(`Persistencia: ${process.env.MODO_PERSISTENCIA}`);
    });

    server.on('error', err => console.error(`Error en servidor: ${err.message}`));
  }
}

export default Server;
