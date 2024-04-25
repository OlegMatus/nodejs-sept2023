import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getAll);
router.post("/", userController.create);

router.get("/:userId", userController.getById);
router.put("/:userId", userController.updateById);
router.delete(":userId", userController.deleteById);

export const userRouter = router;
