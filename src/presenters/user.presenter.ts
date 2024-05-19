import { IPrivateUser, IPublicUser, IUser } from "../interfaces/user.interface";

export class UserPresenter {
  public static toPublicResponseDto(user: IUser): IPublicUser {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }
  public static toPrivateResponseDto(user: IUser): IPrivateUser {
    return {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      age: user.age,
      role: user.role,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }
}
