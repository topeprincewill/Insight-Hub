import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);


const TransactionSchema = new Schema (
    {
       buyer: {
        type: String,
        required: true,
       }, 
       amount: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100   //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       },
       productIds: [ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", //This is for a transaction schema object. so we have references of all the transactions related to this particular Transaction
       },
    ],
    },
    { timestamps: true, toJSON: { getters:true }}
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;