import { Router } from 'express';
import ControllerMascotas from '../controllers/MascotasController.js';

const router = Router();
const ctrl = new ControllerMascotas();

router.get('/', ctrl.obtenerTodas);
router.get('/:id', ctrl.obtenerPorId);
router.get('/usuario/:usuarioId', ctrl.obtenerPorUsuario);
router.post('/', ctrl.guardar);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.borrar);

export default router;
