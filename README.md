
# Caotrol - Instruções de Execução

## Caotrol Backend
---

Antes de iniciar, é necessário ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Banco de dados ( PostgreSQL, conforme configuração no `prisma/schema.prisma`)
  
- Instale as dependências:
   ```bash
   npm install

Crie um arquivo chamado .env na raiz do projeto e configure suas variáveis de ambiente.
```bash
# --- Configuração do Banco de Dados ---
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/caotrol-db"
# --- Configuração de Segurança (JWT) ---
JWT_SECRET="caotrol_chave_secreta_super_segura_2025_abc123"
# --- Configuração do Servidor ---
PORT=3000
# --- Configuração de Email ---
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_app"
# --- Configuração do Frontend ---
FRONTEND_URL="http://localhost:5173"
```
Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
```

Gere o cliente do Prisma:
```bash
npx prisma generate
```

Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O backend estará disponível em:
```bash
http://localhost:3000
```
## 💻 Frontend

Acesse a pasta do frontend:
```bash
cd caotrol-frontend-react
```

Instale as dependências:
```bash
npm install
```

Inicie o frontend em modo desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em:
```bash
http://localhost:5173
```

## 🔑 Usuários de teste

Já existem alguns usuários cadastrados no sistema:

### Admin

Login: admin
Senha: 123456

### Dr. José

Login: dr.jose
Senha: 123456


