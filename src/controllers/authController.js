
// src/controllers/authController.js

import { generateToken } from '../utils/token-generator.js';
import Usuario from '../models/Usuario.js';
// import bcrypt from 'bcryptjs'; 

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const userFromDB = await Usuario.getByEmail(email);

    if (!userFromDB) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    
    // const passwordMatch = await bcrypt.compare(password, userFromDB.password);


    const passwordMatch = (password === userFromDB.password); 


    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (userFromDB.activo === false) {
      return res.status(403).json({ message: "Usuario inactivo. Por favor, contacte al soporte." });
    }

    const token = generateToken({ id: userFromDB.id, email: userFromDB.email });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: { id: userFromDB.id, email: userFromDB.email }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
}
