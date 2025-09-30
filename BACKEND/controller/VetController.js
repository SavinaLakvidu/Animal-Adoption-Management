import {
  createVetService,
  getAllVetsService,
  getVetByIdService,
  deleteVetByVetIdService,
  deleteVetByMongoIdService,
  getVetsAvailabilityService,
  updateVetAvailabilityService
} from "../service/VetService.js";

export const createVetController = async (req, res) => {
  try {
    const data = req.body;
    const newVets = await createVetService(data);

    res.status(201).json({
      message: Array.isArray(data)
        ? "Vets created successfully"
        : "Vet created successfully",
      vets: newVets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVetsAvailability = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const availability = await getVetsAvailabilityService(date);
    res.json(availability);
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getAllVetsController = async (req, res) => {
  try {
    const vets = await getAllVetsService();
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVetByIdController = async (req, res) => {
  try {
    const { vetId } = req.params;
    const vet = await getVetByIdService(vetId);

    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { vetId, date, time, isAvailable } = req.body;

    if (!vetId || !date || !time || typeof isAvailable === "undefined") {
      return res.status(400).json({ error: "vetId, date, time, and isAvailable are required" });
    }

    const updatedVet = await updateVetAvailabilityService({ vetId, date, time, isAvailable });

    return res.status(200).json(updatedVet);
  } catch (err) {
    console.error("Error updating vet availability:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteVetController = async (req, res) => {
  try {
    const { vetId } = req.params;
    const deletedVet = await deleteVetByVetIdService(vetId);

    if (!deletedVet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    res.json({ message: "Vet deleted successfully", vet: deletedVet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVetByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVet = await deleteVetByMongoIdService(id);

    if (!deletedVet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    res.json({ message: "Vet deleted successfully", vet: deletedVet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
