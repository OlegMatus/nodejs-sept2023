import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositiries/user.repository";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(dto);
  }
  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User notfound", 404);
    }
    return user;
  }
  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.findUserOrThrow(userId);
    return await userRepository.updateById(userId, dto);
  }
  public async deleteById(userId: string): Promise<void> {
    await this.findUserOrThrow(userId);
    await userRepository.deleteById(userId);
  }
  private async findUserOrThrow(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);

    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }
}

export const userService = new UserService();
