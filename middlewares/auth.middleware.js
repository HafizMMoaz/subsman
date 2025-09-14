import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    }
    catch (error) { 
        res.status(401).json({ message: 'Unauthorized' , error: error.message });
    }
}

export default authorize;