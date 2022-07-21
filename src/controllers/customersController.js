
export async function getCustomers (req, res) {
    res.status(200).send('get customer');
}

export async function getCustomerById (req, res) {
    res.status(200).send('get customer by id');
}

export async function postCustomer (req, res) {
    res.sendStatus(201);
}

export async function updateCustomer (req, res) {
    res.sendStatus(200);
}