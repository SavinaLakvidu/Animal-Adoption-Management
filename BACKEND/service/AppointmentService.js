import Appointment from "../model/Appointment.js";

export const createAppointment = async (data) => {
  const appointment = new Appointment(data);
  return await appointment.save();
};

export const getAppointments = async () => {
  return await Appointment.find().populate("vetId");
};

export const getAppointmentById = async (id) => {
  return await Appointment.findById(id).populate("vetId");
};

export const updateAppointment = async (id, updates) => {
  return await Appointment.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};
