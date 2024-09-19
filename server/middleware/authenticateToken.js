const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).send("Token not provided.");
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    next(); // Move on to the next middleware/route handler
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    return res.status(403).send("Invalid token.");
  }
};

module.exports = authenticateToken;