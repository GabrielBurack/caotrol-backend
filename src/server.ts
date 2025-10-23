import express from "express";
import cors from "cors";
import tutorRouter from "./routes/tutorRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import especieRouter from "./routes/especieRoutes";
import racaRouter from "./routes/racaRoutes";
import animalRouter from "./routes/animalRoutes";
import veterinarioRouter from "./routes/veterinarioRoutes";
import tarefasAgendadasService from "./services/tarefasAgendadasService";
import agendamentoRouter from "./routes/agendamentoRoutes";
import consultaRouter from "./routes/consultaRoutes";
import anamneseRouter from "./routes/anamneseRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import vacinaRouter from "./routes/vacinaRoutes";
import relatorioRouter from "./routes/relatorioRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import exameRouter from "./routes/exameRoutes";
import prescricaoRouter from "./routes/prescricaoRoutes";
import cidadeRouter from "./routes/cidadeRoutes";
import estadoRouter from "./routes/estadoRoutes";
import enderecoRouter from "./routes/enderecoRoutes";
import documentoRouter from "./routes/documentoRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"], // Permite requisições do seu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api", tutorRouter);
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", especieRouter);
app.use("/api", racaRouter);
app.use("/api", animalRouter);
app.use("/api", veterinarioRouter);
app.use("/api", agendamentoRouter);
app.use("/api", consultaRouter);
app.use("/api", anamneseRouter);
app.use("/api", dashboardRouter);
app.use("/api", vacinaRouter);
app.use("/api", relatorioRouter);
app.use("/api", exameRouter);
app.use("/api", prescricaoRouter);
app.use("/api", cidadeRouter);
app.use("/api", estadoRouter);
app.use("/api", enderecoRouter);
app.use("/api", documentoRouter);

tarefasAgendadasService.iniciar();
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
