import mongoose from 'mongoose';
import User from '../models/userModels.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRE_IN = '24h';
const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'JWT secret is not configured',
            });
        }

        const exists = await User.findOne({ email }).lean();

        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id.toString() },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRE_IN },
        );

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error in register:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'JWT secret is not configured',
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRE_IN },
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error in login:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}