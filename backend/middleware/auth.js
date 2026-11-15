import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const JWT_SECRET = 'your_jwt_secret_here';

export default async function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password'); // Exclude password from the user object

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
       console.error('Error in auth middleware:', err);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token' });
    }

}