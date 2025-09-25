import { useEffect, useState } from "react";
import API from "../services/api";

function PetAdoption() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/pet-profiles")
      .then((res) => setPets(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, []);

  const filteredPets = (pets || []).filter((pet) => {
    const q = (search ?? "").toString().toLowerCase();
    return (
      (pet?.petName ?? "").toString().toLowerCase().includes(q) ||
      (pet?.petBreed ?? "").toString().toLowerCase().includes(q) ||
      (pet?.petSpecies ?? "").toString().toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ width: "90%", maxWidth: 1200, margin: "30px auto" }}>
      <h1>Pet Adoption</h1>
      <input
        type="text"
        placeholder="Search by name, breed or species"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "10px 0 20px", borderRadius: 6, border: "1px solid #ccc" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div key={pet._id} style={{ background: "#fff", borderRadius: 8, padding: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ fontWeight: 600 }}>{pet.petName}</div>
              <div><strong>Species:</strong> {pet.petSpecies}</div>
              <div><strong>Breed:</strong> {pet.petBreed}</div>
              <div><strong>Age:</strong> {pet.petAge}</div>
              <div style={{ marginTop: 8, color: "#555" }}>{pet.petDescription}</div>
            </div>
          ))
        ) : (
          <div>No pets found</div>
        )}
      </div>
    </div>
  );
}

export default PetAdoption;



