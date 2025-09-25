import jwt from "jsonwebtoken";

const generatedAccessToken = (userId) => {
  const token = jwt.sign(
    { id: userId }, // payload
    process.env.JWT_SECRET, // matches your .env
    { expiresIn: "24h" }
  );
  return token;
};

export default generatedAccessToken;

