import express from "express";
import KPI from "../models/KPI.js";


const router = express.Router();

router.get("/kpis", async (req, res) => {
   try{

    const kpis = await KPI.find();
    res.status(200).json(kpis);   //we wiil return a success result via a 200 status once we successsfully find our kpi
   } catch(error) {
      res.status(404).json({message: error.message});
   }
});

export default router;