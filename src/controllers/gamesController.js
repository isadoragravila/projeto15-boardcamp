import connection from "../databases/postgres.js";

export async function getGames(req, res) {
    const { name, offset, limit } = req.query;
    try {
        const query = `
        SELECT games.*, categories.name as "categoryName" 
        FROM games 
        JOIN categories 
        ON games."categoryId" = categories.id
        `;
        
        if (name) {
            const { rows: games } = await connection.query(`${query} WHERE LOWER(games.name) LIKE $1 LIMIT $2 OFFSET $3`, [`${name.toLowerCase()}%`, limit, offset]);
            return res.status(200).send(games);
        }

        const { rows: games } = await connection.query(`${query} LIMIT $1 OFFSET $2`, [limit, offset]);
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