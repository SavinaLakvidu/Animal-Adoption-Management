import { useEffect, useState } from "react";
import API from "../services/api";
import Modal from "react-modal";
import "./MedicalRecords.css";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

function AppointmentScheduling() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vets, setVets] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: "",
    time : "",
    date: "",
    vaccinationName: "",
    petId: "",
    vetId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsRes = await API.get("/appointment");
        setAppointments(appointmentsRes.data);

        const vetsRes = await API.get("/vet");
        setVets(vetsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const deleteAppointment = async (appointmentId) => {
    try {
      await API.delete(`/appointment/${appointmentId}`);
      setAppointments(appointments.filter((r) => r.appointmentId !== appointmentId));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (appointment) => {
  setEditData(appointment);
  setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const newAppointment = {
      appointmentId: formData.appointmentId,
      time: formData.time,
      date: formData.date,
      vaccinationName: formData.vaccinationName,
      petId: formData.petId,
      vetId: formData.vetId,
    };

    const res = await API.post("/appointment", newAppointment);

    setAppointments([...appointments, res.data]);
    setIsModalOpen(false);
    setFormData({ appointmentId: "", time: "", date: "", vaccinationName: "", petId: "", vetId: "" });
  } catch (error) {
    console.error(error);
    alert("Error creating appointment");
  }
};
const handleEditSubmit = async (e) => {
  e.preventDefault();

  try {
    const updatedAppointment = {
      time: editData.time,
      date: editData.date,
      vaccinationName: editData.vaccinationName,
      petId: editData.petId,
      vetId: editData.vetId,
    };

    const res = await API.put(`/appointment/${editData.appointmentId}`, updatedAppointment);

    setAppointments(
      appointments.map((r) => (r.appointmentId === editData.appointmentId ? res.data : r))

    );
    setIsEditModalOpen(false);
    setEditData(null);
  } catch (error) {
    console.error(error);
    alert("Error updating appointment");
  }
};

const filteredAppointments = appointments.filter(
  (r) =>
    (r.appointmentId && r.appointmentId.toLowerCase().includes(search.toLowerCase())) ||
    (r.petId && r.petId.toLowerCase().includes(search.toLowerCase()))
);

  return (
    <div className="medical-records-container">
      <h1>Appointment Scheduling</h1>

      <div className="top-bar">
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Create New
        </button>
        <Link className="btn" to="/medical-records">Medical Records</Link>
      </div>

      <input
        type="text"
        placeholder="Search by Appointment ID, Pet ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <table className="records-table">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Time</th>
            <th>Date</th>
            <th>Vaccination</th>
            <th>Pet ID</th>
            <th>Vet ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((r) => (
              <tr key={r._id}>
                <td>{r.appointmentId}</td>
                <td>{r.time}</td>
                <td>{new Date(r.date).toISOString().split("T")[0]}</td>
                <td>{r.vaccinationName}</td>
                <td>{r.petId}</td>
                <td>{r.vetId}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => openEditModal(r)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteAppointment(r.appointmentId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-records">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create New Appointment"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Create New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="appointmentId"
            placeholder="Appointment ID"
            value={formData.appointmentId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="time"
            placeholder="HH:MM"
            value={formData.time}
            onChange={handleChange}
            pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="vaccinationName"
            placeholder="Vaccination Name"
            value={formData.vaccinationName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="petId"
            placeholder="Pet ID"
            value={formData.petId}
            onChange={handleChange}
            required
          />
          <select
            name="vetId"
            value={formData.vetId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Vet --</option>
              {vets.map((vet) => (
                <option key={vet.vetId} value={vet.vetId}>
                  {vet.vetId}
                </option>
              ))}
          </select>
          <div className="modal-buttons">
            <button type="submit" className="btn">
              Submit
            </button>
            <button type="button" className="btn btn-danger" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Appointment"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Appointment</h2>
        {editData && (
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="appointmentId"
              value={editData.appointmentId}
              disabled
            />
            <input
              type="text"
              name="time"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
              required
            />
            <input
              type="date"
              name="date"
              value={new Date(editData.date).toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              required
            />
            <input
              type="text"
              name="vaccinationName"
              value={editData.vaccinationName}
              onChange={(e) =>
                setEditData({ ...editData, vaccinationName: e.target.value })
              }
              required
            />
            <input
              type="text"
              name="petId"
              value={editData.petId}
              onChange={(e) => setEditData({ ...editData, petId: e.target.value })}
              required
            />
            <select
              name="vetId"
              value={editData.vetId}
              onChange={(e) => setEditData({ ...editData, vetId: e.target.value })}
              required
            >
              <option value="">-- Select Vet --</option>
              {vets.map((vet) => (
                <option key={vet.vetId} value={vet.vetId}>
                  {vet.vetId}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button type="submit" className="btn">Update</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
    </Modal>

    </div>
  );
}

export default AppointmentScheduling;
