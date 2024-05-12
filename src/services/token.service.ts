import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token-pair.interface";

class TokenService {
  public generatePair(payload: IJWTPayload): ITokenResponse {
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
    return {
      accessToken,
      accessExpiresIn: config.JWT_ACCESS_EXPIRES_IN,
      refreshToken,
      refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
    };
  }
  public checkToken(token: string, type: TokenTypeEnum): IJWTPayload {
    try {
      let secret: string;

      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;

        case TokenTypeEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;

        default:
          throw new ApiError("Invalid token type", 401);
      }

      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", 401);
    }
  }
  public generateActionToken(
    payload: IJWTPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    switch (type) {
      case ActionTokenTypeEnum.FORGOT:
        secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
        expiresIn = config.JWT_ACCESS_EXPIRES_IN;
        break;

      default:
        throw new ApiError("Invalid token type", 401);
    }
    return jsonwebtoken.sign(payload, secret, {
      expiresIn,
    });
  }
}

export const tokenService = new TokenService();
