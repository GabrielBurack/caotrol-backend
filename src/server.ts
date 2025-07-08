import express from "express";
import tutorRouter from "./routes/tutorRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import especieRouter from "./routes/especieRoutes";
import racaRouter from "./routes/racaRoutes";
import animalRouter from "./routes/animalRoutes";
import veterinarioRouter from "./routes/veterinarioRoutes";

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', tutorRouter);
app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', especieRouter);
app.use('/api', racaRouter);
app.use('/api', animalRouter);
app.use('/api', veterinarioRouter);


app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
})