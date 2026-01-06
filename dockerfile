FROM node:20-alpine

# --- ADIÇÃO IMPORTANTE: Instalar OpenSSL ---
# O Prisma precisa disto para detectar a versão correta do sistema
RUN apk add --no-cache openssl
# -------------------------------------------

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente do Prisma (agora com o binaryTarget correto)
RUN npx prisma generate

COPY . .

# Compila o projeto
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]