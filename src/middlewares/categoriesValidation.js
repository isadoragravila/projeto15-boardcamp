import categoriesSchema from '../schemas/categoriesSchema.js';

async function categoriesValidation (req, res, next) {
    const validation = categoriesSchema.validate(req.body);

    if (validation.error) {
        
        return res.sendStatus(400);
    }

    //validar se categoria já existe no banco de dados

    next();
}

export default categoriesValidation;