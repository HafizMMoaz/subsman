import { Router } from 'express';

import userController from '../controllers/user.controller.js';

import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', userController.getUsers);

userRouter.get('/:id', authorize, userController.getUser);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

export default userRouter;