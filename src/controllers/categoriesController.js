export async function getCategories (req, res) {
    
    res.status(200).send('categories');
}

export async function postCategory (req, res) {
    
    res.sendStatus(201);
}