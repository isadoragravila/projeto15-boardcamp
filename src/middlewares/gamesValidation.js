import gamesSchema from '../schemas/gamesSchema.js';
import connection from "../databases/postgres.js";

async function gamesValidation(req, res, next) {
    const validation = gamesSchema.validate(req.body);

    if (validation.error) {
        return res.sendStatus(400);
    }

    const { name, categoryId } = req.body;

    try {
        const { rows: repeated } = await connection.query('SELECT * FROM games WHERE name = $1', [name]);
        if (repeated.length > 0) {
            return res.sendStatus(409);
        }

        const { rows: category } = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        if (category.length === 0) {
            return res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).send(error);
    }

    next();
}

export default gamesValidation;