import { Router } from 'express';
import controller from '../controllers/webhooks';

const router = new Router();
router.post('/discord', controller.handleDiscordEvent);

export default router;
