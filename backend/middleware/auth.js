import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  console.log("auth middleware has been called");
  console.log("request body is ", req.body);
  console.log("request body is", req.body.header);
  try {
    const token = req.body.header.x_auth_token;
    console.log("Token ", token);
    if (!token) {
      res.status(401).json({ msg: "no auth token,access denied" });
    }
    const verified = jwt.verify(token, "passwordkey");
    if (!verified) {
      res
        .status(401)
        .json({ msg: "token verification falied,authorization denied" });
    }
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default auth;
