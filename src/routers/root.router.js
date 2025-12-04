import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";

// Step 1:
const rootRouter = express.Router();

// Step 2:
rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);

export default rootRouter;
