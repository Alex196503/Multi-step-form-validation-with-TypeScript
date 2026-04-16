import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
    selectedPlan:{
        required: [true, "A selected plan is required"],
        type : String
    },
    selectedAddons:{
        type : [String]
    },
    billingInterval:{
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
        required: [true, 'Billing interval is Required']
    },
    UserId:{
        ref: 'User',
        type : mongoose.SchemaTypes.ObjectId,
        required: [true, "This order does not belong to any user"]
    },
    totalPrice : Number,
    status:{
        type : String,
        default : 'pending'
    },
    orderedAt:{
        type : Date,
        default: Date.now
    }
})
export let OrderModel = mongoose.model('Order', OrderSchema);