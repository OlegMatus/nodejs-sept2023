import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { HttpStatus } from "../constants/http-status.constant";
import { MeasureTimeDecorator } from "../decorators/measure-time.decorator";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import {
  IForgotDto,
  ISetForgotDto,
} from "../interfaces/action-token.interface";
import { IAuth } from "../interfaces/auth.interface";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token-pair.interface";
import { IChangePassword, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositiries/action-token.repository";
import { tokenRepository } from "../repositiries/token.repository";
import { userRepository } from "../repositiries/user.repository";
import { passwordService } from "./password.service";
import { sendMailService } from "./sendMail.service";
import { smsPrepareService } from "./sms-prepare.service";
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
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.VERIFY,
    );
    await actionTokenRepository.create({
      tokenType: ActionTokenTypeEnum.VERIFY,
      actionToken,
      _userId: user._id,
    });
    await Promise.all([
      sendMailService.sendByType(user.email, EmailTypeEnum.WELCOME, {
        name: dto.name,
        frontUrl: config.FRONT_URL,
        actionToken,
      }),
      smsPrepareService.register(user.phone, { name: user.name }),
    ]);
    return { user, tokens };
  }
  @MeasureTimeDecorator
  public async signIn(
    dto: Partial<IAuth>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({
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

    await tokenRepository.deleteById(oldPair._id);

    await tokenRepository.create({
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
    await actionTokenRepository.create({
      tokenType: ActionTokenTypeEnum.FORGOT,
      actionToken,
      _userId: user._id,
    });
    await sendMailService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
      frontUrl: config.FRONT_URL,
      actionToken,
    });
  }
  public async setForgotPassword(
    dto: ISetForgotDto,
    jwtPayload: IJWTPayload,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    const hashedPassword = await passwordService.hashPassword(dto.password);

    await userRepository.updateById(user._id, { password: hashedPassword });
    await actionTokenRepository.deleteByParams({
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    await tokenRepository.deleteByParams({
      _userId: user._id,
    }); /*logout all devices*/
  }
  public async verify(jwtPayload: IJWTPayload): Promise<IUser> {
    const [user] = await Promise.all([
      await userRepository.updateById(jwtPayload.userId, {
        isVerified: true,
      }),
      await actionTokenRepository.deleteByParams({
        tokenType: ActionTokenTypeEnum.VERIFY,
      }),
    ]);
    return user;
  }
  public async changePassword(
    jwtPayload: IJWTPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    const isCompare = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError(
        errorMessages.WRONG_OLD_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const hashedPassword = await passwordService.hashPassword(dto.newPassword);
    await userRepository.updateById(user._id, { password: hashedPassword });
    await tokenRepository.deleteByParams({ _userId: user._id });
  }
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError(
        errorMessages.EMAIL_ALREADY_EXIST,
        HttpStatus.CONFLICT,
      );
    }
  }
}

export const authService = new AuthService();
