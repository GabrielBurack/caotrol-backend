import nodemailer from 'nodemailer';

// DEBUG: Verificar se as variáveis estão carregando (Não mostramos a senha inteira por segurança)
console.log("--- DEBUG EMAIL CONFIG ---");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS (tamanho):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NÃO DEFINIDO');
console.log("------------------------");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Remove espaços da senha de app se houver
  },
  tls: {
    rejectUnauthorized: false // Ajuda em alguns ambientes de desenvolvimento
  }
});

interface MailOptions { to: string; subject: string; html: string; }

export const sendEmail = async (mailOptions: MailOptions) => {
  try {
    console.log(`Tentando enviar email para: ${mailOptions.to}...`);
    const info = await transporter.sendMail({
      from: `"Clínica Caotrol" <${process.env.EMAIL_USER}>`,
      ...mailOptions
    });
    console.log("Email enviado! ID da mensagem:", info.messageId);
    return info;
  } catch (error) {
    console.error("ERRO NO NODEMAILER:", error);
    throw error; // Repassa o erro para o Service tratar
  }
};