import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  deleteAppointmentService,
  updateAppointmentService,
} from "../service/AppointmentService.js";

export const createAppointmentController = async (req, res) => {
  try {
    const newAppointment = await createAppointmentService(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAppointmentsController = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsService(); 
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.appointmentId); 

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await updateAppointmentService(id, updateData);

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const deletedAppointment = await deleteAppointmentService(req.params.appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
