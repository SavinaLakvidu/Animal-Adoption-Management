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
