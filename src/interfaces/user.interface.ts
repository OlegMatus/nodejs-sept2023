import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  phone: string;
  role: RoleEnum;
  isDeleted: boolean;
  isVerified: boolean;
}
