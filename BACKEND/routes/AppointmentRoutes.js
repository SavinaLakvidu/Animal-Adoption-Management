import express from "express";
import { createAppointmentController, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, getAppointmentsByUser } from "../controller/AppointmentController.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createAppointmentController);
router.get("/", getAppointments);
router.get("/user", authenticate, getAppointmentsByUser);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
