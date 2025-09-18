import { Router } from 'express';

import userController from '../controllers/user.controller.js';

import authorize from '../middlewares/auth.middleware.js';
import checkAdmin from '../middlewares/checkAdmin.middleware.js';

const userRouter = Router();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all users. Admin access required.
 *     responses:
 *       200:
 *         description: user list
 */
userRouter.get('/', authorize, checkAdmin, userController.getUsers);


userRouter.get('/:id', authorize, userController.getUser);

userRouter.post('/', authorize, checkAdmin, userController.createUser);

userRouter.put('/:id', authorize, userController.updateUser);

userRouter.delete('/:id', authorize, userController.deleteUser);

export default userRouter;