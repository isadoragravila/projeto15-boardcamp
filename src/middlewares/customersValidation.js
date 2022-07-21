import customersSchema from '../schemas/customersSchema.js';

async function customersValidation (req, res, next) {
    const validation = customersSchema.validate(req.body);

    if (validation.error) {
        
        return res.sendStatus(400);
    }

    //validar se cpf existe no banco de dados, se sim - 409

    next();
}

export default customersValidation;