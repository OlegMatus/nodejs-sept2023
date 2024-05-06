import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token-pair.interface";
import { Token } from "../models/token.model";

class AuthRepository {
  public async create(dto: IToken): Promise<IToken> {
    return await Token.create(dto);
  }
  public async findByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
}

export const authRepository = new AuthRepository();
