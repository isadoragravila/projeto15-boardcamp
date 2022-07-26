import connection from "../databases/postgres.js";

export async function getCustomers(req, res) {
    const { cpf, offset, limit, order, desc } = req.query;
    const orderBy = order ? `ORDER BY ${order} ${desc ? "DESC" : "ASC"}` : '';
    try {
        const queryStart = `
        SELECT customers.*, COUNT(rentals.id) AS rentalsCount 
        FROM customers 
        LEFT JOIN rentals ON customers.id = rentals."customerId"`;
        const queryEnd = `GROUP BY customers.id`;

        if (cpf) {
            const { rows: customers } = await connection.query(`${queryStart} WHERE cpf LIKE $1 ${queryEnd} ${orderBy} LIMIT $2 OFFSET $3`, [`${cpf}%`, limit, offset]);
            return res.status(200).send(customers);
        }

        const { rows: customers } = await connection.query(`${queryStart} ${queryEnd} ${orderBy} LIMIT $1 OFFSET $2`, [limit, offset]);
        return res.status(200).send(customers);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const { rows: customer } = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (!customer[0]) {
            return res.sendStatus(404);
        }

        res.status(200).send(customer[0]);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const { rows: repeatedCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (repeatedCpf.length > 0) {
            return res.sendStatus(409);
        }
        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const { rows: repeatedCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1 AND id != $2', [cpf, id]);
        if (repeatedCpf.length > 0) {
            return res.sendStatus(409);
        }

        await connection.query(`
        UPDATE customers
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5`,
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error);
    }
}