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

    res.sendStatus(201);
}