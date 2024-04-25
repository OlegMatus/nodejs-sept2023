import { ApiError } from "../api-error";
import { userRepository } from "../repositiries/user.repository";
import { IUser } from "../user.interface";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(dto);
  }
  public async getById(userId: number): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User notfound", 404);
    }
    return user;
  }
  public async updateById(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return await userRepository.updateById(userId, dto);
  }
  public async deleteById(userId: number): Promise<void> {
    const user = await userRepository.getById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
