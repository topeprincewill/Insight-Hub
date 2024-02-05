import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);


const ProductSchema = new Schema (
    {
       price: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100   //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       }, 
       expense: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100   //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       },
       transactions: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", //This is for a transaction schema object. so we have references of all the transactions related to this particular product
       },
    ],
    },
    { timestamps: true, toJSON: { getters:true }}
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;