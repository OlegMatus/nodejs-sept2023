import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "./interfaces/user.interface";

const filePath = path.join(process.cwd(), "db.json");
const reader = async () => {
  const users = await fs.readFile(filePath, "utf-8");
  return JSON.parse(users);
};

const writer = async (users: IUser[]) => {
  await fs.writeFile(filePath, JSON.stringify(users));
};

export { reader, writer };
