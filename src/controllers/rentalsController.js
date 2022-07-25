import connection from "../databases/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const { customerId, gameId, offset, limit, order, desc, status } = req.query;
    const orderBy = order ? `ORDER BY ${order} ${desc ? "DESC" : "ASC"}` : '';
    let rentals = [];
    let rentalStatus = '';
    if (status === 'open') {
        rentalStatus = `"returnDate" IS NULL`;
    } else if (status === 'closed') {
        rentalStatus = `"returnDate" IS NOT NULL`;
    }
    try {
        const query = `
        SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" 
        FROM rentals 
        JOIN customers ON rentals."customerId" = customers.id 
        JOIN games ON rentals."gameId" = games.id 
        JOIN categories ON games."categoryId" = categories.id`;

        if (customerId) {
            const aux = status ? 'AND' : '';
            const { rows } = await connection.query(`${query} WHERE "customerId" = $1 ${aux} ${rentalStatus} ${orderBy} LIMIT $2 OFFSET $3`, [customerId, limit, offset]);
            rentals = [...rows];
        } else if (gameId) {
            const aux = status ? 'AND' : '';
            const { rows } = await connection.query(`${query} WHERE "gameId" = $1 ${aux} ${rentalStatus} ${orderBy} LIMIT $2 OFFSET $3`, [gameId, limit, offset]);
            rentals = [...rows];
        } else {
            const aux = status ? 'WHERE' : '';
            const { rows } = await connection.query(`${query} ${aux} ${rentalStatus} ${orderBy} LIMIT $1 OFFSET $2`, [limit, offset]);
            rentals = [...rows];
        }

        rentals.map(rental => {
            rental.customer = {
                id: rental.customerId,
                name: rental.customerName
            };
            rental.game = {
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
                categoryName: rental.categoryName
            }
            delete rental.customerName;
            delete rental.gameName;
            delete rental.categoryId;
            delete rental.categoryName;
        })
        res.status(200).send(rentals);

    } catch (error) {
        res.status(500).send(error);
    }
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
    const { id } = req.params;
    const rental = res.locals.rental;

    if (!rental.returnDate) {
        return res.sendStatus(400);
    }
    try {
        await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        return res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error);
    }
}