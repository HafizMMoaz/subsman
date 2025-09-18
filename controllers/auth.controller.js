import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password, role = "user" } = req.body;

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUsers = await User.create([{ name, email, password: hashedPassword, role }], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id, email: newUsers[0].email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created succesfully',
            data: {
                token,
                user: newUsers[0]
            }
        })
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User Not Exists');
            error.statusCode = 404;
            throw error;
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            const error = new Error('Invalid Credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}