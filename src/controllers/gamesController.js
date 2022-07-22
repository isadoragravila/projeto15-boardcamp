import connection from "../databases/postgres.js";

export async function getGames(req, res) {
    try {
        const { name } = req.query;

        if (name) {
            const { rows: games } = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games
            JOIN categories
            ON games."categoryId" = categories.id
            WHERE games.name LIKE $1
            `, [`${name}%`]);
            return res.status(200).send(games);
        }

        const { rows: games } = await connection.query(`
        SELECT games.*, categories.name as "categoryName" FROM games
        JOIN categories
        ON games."categoryId" = categories.id
    `);
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