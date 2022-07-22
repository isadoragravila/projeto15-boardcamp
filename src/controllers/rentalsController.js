import connection from "../databases/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    res.status(200).send('get rentals');
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const price = res.locals.price;

    try {
        await connection.query(`
        INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, daysRented * price, null]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;
    const rental = res.locals.rental;

    if (rental.returnDate) {
        return res.sendStatus(400);
    }

    const returnDate = dayjs().format('YYYY-MM-DD');
    const dateDiff = dayjs(returnDate).diff(dayjs(rental.rentDate), 'day');
    let delayFee = null;

    try {
        const { rows: price } = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [rental.gameId]);

        if (rental.daysRented < dateDiff) {
            delayFee = price[0].pricePerDay * (dateDiff - rental.daysRented);
        }

        await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [returnDate, delayFee, id]);

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRental(req, res) {
    res.sendStatus(200);
}