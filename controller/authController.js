import { response } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../utils/tokenUtils.js";
import { db } from "../model/connection.js";
import bcrypt from "bcryptjs"
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      null,
      "Username atau password belum diisi"
    );
  }

  // Check user credentials in the database
  const query = "SELECT * FROM user WHERE email = ? ";

  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query({
      sql: query,
      values: [email],
    });
    connection.release();
    if (rows.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, null, "User tidak terdaftar");
    }
    const hashedPassword = rows[0].password;
    const isUserValid = await bcrypt.compare(password, hashedPassword);
    
    if (!isUserValid) {
      return response(res, StatusCodes.NOT_FOUND, null, "Password salah!");
    }
    
    const user = rows[0];
    
    
    const token = createJWT({ userId: user.id, role: user.role });
    
    res.cookie("token", token, {
      sameSite: process.env.NODE_ENV == "development" ? "Strict" : "None" ,
      secure: process.env.NODE_ENV == "production",
      httpOnly: process.env.NODE_ENV == "development",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    });
    return response(res, StatusCodes.OK, token, "Login berhasil");
  } catch (error) {
    console.error("Error during login:", error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      "Terjadi kesalahan saat login"
    );
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: process.env.NODE_ENV == "development",
    expires: new Date(Date.now()),
  });
  return response(res, StatusCodes.OK, null, "Logged Out");
};


export const register = async (req,res) => {
  const {email,username,password} = req.body
  if(!email && !username && !password) {
    return response(res,500,null,"failed")
  }
  try {
    const connection = await db.getConnection()
    const hashedPassword = await bcrypt.hash(password,10)
    await connection.query({sql:`INSERT INTO user (email,username,password) VALUES (?,?,?)`,values:[email,username,hashedPassword]})
    connection.release()
    return response(res,201,null,"success")
  } catch (error) {
    console.log(error)
  }
}
