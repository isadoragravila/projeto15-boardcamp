import { Router } from 'express';
import { getCategories, postCategory } from '../controllers/categoriesController.js';
import categoriesValidation from '../middlewares/categoriesValidation.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', categoriesValidation, postCategory);

export default router;