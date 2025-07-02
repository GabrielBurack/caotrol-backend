import express from "express";
import tutorRouter from "./routes/tutorRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', tutorRouter);
app.use('/api', userRouter);
app.use('/api', authRouter);

app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
})