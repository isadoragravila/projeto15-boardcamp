import connection from "../databases/postgres.js";

export async function getGames(req, res) {
    const { name, offset, limit, order, desc } = req.query;
    const orderBy = order ? `ORDER BY ${order} ${desc ? "DESC" : "ASC"}` : '';
    try {
        const queryStart = `
        SELECT games.*, categories.name as "categoryName", COUNT(rentals.id) AS rentalsCount
        FROM games
        LEFT JOIN rentals ON games.id = rentals."gameId" 
        JOIN categories ON games."categoryId" = categories.id
        `;
        const queryEnd = `GROUP BY games.id, categories.name`;

        
        if (name) {
            const { rows: games } = await connection.query(`${queryStart} WHERE LOWER(games.name) LIKE $1 ${queryEnd} ${orderBy} LIMIT $2 OFFSET $3`, [`${name.toLowerCase()}%`, limit, offset]);
            return res.status(200).send(games);
        }

        const { rows: games } = await connection.query(`${queryStart} ${queryEnd} ${orderBy} LIMIT $1 OFFSET $2`, [limit, offset]);
        return res.status(200).send(games);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
        VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}