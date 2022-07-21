
export async function getRentals (req, res) {
    res.status(200).send('get rentals');
}

export async function postRental (req, res) {
    res.sendStatus(201);
}

export async function finishRental (req, res) {
    res.sendStatus(200);
}

export async function deleteRental (req, res) {
    res.sendStatus(200);
}