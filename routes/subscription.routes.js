import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import checkAdmin from '../middlewares/checkAdmin.middleware.js';
import subscriptionController from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, checkAdmin, subscriptionController.getSubscriptions);

subscriptionRouter.get('/:id', subscriptionController.getSubscriptionDetails);

subscriptionRouter.post('/', authorize, subscriptionController.createSubscription);

subscriptionRouter.get('/user/:userId', authorize, subscriptionController.getUserSubscriptions);

subscriptionRouter.get('/user/:userId/upcoming-renewals', authorize, subscriptionController.getUpcomingRenewals);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscription' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));

subscriptionRouter.put('/:id/cancel', authorize, subscriptionController.cancelSubscription);

subscriptionRouter.put('/:id/renew', (req, res) => res.send({ title: 'RENEW subscription' }));


export default subscriptionRouter;