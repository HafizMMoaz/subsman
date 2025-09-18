import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
}

const getSubscriptionDetails = async (req, res, next) => {
    try{
        const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
        if(!subscription){
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    }catch(error){
        next(error);
    }
}

const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find().populate('user', 'name email');
        if (!subscriptions) {
            const error = new Error('No subscriptions found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if (req.user.id !== req.params.userId) {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.userId });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}

const getUpcomingRenewals = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if (req.user.id !== req.params.userId) {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({
            user: req.params.userId,
            renewDate: { $gt: new Date() } // filter by renewDate > now
        }).sort({ renewDate: 1 }); // sort by renewDate ascending

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        // Check if the user is the owner of the subscription
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        subscription.status = 'cancelled';
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export default { 
    createSubscription, 
    getUserSubscriptions,
    getSubscriptionDetails,
    getSubscriptions,
    getUpcomingRenewals,
    cancelSubscription
};