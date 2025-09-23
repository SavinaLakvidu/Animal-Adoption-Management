// controller/VetController.js
import {
  createVetService,
  getAllVetsService,
  getVetByIdService,
  deleteVetByVetIdService,
  deleteVetByMongoIdService
} from "../service/VetService.js";

export const createVetController = async (req, res) => {
  try {
    const { vetId, name, address, contactNo, dateOfBirth, email, password } = req.body;
    const newVet = await createVetService({ vetId, name, address, contactNo, dateOfBirth, email, password });
    res.status(201).json({ message: "Vet created successfully", vet: newVet });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
