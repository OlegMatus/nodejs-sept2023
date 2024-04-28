import { reader, writer } from "../fs.service";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await reader();
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    const users = await reader();
    const newUser: IUser = {
      id: users[users.length - 1].id + 1,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    users.push(newUser);

    await writer(users);
    return newUser;
  }
  public async getById(userId: number): Promise<IUser> {
    const users = await reader();
    return users.find((user: IUser) => user.id === userId);
  }
  public async updateById(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = dto;
    const users = await reader();

    const index = users.findIndex((user: IUser) => user.id === userId);
    users[index] = { ...users[index], name, email, password };
    await writer(users);
    return users[index];
  }
  public async deleteById(userId: number): Promise<void> {
    const users = await reader();

    const index = users.findIndex((user: IUser) => user.id === userId);
    users.splice(index, 1);
    await writer(users);
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
}

export const userRepository = new UserRepository();
