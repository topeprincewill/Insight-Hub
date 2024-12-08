import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import kpiRoutes from "./routes/kpi.js"
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";


/* CONFIGURATIONS */
dotenv.config()
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

/* ROUTES */
app.use("/kpi", kpiRoutes);   //
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);
 
// POST endpoint to save data to a JSON file
app.post('/saveMetrics', (req, res) => {
    const { expenseRatio, correlationCoefficient } = req.body;
  
    // Validate that the required fields are provided
    if (!expenseRatio || !correlationCoefficient) {
      return res.status(400).json({ error: 'Both expenseRatio and correlationCoefficient are required.' });
    }
  
    // Prepare data to save to the JSON file
    const jsonData = {
      metrics: {
        expenseRatio,
        correlationCoefficient,
      },
    };
  
    // Write the data to a JSON file (overwrites the file)
    fs.writeFile('metrics.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write to the file' });
      }
      res.json({ message: 'Metrics saved successfully' });
    });
  });


  app.get('/get-values', (req, res) => {
    try {
      const data = fs.readFileSync('metrics.json');
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Unable to read values' });
    }
  });

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000; //the 9000 port is a backup for our original port number of 1337
mongoose
   .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => { 
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

     /* ADD DATA ONE TIME ONLY OR AS NEEDED */ 
    //await mongoose.connection.db.dropDatabase(); //before we seed our database with information. we want to drop the current database 
    //KPI.insertMany(kpis);
    //Product.insertMany(products); 
    //Transaction.insertMany(transactions);                                            // to avoid duplication of data
})


.catch((error) => console.log(`${error} did not connect`));


