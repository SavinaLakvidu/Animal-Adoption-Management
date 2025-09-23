import React, { useState, useEffect } from "react";
import "./PetAdoption.css";

function PetAdoption() {
  const [pets, setPets] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [breedFilter, setBreedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);

  // Fetch pets from backend
  useEffect(() => {
    async function fetchPets() {
      try {
        const response = await fetch("http://localhost:5000/api/pets"); // replace with your backend route
        const data = await response.json();
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    }
    fetchPets();
  }, []);

  // Get unique breeds dynamically based on selected species
  const breeds = [
    "All",
    ...new Set(
      pets
        .filter(p => speciesFilter === "All" || p.petSpecies === speciesFilter)
        .map(p => p.petBreed)
    ),
  ];

  const filteredPets = pets.filter(
    pet =>
      (speciesFilter === "All" || pet.petSpecies === speciesFilter) &&
      (breedFilter === "All" || pet.petBreed === breedFilter) &&
      (pet.petName.toLowerCase().includes(search.toLowerCase()) ||
       pet.petBreed.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pet-adoption-container">
      <h1>Pet Adoption</h1>

      {/* Filters */}
      <div className="filter-bar">
        <select
          value={speciesFilter}
          onChange={e => {
            setSpeciesFilter(e.target.value);
            setBreedFilter("All");
          }}
        >
          <option value="All">All Species</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
        </select>

        <select value={breedFilter} onChange={e => setBreedFilter(e.target.value)}>
          {breeds.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name or breed..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Pet cards */}
      <div className="pet-cards">
        {filteredPets.length > 0 ? (
          filteredPets.map(pet => (
            <div className="pet-card" key={pet._id}>
              <img src={pet.imageUrl} alt={pet.petName} />
              <h2>{pet.petName}</h2>
              <p><strong>Species:</strong> {pet.petSpecies}</p>
              <p><strong>Breed:</strong> {pet.petBreed}</p>
              <p><strong>Age:</strong> {pet.petAge} years</p>
              <button className="btn adopt-btn" onClick={() => setSelectedPet(pet)}>View Details</button>
            </div>
          ))
        ) : (
          <p className="no-pets">No pets found</p>
        )}
      </div>

      {/* Modal */}
      {selectedPet && (
        <div className="modal-overlay" onClick={() => setSelectedPet(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedPet.petName}</h2>
            <img src={selectedPet.imageUrl} alt={selectedPet.petName} />
            <p><strong>Species:</strong> {selectedPet.petSpecies}</p>
            <p><strong>Breed:</strong> {selectedPet.petBreed}</p>
            <p><strong>Age:</strong> {selectedPet.petAge} years</p>
            <p><strong>Description:</strong> {selectedPet.petDescription}</p>
            <p><strong>Behavior:</strong> {selectedPet.petBehavior}</p>
            <p><strong>Medical:</strong> {selectedPet.petMedical}</p>
            <button className="btn adopt-btn">Adopt Me</button>
            <button className="btn close-btn" onClick={() => setSelectedPet(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetAdoption;
