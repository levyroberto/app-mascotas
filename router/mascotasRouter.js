import { Router } from 'express';
import ControllerMascotas from '../controllers/MascotasController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = Router();
const ctrl = new ControllerMascotas();


router.get('/', auth, ctrl.obtenerTodas);
router.get('/:id', auth, ctrl.obtenerPorId);
router.get('/usuario/:usuarioId', auth, ctrl.obtenerPorUsuario);

router.post('/', auth, ctrl.guardar);
router.put('/:id', auth, ctrl.actualizar);
router.delete('/:id', auth, ctrl.borrar);

export default router;
