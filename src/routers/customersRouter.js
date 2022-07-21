import { Router } from 'express';
import { getCustomers, getCustomerById, postCustomer, updateCustomer } from '../controllers/customersController.js';
import customersValidation from '../middlewares/customersValidation.js';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', customersValidation, postCustomer);
router.put('/customers/:id', customersValidation, updateCustomer);

export default router;