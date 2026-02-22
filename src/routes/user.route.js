import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  const body = req.body;
  console.log("Body : ", body);
});

export default router;
