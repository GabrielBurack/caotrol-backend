import express from "express";
import tutorRouter from "./routes/tutorRouter";

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', tutorRouter);

app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
})