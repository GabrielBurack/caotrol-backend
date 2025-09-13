import { Request, Response } from "express";
import authService from "../services/authService";
import asyncHandler from "express-async-handler";

class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { login, senha } = req.body;
    const token = await authService.login(login, senha);
    res.status(200).json({ token });
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    await authService.verifyEmail(token);
    res.status(200).json({ message: "E-mail verificado com sucesso." });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res
      .status(200)
      .json({
        message:
          "Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.",
      });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, novaSenha } = req.body;
    await authService.resetPassword(token, novaSenha);
    res.status(200).json({ message: "Senha redefinida com sucesso." });
  });
}

export default new AuthController();
