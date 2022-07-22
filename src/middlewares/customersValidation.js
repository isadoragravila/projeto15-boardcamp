import customersSchema from '../schemas/customersSchema.js';
import connection from "../databases/postgres.js";

async function customersValidation (req, res, next) {
    const validation = customersSchema.validate(req.body);

    if (validation.error) {
        return res.sendStatus(400);
    }

    const { cpf } = req.body;
    try {
        const { rows: repeatedCpf } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (repeatedCpf.length > 0) {
            return res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send(error);
    }

    next();
}

export default customersValidation;