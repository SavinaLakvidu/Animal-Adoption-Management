import express from "express";
import { createAppointmentController, getAppointmentsController, getAppointmentByIdController, deleteAppointmentController, updateAppointmentController } from "../controller/AppointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/", createAppointmentController);
appointmentRouter.get("/", getAppointmentsController);
appointmentRouter.get("/:appointmentId", getAppointmentByIdController);
appointmentRouter.put("/:id", updateAppointmentController);
appointmentRouter.delete("/:appointmentId", deleteAppointmentController);

export default appointmentRouter;
