import { Router } from 'express';
import status from '../controllers/health';

const router = new Router();

router.get('/', status.get);

export default router;
