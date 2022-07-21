
export async function getGames (req, res) {
    res.status(200).send('get games');
}

export async function postGame (req, res) {
    res.sendStatus(201);
}