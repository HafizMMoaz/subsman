import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import subscriptionController from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));

subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscription details' }));

subscriptionRouter.post('/', authorize, subscriptionController.createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscription' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));

subscriptionRouter.get('/user/:userId', authorize, subscriptionController.getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));

subscriptionRouter.put('/:id/renew', (req, res) => res.send({ title: 'RENEW subscription' }));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

export default subscriptionRouter;