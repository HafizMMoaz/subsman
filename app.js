import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

// Global Error Handling Middleware
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome To Subscription Tracker API!');
});

app.listen(PORT, async () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;