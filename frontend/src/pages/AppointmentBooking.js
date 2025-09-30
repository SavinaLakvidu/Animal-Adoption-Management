import React, { useState, useEffect } from "react";
import styles from "./AppointmentBooking.module.css";
import API from "../services/api";
import { useAuth } from "../context/AuthContext.js";

function AppointmentPage() {
  const { user, token } = useAuth();

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

  const [availableVets, setAvailableVets] = useState([]);
  const [availabilityTable, setAvailabilityTable] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch user appointments
  const fetchUserAppointments = async () => {
    if (!user || !token) return;
    try {
      const res = await API.get("/appointment/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserAppointments(res.data);
    } catch (err) {
      console.error("Error fetching user appointments:", err);
    }
  };

  useEffect(() => {
    fetchUserAppointments();
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      alert("User not logged in");
      return;
    }

    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        petName: form.petName,
        species: form.species,
        dob: form.dob,
        gender: form.gender,
        medicalHistory: form.medicalHistory,
        date: form.date,
        time: form.time,
        vetId: form.vetId,
        userEmail: user.email, // Ensure backend knows the user
      };

      const res = await API.post("/appointment", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Appointment created:", res.data);
      alert("Appointment booked successfully!");

      // Reset form
      setForm({
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

      // Refresh user appointments
      fetchUserAppointments();
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Failed to book appointment.");
    }
  };

  // Fetch vet availability
  useEffect(() => {
    if (!form.date) {
      setAvailableVets([]);
      setAvailabilityTable([]);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const res = await API.get(`/vet/availability?date=${form.date}`);
        const data = res.data;

        const filteredVets = form.time
          ? data.filter((v) =>
              v.slots.some((s) => s.time === form.time && s.isAvailable)
            )
          : [];
        setAvailableVets(filteredVets);

        // Build availability table
        const table = [];
        for (let hour = 8; hour <= 21; hour++) {
          const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
          const vetsAvailable = data
            .filter((v) =>
              v.slots.some((s) => s.time === timeLabel && s.isAvailable)
            )
            .map((v) => v.name)
            .join(", ");
          table.push({ time: timeLabel, vets: vetsAvailable || "No vets available" });
        }
        setAvailabilityTable(table);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetchAvailability();
  }, [form.date, form.time]);

  return (
    <div className={styles.container}>
      <div className={`${styles.userAppointments} ${styles.fullWidth}`}>
        <h2>Your Booked Appointments</h2>
        {userAppointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Pet Name</th>
                <th>Vet</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>{appt.pet.name}</td>
                  <td>{appt.vetId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
              <select name="species" value={form.species} onChange={handleChange}>
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
              <select name="gender" value={form.gender} onChange={handleChange}>
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
            />
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
            <select name="vetId" value={form.vetId} onChange={handleChange} required>
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
