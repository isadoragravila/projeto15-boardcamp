import { Router } from 'express';
import { getRentals, postRental, finishRental, deleteRental,  getMetrics } from '../controllers/rentalsController.js';
import rentalsValidation from '../middlewares/rentalsValidation.js';
import rentalIdValidation from '../middlewares/rentalIdValidation.js';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalsValidation, postRental);
router.post('/rentals/:id/return', rentalIdValidation, finishRental);
router.delete('/rentals/:id', rentalIdValidation, deleteRental);
router.get('/rentals/metrics', getMetrics);

export default router;