import connection from "../databases/postgres.js";

export async function getCustomers(req, res) {
    try {
        const { cpf } = req.query;

        if (cpf) {
            const { rows: customers } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${cpf}%`]);
            return res.status(200).send(customers);
        }

        const { rows: customers } = await connection.query(`SELECT * FROM customers`);
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
    res.sendStatus(200);
}