import gamesSchema from '../schemas/gamesSchema.js';

async function gamesValidation (req, res, next) {
    const validation = gamesSchema.validate(req.body);

    if (validation.error) {
        
        return res.sendStatus(400);
    }

    //validar se categoriaId existe no banco de dados, se não - 400
    //validar se name existe no banco de dados, se sim - 409

    next();
}

export default gamesValidation;