import { IUser } from "./user.interface";

export interface IForgotDto extends Pick<IUser, "email"> {}
