import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minlength: [3, 'Subscription Name must be at least 3 characters long'],
        maxlength: [100, 'Subscription Name must be at most 100 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be at least 0']
    },
    currency: {
        type: String,
        enum: ['USD', 'PKR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MYR', 'SGD'],
        default: 'PKR'
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
        default: 'monthly'
    },
    category: {
        type: String,
        enum: ['entertainment', 'productivity', 'education', 'health', 'utilities', 'technology', 'sports', 'other'],
        required: [true, 'Category is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment Method is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) { return value <= new Date() },
            message: 'Start Date cannot be in the future'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) { return value > this.startDate },
            message: 'Renewal Date must be after Start Date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next()
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;