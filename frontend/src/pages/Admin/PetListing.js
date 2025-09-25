import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Modal from "react-modal";
import styles from "./PetListing.module.css";

Modal.setAppElement("#root");

function PetListing() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);

  const [formData, setFormData] = useState({
    petId: "",
    petName: "",
    petSpecies: "Cat",
    petBreed: "",
    petAge: "",
    petDescription: "",
    petGender: "Male",
    petStatus: "Available",
    imageUrl: "",
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = () => {
    return API.get("/pet-profiles")
      .then((res) => setPets(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePetIdChange = (e) => {
    let value = (e.target.value || "").trim();
    value = value.replace(/\s+/g, "").replace(/[^A-Za-z0-9-]/g, "");
    if (value.length >= 1) value = value[0].toUpperCase() + value.slice(1);
    setFormData({ ...formData, petId: value });
  };

  const openAddModal = () => {
    setEditingPetId(null);
    setFormData({
      petId: "",
      petName: "",
      petSpecies: "Cat",
      petBreed: "",
      petAge: "",
      petDescription: "",
      petGender: "Male",
      petStatus: "Available",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitize = (str) => (str || "").replace(/<[^>]*>/g, "").trim();
    const name = sanitize(formData.petName);
    const breed = sanitize(formData.petBreed);
    const description = sanitize(formData.petDescription);
    const species = formData.petSpecies;
    const petId = (formData.petId || "").trim();
    const ageNum = Number(formData.petAge);

    if (!petId) return alert("Pet ID is required");
    if (petId.length > 20) return alert("Pet ID must be at most 20 characters");
    const idMatch = /^([A-Za-z])-\d{1,17}$/.exec(petId);
    if (!idMatch) return alert("Invalid Pet ID format. Use e.g. C-001 or D-045");
    const prefix = idMatch[1].toUpperCase();
    if (species === "Cat" && prefix !== "C") return alert("Invalid Pet ID: Cats must start with 'C-'");
    if (species === "Dog" && prefix !== "D") return alert("Invalid Pet ID: Dogs must start with 'D-'");

    if (!name || name.length < 2 || name.length > 50 || !/^[A-Za-z\s-]+$/.test(name)) {
      return alert("Name: 2–50 letters, spaces or hyphens only");
    }
    if (!breed || breed.length < 2 || breed.length > 50 || !/^[A-Za-z\s-]+$/.test(breed)) {
      return alert("Breed: 2–50 letters, spaces or hyphens only");
    }
    if (Number.isNaN(ageNum) || ageNum <= 0 || ageNum > 30) {
      return alert("Age must be > 0 and ≤ 30");
    }
    if (!description || description.length < 10 || description.length > 500) {
      return alert("Description: 10–500 characters");
    }

    const payload = {
      petId,
      petName: name,
      petSpecies: species,
      petBreed: breed,
      petAge: ageNum,
      petDescription: description,
      petGender: formData.petGender,
      petStatus: formData.petStatus,
      imageUrl: formData.imageUrl?.trim() || "https://via.placeholder.com/300?text=Pet",
    };

    try {
      if (editingPetId) {
        const { petId: _ignore, ...updatePayload } = payload;
        const res = await API.put(`/pet-profiles/${editingPetId}`, updatePayload);
        const updated = res?.data?.pet ?? res?.data;
        setPets(pets.map((pet) => (pet && pet._id === editingPetId ? updated : pet)));
        setEditingPetId(null);
      } else {
        const res = await API.post("/pet-profiles", payload);
        const created = res?.data?.pet ?? res?.data;
        if (created) await fetchPets();
      }
      setFormData({
        petId: "",
        petName: "",
        petSpecies: "Cat",
        petBreed: "",
        petAge: "",
        petDescription: "",
        petGender: "Male",
        petStatus: "Available",
        imageUrl: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(`Error saving pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Delete this pet?")) return;
    try {
      await API.delete(`/pet-profiles/${id}`);
      setPets((prev) => prev.filter((p) => p && p._id !== id));
    } catch (err) {
      console.error(err);
      alert(`Error deleting pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const openEditModal = (pet) => {
    setFormData({
      petId: pet.petId || "",
      petName: pet.petName,
      petSpecies: pet.petSpecies,
      petBreed: pet.petBreed,
      petAge: pet.petAge,
      petDescription: pet.petDescription,
      petGender: pet.petGender,
      petStatus: pet.petStatus || "Available",
      imageUrl: pet.imageUrl || "",
    });
    setEditingPetId(pet._id);
    setIsModalOpen(true);
  };

  const filteredPets = (pets || []).filter((pet) => {
    const name = (pet?.petName ?? "").toLowerCase();
    const species = (pet?.petSpecies ?? "").toLowerCase();
    const breed = (pet?.petBreed ?? "").toLowerCase();
    const q = (search ?? "").toLowerCase();
    return name.includes(q) || species.includes(q) || breed.includes(q);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pet Listing</h1>

      <div className={styles.topBar}>
        <button className={styles.btn} onClick={openAddModal}>
          Add New Pet
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, species, or breed"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <table className={styles.recordsTable}>
        <thead>
          <tr>
            <th>Pet ID</th>
            <th>Name</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.petId}</td>
                <td>{pet.petName}</td>
                <td>{pet.petSpecies}</td>
                <td>{pet.petBreed}</td>
                <td>{pet.petAge}</td>
                <td>{pet.petGender}</td>
                <td>{pet.petStatus}</td>
                <td>{pet.petDescription}</td>
                <td>
                  <button
                    className={`${styles.btn} ${styles.editBtn}`}
                    onClick={() => openEditModal(pet)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.btn} ${styles.deleteBtn}`}
                    onClick={() => deletePet(pet._id)}
                  >
                    Delete
                  </button>
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
        contentLabel="Add/Edit Pet"
        className={styles.petModal}
        overlayClassName={styles.petOverlay}
      >
        <h2>{editingPetId ? "Edit" : "Add New"} Pet</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="petId"
            placeholder="Pet ID (e.g., C-001 or D-045)"
            value={formData.petId}
            onChange={handlePetIdChange}
            required
            maxLength={20}
            pattern="^[A-Za-z]-[0-9]{1,17}$"
            title="Use format C-001 for Cats or D-001 for Dogs"
            disabled={!!editingPetId}
          />
          <input
            type="text"
            name="petName"
            placeholder="Pet Name"
            value={formData.petName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
            pattern="^[A-Za-z\s-]+$"
          />
          <select
            name="petSpecies"
            value={formData.petSpecies}
            onChange={handleChange}
            required
          >
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
          </select>
          <input
            type="text"
            name="petBreed"
            placeholder="Breed"
            value={formData.petBreed}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="petAge"
            placeholder="Age"
            value={formData.petAge}
            onChange={handleChange}
            required
          />
          <select
            name="petGender"
            value={formData.petGender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            name="petStatus"
            value={formData.petStatus}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
          <textarea
            name="petDescription"
            placeholder="Description"
            value={formData.petDescription}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleChange}
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.btn}>
              {editingPetId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.deleteBtn}`}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PetListing;
