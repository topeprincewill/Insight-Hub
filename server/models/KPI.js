import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const daySchema = new Schema (
    {
      date: String,
      revenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100
      }, 
      expenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,
      }, 
    },
    { toJSON: { getters:true }} //this is a setting so we can be able to use the get commands eg  get: (v) => v / 100

);


const monthSchema = new Schema(
    {
      month: String,
      revenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100
      }, 
      expenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,
      }, 
      operationalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,
      }, 
      nonOperationalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100
      }, 
    },
    { toJSON: { getters:true }} //this is a setting so we can be able to use the get commands eg  get: (v) => v / 100
);


const KPISchema = new Schema (
    {
       totalProfit: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,   //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       }, 
       totalRevenue: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100   //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       },
       totalExpenses: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,  //since currency is always multiplied by a 100. we are reversing by dividing by 100 to get the real value
       },
       expensesByCategory: {
        type: Map,
        of: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (v) => v / 100,

        },
       },
       monthlyData: [monthSchema],
       dailyData: [daySchema],
    },
    { timestamps: true, toJSON: { getters:true }}
);

const KPI = mongoose.model("KPI", KPISchema)

export default KPI;