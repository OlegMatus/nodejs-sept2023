import { NextFunction, Request, Response } from "express";

import { IForgotDto } from "../interfaces/action-token.interface";
import { IAuth } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";
import { authRepository } from "../repositiries/auth.repository";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const data = await authService.signUp(dto);

      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IAuth>;
      const data = await authService.signIn(dto);

      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload;
      const refreshToken = req.headers.authorization;
      const tokenPair = await authRepository.findByParams({ refreshToken });
      const data = await authService.refresh(jwtPayload, tokenPair);
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgotDto;
      await authService.forgotPassword(body);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
