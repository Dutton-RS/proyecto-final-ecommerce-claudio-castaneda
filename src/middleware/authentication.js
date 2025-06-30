import jwt from 'jsonwebtoken';
import 'dotenv/config';
const secret_key = process.env.JWT_SECRET_KEY;

// Middleware para verificar el token JWT
export const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Acceso denegado: Token no proporcionado" });
    jwt.verify(token, secret_key, (err, user) => {
        if (err) {
            console.error('JWT verification error', err.message);
            return res.status(403).json({ message: "Acceso denegado: Token inválido o expirado" });
        }
        req.user = user;
        next();
    });
}
