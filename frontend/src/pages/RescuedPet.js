import { useEffect, useState } from "react";
import API from "../services/api";
import Modal from "react-modal";
import styles from "./RescuedPet.module.css"; // import as object

Modal.setAppElement("#root");

function RescuedPet() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);

  const [formData, setFormData] = useState({
    rescuedPetId: "",
    rescuedPetName: "",
    description: "",
    rescuedDate: "",
    rescuedPetAge: "",
    rescuedPetGender: "Male",
    healthStatus: "Healthy",
    adoptionStatus: "Available",
    imageUrl: "",
  });

  const fetchPets = () => {
    return API.get("/rescued-pets")
      .then((res) => setPets(res.data))
      .catch((err) => console.error(err));
  };

  const refreshData = () => fetchPets();

  useEffect(() => {
    fetchPets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingPetId(null);
    setFormData({
      rescuedPetId: "",
      rescuedPetName: "",
      description: "",
      rescuedDate: "",
      rescuedPetAge: "",
      rescuedPetGender: "Male",
      healthStatus: "Healthy",
      adoptionStatus: "Available",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const sanitize = (str) => (str || "").replace(/<[^>]*>/g, "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = sanitize(formData.rescuedPetName);
    if (!name || name.length < 2 || name.length > 100 || !/^[A-Za-z\s-]+$/.test(name)) {
      alert("Name must be 2-100 letters/spaces/hyphens.");
      return;
    }
    const desc = sanitize(formData.description);
    if (!desc || desc.length < 10 || desc.length > 1000) {
      alert("Description must be 10-1000 characters.");
      return;
    }
    const ageNum = Number(formData.rescuedPetAge);
    if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 30) {
      alert("Age must be between 0 and 30.");
      return;
    }

    try {
      const payload = {
        rescuedPetName: name,
        description: desc,
        rescuedDate: formData.rescuedDate,
        rescuedPetAge: Number(formData.rescuedPetAge),
        rescuedPetGender: formData.rescuedPetGender,
        healthStatus: formData.healthStatus,
        adoptionStatus: formData.adoptionStatus,
        imageUrl: formData.imageUrl || "",
      };

      if (editingPetId) {
        const res = await API.put(`/rescued-pets/${editingPetId}`, payload);
        const updated = res?.data?.pet ?? res?.data;
        setPets(pets.map((pet) => (pet && pet._id === editingPetId ? updated : pet)));
        setEditingPetId(null);
      } else {
        const res = await API.post("/rescued-pets", { ...payload, rescuedPetId: formData.rescuedPetId });
        const created = res?.data?.pet ?? res?.data;
        if (created) setPets((prev) => [...prev, created]);
      }

      setFormData({
        rescuedPetId: "",
        rescuedPetName: "",
        description: "",
        rescuedDate: "",
        rescuedPetAge: "",
        rescuedPetGender: "Male",
        healthStatus: "",
        adoptionStatus: "Available",
        imageUrl: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(`Error saving rescued pet record: ${err.response?.data?.message || err.message}`);
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Delete this rescued pet?")) return;
    try {
      await API.delete(`/rescued-pets/${id}`);
      setPets((prev) => prev.filter((p) => p && p._id !== id));
    } catch (err) {
      console.error(err);
      alert(`Error deleting rescued pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const adoptPet = async (id) => {
    if (!window.confirm("Mark this pet as adopted?")) return;
    try {
      const res = await API.put(`/rescued-pets/${id}`, { adoptionStatus: "Adopted" });
      const updated = res?.data?.pet ?? res?.data;
      setPets(pets.map((pet) => (pet && pet._id === id ? updated : pet)));
      alert("Pet has been marked as adopted!");
    } catch (err) {
      console.error(err);
      alert(`Error adopting pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const openEditModal = (pet) => {
    if (!pet || !pet._id) return alert("Invalid pet data.");
    setFormData({
      rescuedPetId: pet.rescuedPetId,
      rescuedPetName: pet.rescuedPetName,
      description: pet.description,
      rescuedDate: new Date(pet.rescuedDate).toISOString().split("T")[0],
      rescuedPetAge: pet.rescuedPetAge,
      rescuedPetGender: pet.rescuedPetGender,
      healthStatus: pet.healthStatus || "Healthy",
      adoptionStatus: pet.adoptionStatus || "Available",
      imageUrl: pet.imageUrl || "",
    });
    setEditingPetId(pet._id);
    setIsModalOpen(true);
  };

  const filteredPets = (pets || []).filter((pet) => {
    const id = (pet?.rescuedPetId ?? "").toString().toLowerCase();
    const name = (pet?.rescuedPetName ?? "").toString().toLowerCase();
    const q = (search ?? "").toLowerCase();
    return id.includes(q) || name.includes(q);
  });

  return (
    <div className={styles.container}>
      <h1>Rescued Pets</h1>

      <div className={styles.topBar}>
        <button className={styles.btn} onClick={openAddModal}>
          Add New Pet
        </button>
        <button className={styles.btnRefresh} onClick={refreshData}>
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by ID or Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <table className={styles.recordsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Health Status</th>
            <th>Adoption Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.rescuedPetId}</td>
                <td>{pet.rescuedPetName}</td>
                <td>{pet.description}</td>
                <td>{pet?.rescuedDate ? new Date(pet.rescuedDate).toISOString().split("T")[0] : ""}</td>
                <td>{pet.rescuedPetAge}</td>
                <td>{pet.rescuedPetGender}</td>
                <td>{pet.healthStatus || "Healthy"}</td>
                <td>{pet.adoptionStatus || "Available"}</td>
                <td>
                  <button className={styles.btnEdit} onClick={() => openEditModal(pet)}>Edit</button>
                  <button className={styles.btnDanger} onClick={() => deletePet(pet._id)}>Delete</button>
                  {pet.adoptionStatus === "Available" && (
                    <button className={styles.btnSuccess} onClick={() => adoptPet(pet._id)}>Adopt</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className={styles.noRecords}>
                No pets found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add/Edit Rescued Pet"
        className={styles.modalWindow}
        overlayClassName={styles.modalOverlay}
      >
        <h2>{editingPetId ? "Edit" : "Add New"} Rescued Pet</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="rescuedPetId"
            placeholder="Pet ID"
            value={formData.rescuedPetId}
            onChange={handleChange}
            required
            maxLength={4}
            pattern="^[A-Za-z0-9-]+$"
            title="Use letters, numbers, and hyphens only, max 4 chars"
            disabled={!!editingPetId}
          />
          <input
            type="text"
            name="rescuedPetName"
            placeholder="Pet Name"
            value={formData.rescuedPetName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
            pattern="^[A-Za-z\s-]+$"
            title="2-100 characters. Letters, spaces and hyphens only."
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
          />
          <input
            type="date"
            name="rescuedDate"
            value={formData.rescuedDate}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="rescuedPetAge"
            placeholder="Age"
            value={formData.rescuedPetAge}
            onChange={handleChange}
            required
            min={0}
            max={30}
            step={0.1}
          />
          <select name="rescuedPetGender" value={formData.rescuedPetGender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select name="healthStatus" value={formData.healthStatus} onChange={handleChange}>
            <option value="Healthy">Healthy</option>
            <option value="Injured">Injured</option>
            <option value="Recovering">Recovering</option>
          </select>
          <select name="adoptionStatus" value={formData.adoptionStatus} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Adopted">Adopted</option>
          </select>
          <input type="url" name="imageUrl" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} pattern="https?://.*" title="Provide a valid URL starting with http(s)" />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.btn}>
              {editingPetId ? "Update" : "Submit"}
            </button>
            <button type="button" className={styles.btnDanger} onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default RescuedPet;
