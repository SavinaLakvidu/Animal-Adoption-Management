import {
  createAdoptionFormService,
  getAllAdoptionFormsService,
  getAdoptionFormByIdService,
  updateAdoptionFormService,
  deleteAdoptionFormService,
} from "../service/AdoptionFormService.js";

// Create a new adoption form
export const createAdoptionFormController = async (req, res) => {
  try {
    const formData = req.body;

    // Basic validation
    const { adopterName, adopterEmail, adopterPhone, adopterAddress, reasonForAdoption, petId } = formData;
    if (!adopterName || !adopterEmail || !adopterPhone || !adopterAddress || !reasonForAdoption || !petId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newForm = await createAdoptionFormService(formData);
    res.status(201).json(newForm);
  } catch (error) {
    console.error("Error creating adoption form:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all adoption forms
export const getAllAdoptionFormsController = async (req, res) => {
  try {
    const forms = await getAllAdoptionFormsService();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching adoption forms:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get adoption form by ID
export const getAdoptionFormByIdController = async (req, res) => {
  try {
    const form = await getAdoptionFormByIdService(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching adoption form by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update adoption form
export const updateAdoptionFormController = async (req, res) => {
  try {
    const updatedForm = await updateAdoptionFormService(req.params.id, req.body);
    if (!updatedForm) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(updatedForm);
  } catch (error) {
    console.error("Error updating adoption form:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete adoption form
export const deleteAdoptionFormController = async (req, res) => {
  try {
    const deletedForm = await deleteAdoptionFormService(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: "Form not found" });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting adoption form:", error);
    res.status(500).json({ message: error.message });
  }
};
