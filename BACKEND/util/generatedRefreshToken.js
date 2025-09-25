import jwt from "jsonwebtoken";
import userModel from "../model/user.js";

const generatedRefreshToken = async (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  await userModel.updateOne(
    { _id: userId },
    { $set: { refreshToken: token } }
  );

  return token;
};

export default generatedRefreshToken;
