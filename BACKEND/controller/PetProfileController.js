import {
  createPetProfileService,
  getAllPetProfilesService,
  getPetProfileByIdService,
  updatePetProfileService,
  deletePetProfileService,
} from "../service/PetProfileService.js";

// Create new pet profile
export const createPetProfileController = async (req, res) => {
  try {
    const petData = req.body;

    // Basic validation
    if (!petData.petName || !petData.petSpecies || !petData.petDescription) {
      return res.status(400).json({ message: "petName, petSpecies, and petDescription are required" });
    }

    const newPet = await createPetProfileService(petData);
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pet profiles
export const getAllPetProfilesController = async (req, res) => {
  try {
    const pets = await getAllPetProfilesService();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching all pets:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get pet profile by ID
export const getPetProfileByIdController = async (req, res) => {
  try {
    const pet = await getPetProfileByIdService(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update pet profile
export const updatePetProfileController = async (req, res) => {
  try {
    const updatedPet = await updatePetProfileService(req.params.id, req.body);
    if (!updatedPet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Error updating pet profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update medical info for pet
export const updateMedicalInfoController = async (req, res) => {
  try {
    const { medicalInfo } = req.body;
    const updatedPet = await updatePetProfileService(req.params.id, { medicalInfo });
    if (!updatedPet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json({ message: "Medical info updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error updating medical info:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete pet profile
export const deletePetProfileController = async (req, res) => {
  try {
    const deletedPet = await deletePetProfileService(req.params.id);
    if (!deletedPet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet profile:", error);
    res.status(500).json({ message: error.message });
  }
};
