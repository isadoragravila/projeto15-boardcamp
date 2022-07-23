import connection from "../databases/postgres.js";

export async function getCategories(req, res) {
    const { offset, limit } = req.query;
    try {
        const query = 'SELECT * FROM categories';

        if (offset && limit) {
            const { rows: categories } = await connection.query(`${query} LIMIT $1 OFFSET $2`, [limit, offset]);
            return res.status(200).send(categories);
        }
        if (offset) {
            const { rows: categories } = await connection.query(`${query} OFFSET $1`, [offset]);
            return res.status(200).send(categories);
        }
        if (limit) {
            const { rows: categories } = await connection.query(`${query} LIMIT $1`, [limit]);
            return res.status(200).send(categories);
        }
        const { rows: categories } = await connection.query(query);
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