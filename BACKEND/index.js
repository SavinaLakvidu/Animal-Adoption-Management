import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

// Import routes
import userRouter from "./routes/UserRoutes.js";
import vetRouter from "./routes/VetRoutes.js";
import appointmentRouter from "./routes/AppointmentRoutes.js";
import medicalRecordRouter from "./routes/MedicalRecordRoutes.js";
import PetProfileRouter from "./routes/PetProfileRouter.js";
import adoptionFormRouter from "./routes/AdoptionFormRoutes.js";
import rescuedPetRouter from "./routes/RescuedPetRoutes.js";

// Import connectDB from config
import connectDB from "./config/database.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/vet", vetRouter);
app.use("/appointment", appointmentRouter);
app.use("/medical-records", medicalRecordRouter);
app.use("/pet-profiles", PetProfileRouter);
app.use("/adoption-forms", adoptionFormRouter);
app.use("/rescued-pets", rescuedPetRouter);

app.listen (port, ()=> {console.log(`server is running on port ${port}`)});

export default app;
