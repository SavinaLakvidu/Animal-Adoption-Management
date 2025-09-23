
import Appointment from "../model/Appointment.js";

export const createAppointmentService = async (appointmentData) => {
  try {
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    return appointment;
  } catch (error) {
    throw new Error("Error creating appointment: " + error.message);
  }
};

export const getAllAppointmentsService = async () => {
  try {
    const appointments = await Appointment.find();
    return appointments;
  } catch (error) {
    throw new Error("Error fetching appointments: " + error.message);
  }
};

export const getAppointmentByIdService = async (appointmentId) => {
  try {
    const appointment = await Appointment.findOne({ appointmentId });
    return appointment;
  } catch (error) {
    throw new Error("Error fetching appointment: " + error.message);
  }
};

export const updateAppointmentService = async (id, updateData) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId: id },
      updateData,
      { new: true }
    );

    return appointment;
  } catch (error) {
    throw new Error("Error updating appointment: " + error.message);
  }
};

export const deleteAppointmentService = async (appointmentId) => {
  try {
    const deletedAppointment = await Appointment.findOneAndDelete({ appointmentId });
    return deletedAppointment;
  } catch (error) {
    throw new Error("Error deleting appointment: " + error.message);
  }
};
