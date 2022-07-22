import rentalsSchema from '../schemas/rentalsSchema.js';
import connection from "../databases/postgres.js";

async function rentalsValidation(req, res, next) {
    const validation = rentalsSchema.validate(req.body);

    if (validation.error) {
        return res.sendStatus(400);
    }

    const { customerId, gameId } = req.body;
    const { rows: customer } = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    const { rows: game } = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);

    if (customer.length === 0 || game.length === 0) {
        return res.sendStatus(400);
    }

    const { rows: gameRentals } = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [gameId]);

    if (game[0].stockTotal < gameRentals.length) {
        return res.sendStatus(400);
    }

    res.locals.price = game[0].pricePerDay;

    next();
}

export default rentalsValidation;