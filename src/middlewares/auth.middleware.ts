import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { authRepository } from "../repositiries/auth.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken = req.get("Authorization");
      if (!accessToken) {
        throw new ApiError("No token provided", 401);
      }
      const payload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const tokenPair = await authRepository.findByParams({ accessToken });
      if (!tokenPair) {
        throw new ApiError("Invalid token", 401);
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // const refreshToken = req.headers.authorization;
      const refreshToken = req.get("Authorization");
      if (!refreshToken) {
        throw new ApiError("No token provided", 401);
      }
      const payload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const tokenPair = await authRepository.findByParams({ refreshToken });
      if (!tokenPair) {
        throw new ApiError("Invalid token", 401);
      }
      req.res.locals.jwtPayload = payload as IJWTPayload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
