import { Router } from 'express';
import ControllerUsuarios from '../controllers/UsuariosController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = Router();
const ctrl = new ControllerUsuarios();

router.post('/', ctrl.guardar);

router.get('/', auth, ctrl.obtenerTodos);
router.get('/:id', auth, ctrl.obtenerPorId);
router.put('/:id', auth, ctrl.actualizar);
router.delete('/:id', auth, ctrl.borrar);

router.get('/:id/mascotas', auth, ctrl.obtenerMascotasDelUsuario);

export default router;
