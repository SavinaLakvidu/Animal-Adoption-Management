import React, { useEffect, useState } from "react";
import styles from "./ManageAppointments.module.css";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const updateNestedState = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => acc[key], obj);
  lastObj[lastKey] = value;
  return { ...obj };
};

const AppointmentTable = ({ appointments, onEdit, onDelete }) => (
  <div className={styles.section}>
    <h3>All Upcoming Appointments</h3>
    {appointments.length === 0 ? (
      <p>No upcoming appointments.</p>
    ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Pet</th>
            <th>Owner</th>
            <th>Vet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>{new Date(appt.date).toLocaleDateString()}</td>
              <td>{appt.time}</td>
              <td>{appt.pet?.name}</td>
              <td>{appt.owner?.fullName}</td>
              <td>{appt.vetId || "Unassigned"}</td>
              <td>
                <button onClick={() => onEdit(appt)} className={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => onDelete(appt._id)} className={styles.deleteBtn}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const EditModal = ({ appt, onChange, onSave, onCancel }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h3>Edit Appointment</h3>
        <div className={styles.modalForm}>
          <label>Date</label>
          <input type="date" name="date" value={appt.date.slice(0, 10)} onChange={onChange} />

          <label>Time</label>
          <input type="time" name="time" value={appt.time} onChange={onChange} />

          <h4>Owner Info</h4>
          <label>Full Name</label>
          <input name="owner.fullName" value={appt.owner.fullName} onChange={onChange} />
          <label>Phone</label>
          <input name="owner.phoneNumber" value={appt.owner.phoneNumber} onChange={onChange} />

          <h4>Pet Info</h4>
          <label>Name</label>
          <input name="pet.name" value={appt.pet.name} onChange={onChange} />
          <label>Species</label>
          <select name="pet.species" value={appt.pet.species} onChange={onChange}>
            <option>Dog</option>
            <option>Cat</option>
          </select>
          <label>Date of Birth</label>
          <input type="date" name="pet.dob" value={appt.pet.dob.slice(0, 10)} onChange={onChange} />
          <label>Gender</label>
          <select name="pet.gender" value={appt.pet.gender} onChange={onChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Neutered</option>
            <option>Spayed</option>
          </select>
          <label>Medical History</label>
          <textarea name="pet.medicalHistory" value={appt.pet.medicalHistory} onChange={onChange} />

          <div className={styles.modalButtons}>
            <button className={styles.saveBtn} onClick={onSave}>
              Save
            </button>
            <button className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AvailabilityForm = ({ availability, setAvailability, onSubmit, vets }) => (
  <div className={styles.section}>
    <h3>Set Availability</h3>
    <form onSubmit={onSubmit} className={styles.form}>
      <label>Date</label>
      <input
        type="date"
        value={availability.date}
        onChange={(e) => setAvailability({ ...availability, date: e.target.value })}
        required
      />
      <label>Time</label>
      <input
        type="time"
        value={availability.time}
        onChange={(e) => setAvailability({ ...availability, time: e.target.value })}
        required
      />
      <label>Status</label>
      <select
        value={availability.isAvailable}
        onChange={(e) =>
          setAvailability({ ...availability, isAvailable: e.target.value === "true" })
        }
      >
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>

      <label>Vet</label>
      <select
        value={availability.vetId}
        onChange={(e) => setAvailability({ ...availability, vetId: e.target.value })}
        required
      >
        <option value="">Select Vet</option>
        {vets.map((vet) => (
          <option key={vet._id} value={vet.vetId}>
            {vet.name}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.saveBtn}>
        Save
      </button>
    </form>
  </div>
);

function ManageAppointments() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({ date: "", time: "", isAvailable: true, vetId: "" });
  const [editingAppt, setEditingAppt] = useState(null);
  const [vets, setVets] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.role === "VET") {
      fetchAppointments();
    }
  }, [user, token]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await API.get("/vet");
        setVets(res.data);
      } catch (err) {
        console.error("Error fetching vets:", err);
      }
    };
    fetchVets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/appointment/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(appointments.filter((appt) => appt._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (appt) => setEditingAppt({ ...appt });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAppt((prev) => updateNestedState({ ...prev }, name, value));
  };

  const handleSave = async () => {
    try {
      const res = await API.put(`/appointment/${editingAppt._id}`, editingAppt, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map((appt) => (appt._id === editingAppt._id ? res.data : appt)));
      setEditingAppt(null);
      alert("Appointment updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment.");
    }
  };

  const handleCancel = () => setEditingAppt(null);

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/vet/availability", { ...availability }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Availability updated!");
      setAvailability({ date: "", time: "", isAvailable: true, vetId: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to update availability.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Appointments</h2>
      <div className={styles.row}>
        <AppointmentTable appointments={appointments} onEdit={handleEdit} onDelete={handleDelete} />
        <AvailabilityForm
          availability={availability}
          setAvailability={setAvailability}
          onSubmit={handleAvailabilitySubmit}
          vets={vets}
        />
      </div>
      {editingAppt && <EditModal appt={editingAppt} onChange={handleChange} onSave={handleSave} onCancel={handleCancel} />}
    </div>
  );
}

export default ManageAppointments;
