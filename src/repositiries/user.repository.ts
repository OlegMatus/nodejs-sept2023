import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({ isDeleted: false });
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }
  public async getById(userId: string): Promise<IUser> {
    return await User.findById(userId);
  }
  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }
  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
}

export const userRepository = new UserRepository();
