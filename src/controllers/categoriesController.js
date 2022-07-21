import connection from "../databases/postgres.js";

export async function getCategories(req, res) {
    try {
        const { rows: categories } = await connection.query('SELECT * FROM categories');
        res.status(200).send(categories);

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