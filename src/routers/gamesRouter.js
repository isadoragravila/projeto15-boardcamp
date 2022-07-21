import { Router } from 'express';
import { getGames, postGame } from '../controllers/gamesController.js';
import gamesValidation from '../middlewares/gamesValidation.js';

const router = Router();

router.get('/games', getGames);
router.post('/games', gamesValidation, postGame);

export default router;