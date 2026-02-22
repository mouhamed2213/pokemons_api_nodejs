import express from "express";
const userRouter = express.Router();

userRouter.get("signup", (req, res) => {
  console.log(req);
});

export default userRouter;
