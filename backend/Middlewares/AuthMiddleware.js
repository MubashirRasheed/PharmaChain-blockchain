import  jwt  from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(token);

  // Check if token existss
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Add user from payload
    req.user = decoded;
    console.log(req.user);


    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
