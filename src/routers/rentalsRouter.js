import { Router } from 'express';
import { getRentals, postRental, finishRental, deleteRental } from '../controllers/rentalsController.js';
import rentalsValidation from '../middlewares/rentalsValidation.js';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalsValidation, postRental);
router.post('/rentals/:id/return', finishRental);
router.delete('/rentals/:id', deleteRental);

export default router;