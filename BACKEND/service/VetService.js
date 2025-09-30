import Vet from "../model/Vet.js";

export const createVetService = async (data) => {
  try {
    let vets;

    if (Array.isArray(data)) {
      vets = await Vet.insertMany(data);
    } else {
      vets = await Vet.create(data);
    }

    return vets;
  } catch (error) {
    throw new Error("Error creating vet: " + error.message);
  }
};

export const getAllVetsService = async () => {
  try {
    const vets = await Vet.find({}, "vetId name");
    return vets;
  } catch (error) {
    throw new Error("Error fetching vets: " + error.message);
  }
}

export const getVetsAvailabilityService = async (date) => {
  if (!date) throw new Error("Date is required");

  const vets = await Vet.find().lean();

  return vets.map(vet => {
    const dayAvailability = Array.isArray(vet.availability)
      ? vet.availability.find(a => {
          if (!a || !a.date) return false;
          const iso = new Date(a.date).toISOString().split('T')[0];
          return iso === date;
        })
      : null;

    return {
      vetId: vet.vetId,
      name: vet.name,
      slots: dayAvailability && Array.isArray(dayAvailability.slots) ? dayAvailability.slots : []
    };
  });
};

export const getVetByIdService = async (vetId) => {
  try {
    const vet = await Vet.findOne({ vetId });
    return vet;
  } catch (error) {
    throw new Error("Error fetching vet: " + error.message);
  }
};

export const updateVetAvailabilityService = async ({ vetId, date, time, isAvailable }) => {
  if (!vetId || !date || !time) throw new Error("vetId, date, and time are required");

  const vet = await Vet.findOne({ vetId });
  if (!vet) throw new Error("Vet not found");

  if (!Array.isArray(vet.availability)) vet.availability = [];

  const dateStr = new Date(date).toISOString().split("T")[0];

  let day = vet.availability.find(d => d.date && new Date(d.date).toISOString().split("T")[0] === dateStr);
  if (!day) {
    day = { date: new Date(date), slots: [] };
    vet.availability.push(day);
  }

  if (!Array.isArray(day.slots)) day.slots = [];

  const slot = day.slots.find(s => s.time === time);
  if (slot) {
    slot.isAvailable = !!isAvailable;
  } else {
    day.slots.push({ time, isAvailable: !!isAvailable });
  }

  return await vet.save();
};


export const deleteVetByVetIdService = async (vetId) => {
  try {
    const deletedVet = await Vet.findOneAndDelete({ vetId });
    return deletedVet;
  } catch (error) {
    throw new Error("Error deleting vet: " + error.message);
  }
};

export const deleteVetByMongoIdService = async (id) => {
  try {
    const deletedVet = await Vet.findByIdAndDelete(id);
    return deletedVet;
  } catch (error) {
    throw new Error("Error deleting vet: " + error.message);
  }
};
