import express from "express";

const app = express();
const port = 3000;


app.get('/api', (req, res) => {
    res.send('Teste');
  });


app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
})