const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 No header
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 🔥 Remove "Bearer "
    const token = authHeader.split(" ")[1];

    // 🔴 No token after split
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // 🔥 Verify token
    const decoded = jwt.verify(token, SECRET);

    // 🔥 Attach user
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;