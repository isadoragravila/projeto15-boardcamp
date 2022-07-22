import connection from "../databases/postgres.js";

async function rentalIdValidation(req, res, next) {
    const { id } = req.params;
    const { rows: rental } = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);

    if (rental.length === 0) {
        return res.sendStatus(404);
    }

    res.locals.rental = rental[0];

    next();
}

export default rentalIdValidation;