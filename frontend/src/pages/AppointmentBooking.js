import React, { useState, useEffect } from "react";
import styles from "./AppointmentBooking.module.css";
import API from "../services/api"; // Axios instance

function AppointmentPage() {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    petName: "",
    species: "Dog",
    dob: "",
    gender: "Male",
    medicalHistory: "",
    time: "",
    date: "",
    vetId: "",
  });

  const [vets, setVets] = useState([]);
  const [availableVets, setAvailableVets] = useState([]);
  const [availabilityTable, setAvailabilityTable] = useState([]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await API.get("/vets");
        setVets(res.data);
      } catch (err) {
        console.error("Error fetching vets:", err);
      }
    };
    fetchVets();
  }, []);

  useEffect(() => {
    if (!form.date || !form.time) {
      setAvailableVets([]);
      return;
    }
    const selectedDate = new Date(form.date).toISOString().split("T")[0];

    const available = vets.filter((vet) =>
      vet.availability.some(
        (day) =>
          day.date.split("T")[0] === selectedDate &&
          day.slots.some((slot) => slot.time === form.time && slot.isAvailable)
      )
    );
    setAvailableVets(available);
  }, [form.date, form.time, vets]);

  useEffect(() => {
    if (!form.date) return;
    const selectedDate = new Date(form.date).toISOString().split("T")[0];
    const table = [];

    for (let hour = 8; hour <= 21; hour++) {
      const timeLabel = hour.toString().padStart(2, "0") + ":00";
      const vetsAvailable = vets
        .filter((vet) =>
          vet.availability.some(
            (day) =>
              day.date.split("T")[0] === selectedDate &&
              day.slots.some((slot) => slot.time === timeLabel && slot.isAvailable)
          )
        )
        .map((v) => v.name)
        .join(", ");
      table.push({ time: timeLabel, vets: vetsAvailable || "No vets available" });
    }
    setAvailabilityTable(table);
  }, [form.date, vets]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Appointment submitted:", form);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <h3>Owner Information</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3>Pet Information</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Pet’s Name</label>
              <input
                name="petName"
                value={form.petName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Species</label>
              <select
                name="species"
                value={form.species}
                onChange={handleChange}
              >
                <option>Dog</option>
                <option>Cat</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Neutered</option>
                <option>Spayed</option>
              </select>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Medical History Notes</label>
            <textarea
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
            ></textarea>
          </div>

          <h3>Appointment Info</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Select Vet</label>
            <select
              name="vetId"
              value={form.vetId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a vet</option>
              {availableVets.map((v) => (
                <option key={v.vetId} value={v.vetId}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Book Appointment</button>
        </form>
      </div>
      
      <div className={styles.tableContainer}>
        <h2>Available Vets on {form.date || "Select Date"}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Available Vets</th>
            </tr>
          </thead>
          <tbody>
            {availabilityTable.map((row, i) => (
              <tr key={i}>
                <td>{row.time}</td>
                <td>{row.vets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentPage;
