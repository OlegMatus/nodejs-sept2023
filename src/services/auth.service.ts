import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IForgotDto } from "../interfaces/action-token.interface";
import { IAuth } from "../interfaces/auth.interface";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token-pair.interface";
import { IUser } from "../interfaces/user.interface";
import { authRepository } from "../repositiries/auth.repository";
import { userRepository } from "../repositiries/user.repository";
import { passwordService } from "./password.service";
import { sendMailService } from "./sendMail.service";
import { smsService } from "./sms.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    await this.isEmailExist(dto.email);
    const hashedPassword = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await authRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    await sendMailService.sendByType(user.email, EmailTypeEnum.WELCOME, {
      name: dto.name,
      frontUrl: config.FRONT_URL,
      actionToken: "actionToken",
    });
    await smsService.sendSms(user.phone, "Welcome to your app");
    return { user, tokens };
  }
  public async signIn(
    dto: Partial<IAuth>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError("Wrong email or password", 401);
    }
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError("Wrong email or password", 401);
    }
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await authRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }
  public async refresh(
    jwtPayload: IJWTPayload,
    oldPair: IToken,
  ): Promise<ITokenResponse> {
    const newPair = tokenService.generatePair({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });

    await authRepository.deleteById(oldPair._id);

    await authRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    return newPair;

    console.log(jwtPayload);
  }
  public async forgotPassword(dto: IForgotDto): Promise<void> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;

    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );
    await sendMailService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
      frontUrl: config.FRONT_URL,
      actionToken,
    });
  }
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("email already exist", 409);
    }
  }
}

export const authService = new AuthService();
