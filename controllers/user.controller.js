import User from '../models/user.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message : `${users.length} users found`,
            data: users
        });
    } catch (error) {
        next(error);
    }
};


const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Check if the user is the same as the one in the token
        if (req.user.id !== userId && req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Check if the user is the same as the one in the token or admin
        if (req.user.id !== userId && req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const updates = { ...req.body };

        // If password is in the updates, hash it first
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
         const userId = req.params.id;

        // Check if the user is the same as the one in the token or admin
        if (req.user.id !== userId && req.user.role !== 'admin') {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const user = await User.deleteOne({ _id: userId });
        if (user.deletedCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}

const createUser = async (req, res, next) => {
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

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created succesfully',
            data: {
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

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};