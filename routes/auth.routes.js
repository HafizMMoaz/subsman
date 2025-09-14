import { Router } from "express";

import {register, login, logout} from '../controllers/auth.controller.js';

const authRouter = Router();

// PATH: /api/v1/auth/register [POST] 
authRouter.post('/register', register);

// PATH: /api/v1/auth/login [POST]
authRouter.post('/login', login);

// PATH: /api/v1/auth/logout [POST]
authRouter.post('/logout', logout);

export default authRouter;