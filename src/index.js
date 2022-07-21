import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouter from "./routers/categoriesRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoriesRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor funcionando na porta ${PORT}`));
