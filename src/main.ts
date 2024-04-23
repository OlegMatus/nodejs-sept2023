import express, { Request, Response } from "express";

import { reader, writer } from "./fs.service";
import { IUser } from "./user.interface";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});
app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await reader();
    res.json(users);
  } catch (e) {
    res.status(400).json(e.message);
  }
});
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const users = await reader();

    const newUser = {
      id: users[users.length - 1].id + 1,
      name,
      email,
      password,
    };
    users.push(newUser);
    await writer(users);

    res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json(e.message);
  }
});
app.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const users = await reader();

    const findUser = users.find((user: IUser) => user.id === userId);
    if (!findUser) {
      throw new Error("User not found");
    }
    res.json(findUser);
  } catch (e) {
    res.status(400).json(e.message);
  }
});
app.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userId = Number(req.params.userId);
    const users = await reader();

    const index = users.findIndex((user: IUser) => user.id === userId);
    if (index === -1) {
      throw new Error("User not found");
    }

    users[index] = { ...users[index], name, email, password };
    await writer(users);

    res.status(201).json(users[index]);
  } catch (e) {
    res.status(400).json(e.message);
  }
});
app.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const users = await reader();

    const index = users.findIndex((user: IUser) => user.id === userId);
    if (index === -1) {
      throw new Error("User not found");
    }
    users.splice(index, 1);
    await writer(users);

    res.sendStatus(204);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
