import rentalsSchema from '../schemas/rentalsSchema.js';

async function rentalsValidation (req, res, next) {
    const validation = rentalsSchema.validate(req.body);

    if (validation.error) {
        
        return res.sendStatus(400);
    }

    //validar se customerId existe no banco de dados, se não - 400
    //validar se gameId existe no banco de dados, se não - 400
    //verificar se existem jogos disponíveis, não ter alugueis em aberto acima da quantidade de jogos em estoque, se não - 400

    next();
}

export default rentalsValidation;