import connection from "../databases/postgres.js";

export async function getCategories(req, res) {
    const { offset, limit, order, desc } = req.query;
    const orderBy = order ? `ORDER BY ${order} ${desc ? "DESC" : "ASC"}` : '';
    try {
        const query = `SELECT * FROM categories ${orderBy} LIMIT $1 OFFSET $2`;

        const { rows: categories } = await connection.query(query, [limit, offset]);
        return res.status(200).send(categories);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCategory(req, res) {
    const { name } = req.body;
    try {
        await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}