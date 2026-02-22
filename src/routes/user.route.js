import express from "express";
const router = express.Router();

router.get("api/auth/signup", (req, res) => {
  console.log(req);
});

export default UserRoute;
