import categoriesSchema from '../schemas/categoriesSchema.js';
import connection from "../databases/postgres.js";

async function categoriesValidation(req, res, next) {
    const validation = categoriesSchema.validate(req.body);

    if (validation.error) {
        return res.sendStatus(400);
    }

    const { name } = req.body;
    
    try {
        const { rows: repeated } = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        if (repeated.length > 0) {
            return res.sendStatus(409);
        }

    } catch (error) {
        res.status(500).send(error);
    }

    next();
}

export default categoriesValidation;