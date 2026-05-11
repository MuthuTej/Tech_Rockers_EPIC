import { Router } from 'express';
import { authGoogle, getUsers } from '../controllers/userController';

const router = Router();

router.post('/auth', authGoogle);
router.get('/', getUsers);

export default router;
