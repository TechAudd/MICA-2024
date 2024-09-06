import { Admin } from "../models/admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// export const adminLogin = async (req, res) => {
//   const email = req.body.data.email;

//   try {
//     const userInfo = await Admin.findOne({ EMAIL: email });
//     console.log(userInfo.TYPE);

//     const token = jwt.sign(
//         { id: userInfo._id },
//         { EMAIL: userInfo.EMAIL },
//         { TYPE: userInfo.TYPE },
//         process.env.JWT_SECRET,
//         { expiresIn: "30d" },
//         { algorithm: "HS256" }
//       );
//     res.cookie("authCookie", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV,
//     maxAge: 86400000,
//     });
//     return res.status(200).json({ userInfo: userInfo });

//   } catch (error) {
//     res.status(500).json({ Error: error });
//   }
// };

export const adminRegister = async (req, res) => {
  const {userName, password} = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ userName: userName });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      userName,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();

    // Respond with success message
    return res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // Find the admin by userName
    const userInfo = await Admin.findOne({ userName: userName });

    // Check if user exists
    if (!userInfo) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, userInfo.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: userInfo._id,
        userName: userInfo.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
        algorithm: "HS256",
      }
    );

    // Set token in cookie
    res.cookie("authCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev", // Ensure this is set correctly
      maxAge: 86400000, // 1 day
    });
    // Respond with user information
    return res.status(200).json({ userInfo, token });

  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};