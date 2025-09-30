import Appointment from "../model/Appointment.js";
import { v4 as uuidv4 } from "uuid";
import Vet from "../model/Vet.js";

// Create a new appointment
export const createAppointmentService = async (data, userEmail) => {
  try {
    const appointmentDate = new Date(data.date);

    const newAppointment = await Appointment.create({
      appointmentId: uuidv4(),
      time: data.time,
      date: appointmentDate,
      vetId: data.vetId,
      owner: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      },
      pet: {
        name: data.petName,
        species: data.species,
        dob: new Date(data.dob),
        gender: data.gender,
        medicalHistory: data.medicalHistory || "",
      },
      userEmail, // ← pass from controller
    });

    // Mark vet slot as unavailable
    await Vet.updateOne(
      {
        vetId: data.vetId,
        "availability.date": appointmentDate,
        "availability.slots.time": data.time,
      },
      { $set: { "availability.$[day].slots.$[slot].isAvailable": false } },
      { arrayFilters: [{ "day.date": appointmentDate }, { "slot.time": data.time }] }
    );

    return newAppointment;
  } catch (error) {
    console.error("Error in createAppointmentService:", error.message);
    throw new Error("Error creating appointment: " + error.message);
  }
};

// Get all appointments
export const getAppointmentsService = async () => {
  return await Appointment.find().populate("vetId");
};

// Get appointments for a specific user
export const getAppointmentsByUserService = async (userEmail) => {
  return await Appointment.find({ userEmail }).populate("vetId");
};

// Other services...
export const getAppointmentByIdService = async (id) => {
  return await Appointment.findById(id).populate("vetId");
};
export const updateAppointmentService = async (id, updates) => {
  return await Appointment.findByIdAndUpdate(id, updates, { new: true });
};
export const deleteAppointmentService = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};
