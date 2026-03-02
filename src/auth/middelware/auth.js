import jwt from "jsonwebtoken";

// middleware to check jwt
export const authMiddleware = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET;

  // is authorization null
  if (req.headers.authorization == null) {
    return res.status(401).json({ message: "missing authorization" });
  }

  // extract token
  const extractToken = req.headers?.authorization?.split(" ");
  const authorization = extractToken[0];
  const token = extractToken[1];

  if (token === "" || token == null) {
    return res.status(401).json({ message: "missing jwt" });
  }

  // check if the token is valid
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error({ message: "Invalid Jwt", err });
      return res.status(401).json({ message: "invalid Token" });
    }
    // Attach user to the request
    req.user = decoded;
    console.log({ User: req.user });

    next();
  });
};
