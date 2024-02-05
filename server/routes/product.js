import express from "express";
import Product from "../models/Product.js";


const router = express.Router();

router.get("/products", async (req, res) => {
   try{
    const products = await Product.find();
    res.status(200).json(products);   //we wiil return a success result via a 200 status once we successsfully find our product
   } catch(error) {
      res.status(404).json({message: error.message});
   }
});

export default router;