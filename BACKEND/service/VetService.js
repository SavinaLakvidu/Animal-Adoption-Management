import Vet from "../model/Vet.js";

export const createVetService = async (vetData) => {
  try {
    const vet = new Vet(vetData);
    await vet.save();
    return vet;
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

export const getVetByIdService = async (vetId) => {
  try {
    const vet = await Vet.findOne({ vetId });
    return vet;
  } catch (error) {
    throw new Error("Error fetching vet: " + error.message);
  }
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
