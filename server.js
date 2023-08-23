import express from "express";
import cors from "cors";
import attendance from "./api/attendance.route.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/check-health",(req,res)=>{
    res.send({message:"Success"})
})

app.use("/Attendance", attendance);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
