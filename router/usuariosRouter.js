import { Router } from 'express';
import ControllerUsuarios from '../controllers/UsuariosController.js';

const router = Router();
const ctrl = new ControllerUsuarios();

router.get('/', ctrl.obtenerTodos);
router.get('/:id', ctrl.obtenerPorId);
router.post('/', ctrl.guardar);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.borrar);
router.get('/:id/mascotas', ctrl.obtenerMascotasDelUsuario);

export default router;
