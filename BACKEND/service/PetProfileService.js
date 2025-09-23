import PetProfile from "../model/PetProfile.js";

// Create new pet profile
export const createPetProfileService = async (petData) => {
  try {
    const pet = new PetProfile(petData);
    await pet.save();
    return pet;
  } catch (error) {
    throw new Error("Error creating pet profile: " + error.message);
  }
};

// Get all pet profiles
export const getAllPetProfilesService = async () => {
  try {
    return await PetProfile.find().lean();
  } catch (error) {
    throw new Error("Error fetching pet profiles: " + error.message);
  }
};

// Get pet profile by ID
export const getPetProfileByIdService = async (id) => {
  try {
    const pet = await PetProfile.findById(id).lean();
    if (!pet) throw new Error("Pet not found");
    return pet;
  } catch (error) {
    throw new Error("Error fetching pet profile: " + error.message);
  }
};

// Update
export const updatePetProfileService = async (id, updateData) => {
  try {
    const updatedPet = await PetProfile.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedPet) throw new Error("Pet not found");
    return updatedPet;
  } catch (error) {
    throw new Error("Error updating pet profile: " + error.message);
  }
};

// Delete pet profile
export const deletePetProfileService = async (id) => {
  try {
    const deletedPet = await PetProfile.findByIdAndDelete(id);
    if (!deletedPet) throw new Error("Pet not found");
    return deletedPet;
  } catch (error) {
    throw new Error("Error deleting pet profile: " + error.message);
  }
};
