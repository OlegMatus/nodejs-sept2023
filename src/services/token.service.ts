import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constants";
import { HttpStatus } from "../constants/http-status.constants";
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
          throw new ApiError(
            errorMessages.NO_TOKEN_PROVIDED_OR_TOKEN_IS_NOT_VALID,
            HttpStatus.UNAUTHORIZED,
          );
      }

      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (error) {
      throw new ApiError(
        errorMessages.NO_TOKEN_PROVIDED_OR_TOKEN_IS_NOT_VALID,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

export const tokenService = new TokenService();
