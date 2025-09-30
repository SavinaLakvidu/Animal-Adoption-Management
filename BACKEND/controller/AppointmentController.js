import {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentsByUserService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
} from "../service/AppointmentService.js";

export const createAppointmentController = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const appointment = await createAppointmentService(req.body, req.user.email);
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error in createAppointmentController:", error.message);
    res.status(500).json({ error: error.message });
  }
};


export const getAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsService();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await getAppointmentsByUserService(req.user.email);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updated = await updateAppointmentService(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await deleteAppointmentService(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
