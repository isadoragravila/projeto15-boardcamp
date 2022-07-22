import connection from "../databases/postgres.js";
import dayjs from "dayjs";

export async function getRentals (req, res) {
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
            [customerId, gameId, rentDate, daysRented, null, daysRented * price , null]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function finishRental(req, res) {
    res.sendStatus(200);
}

export async function deleteRental(req, res) {
    res.sendStatus(200);
}