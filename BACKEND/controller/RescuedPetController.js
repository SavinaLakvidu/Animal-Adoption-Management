import RescuedPet from "../model/RescuedPet.js";

// Admin creates rescued pet profile
export const createRescuedPet = async (req, res) => {
  try {
    const rescuedPet = new RescuedPet(req.body);
    await rescuedPet.save();
    res.status(201).json(rescuedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin/Vet view rescued pets
export const getRescuedPets = async (req, res) => {
  try {
    const pets = await RescuedPet.find().populate("vetId");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vet confirms pet
export const confirmRescuedPet = async (req, res) => {
  try {
    const pet = await RescuedPet.findByIdAndUpdate(
      req.params.id,
      { isConfirmed: true },
      { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet confirmed successfully", pet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update rescued pet
export const updateRescuedPet = async (req, res) => {
  try {
    const updated = await RescuedPet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete rescued pet
export const deleteRescuedPet = async (req, res) => {
  try {
    const deleted = await RescuedPet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update rescued pet by rescuedPetId (business identifier)
export const updateRescuedPetByCode = async (req, res) => {
  try {
    const updated = await RescuedPet.findOneAndUpdate(
      { rescuedPetId: req.params.code },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete rescued pet by rescuedPetId (business identifier)
export const deleteRescuedPetByCode = async (req, res) => {
  try {
    const deleted = await RescuedPet.findOneAndDelete({ rescuedPetId: req.params.code });
    if (!deleted) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
