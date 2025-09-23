// src/pages/Admin/PetListing.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function PetListing() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // Admin auth token

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/pet-profiles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPets();
  }, [token]);

  // Delete pet
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.delete(`http://localhost:3000/pet-profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refresh after delete
        setPets((prevPets) => prevPets.filter((pet) => pet._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading pets...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pet Listing</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add New Pet
        </button>
      </div>

      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet._id}>
              <td className="border px-4 py-2">{pet.petName}</td>
              <td className="border px-4 py-2">{pet.petAge}</td>
              <td className="border px-4 py-2">{pet.petLocation}</td>
              <td className="border px-4 py-2">{pet.petSpecies}</td>
              <td className="border px-4 py-2 text-center">
                <div className="flex gap-3 justify-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => alert("Edit modal will open")}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(pet._id)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PetListing;
