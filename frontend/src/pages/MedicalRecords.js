import { useEffect, useState } from "react";
import API from "../services/api";
import Modal from "react-modal";
import styles from "./MedicalRecords.module.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../context/AuthContext";

Modal.setAppElement("#root");

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    mid: "",
    dueDate: "",
    vaccination: "",
    age: "",
    petId: ""
  });

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    API.get("/medical-records")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteRecord = async (mid) => {
    try {
      await API.delete(`/medical-records/${mid}`);
      setRecords(records.filter((r) => r.mid !== mid));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (record) => {
    setEditData(record);
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecord = {
        mid: formData.mid,
        dueDate: formData.dueDate,
        vaccination: formData.vaccination,
        age: Number(formData.age),
        petId: formData.petId,
      };
      const res = await API.post("/medical-records", newRecord);
      setRecords([...records, res.data.record]);
      setIsModalOpen(false);
      setFormData({ mid: "", dueDate: "", vaccination: "", age: "", petId: "" });
    } catch (error) {
      console.error(error);
      alert("Error creating medical record");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRecord = {
        dueDate: editData.dueDate,
        vaccination: editData.vaccination,
        age: Number(editData.age),
        petId: editData.petId,
      };
      const res = await API.put(`/medical-records/${editData.mid}`, updatedRecord);
      setRecords(
        records.map((r) => (r.mid === editData.mid ? res.data.record : r))
      );
      setIsEditModalOpen(false);
      setEditData(null);
    } catch (error) {
      console.error(error);
      alert("Error updating medical record");
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text("Medical Records Report", 14, 20);
    const tableColumn = ["MID", "Due Date", "Vaccination", "Age", "Pet ID"];
    const tableRows = [];

    records.forEach((r) => {
      const rowData = [
        r.mid,
        new Date(r.dueDate).toISOString().split("T")[0],
        r.vaccination,
        r.age,
        r.petId,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("medical_records.pdf");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.mid.toLowerCase().includes(search.toLowerCase()) ||
      (r.petId && r.petId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.medicalRecordsContainer}>
      <h1>Medical Records</h1>

      <div className={styles.topBar}>
        {isAdmin && (
          <>
            <button className={styles.btn} onClick={() => setIsModalOpen(true)}>
              Create New
            </button>
            <Link className={styles.btn} to="/appointment">Appointment Scheduling</Link>
            <button className={styles.btn} onClick={downloadReport}>
              Download Report
            </button>
          </>
        )}    
      </div>

      <input
        type="text"
        placeholder="Search by MID, Pet ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <table className={styles.recordsTable}>
        <thead>
          <tr>
            <th>MID</th>
            <th>Due Date</th>
            <th>Vaccination</th>
            <th>Age</th>
            <th>Pet ID</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((r) => (
              <tr key={r._id}>
                <td>{r.mid}</td>
                <td>{new Date(r.dueDate).toISOString().split("T")[0]}</td>
                <td>{r.vaccination}</td>
                <td>{r.age}</td>
                <td>{r.petId}</td>
                {isAdmin && (
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => openEditModal(r)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => deleteRecord(r.mid)}
                    >
                      Delete
                    </button>
                </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? "6" : "5"} className={styles.noRecords}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create New Medical Record"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Create New Medical Record</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="mid"
            placeholder="MID"
            value={formData.mid}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="vaccination"
            placeholder="Vaccination Name"
            value={formData.vaccination}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
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
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.btn}>Submit</button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Medical Record"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Edit Medical Record</h2>
        {editData && (
          <form onSubmit={handleEditSubmit}>
            <input type="text" name="mid" value={editData.mid} disabled />
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate ? new Date(editData.dueDate).toISOString().split("T")[0] : ""}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              required
            />
            <input
              type="text"
              name="vaccination"
              value={editData.vaccination}
              onChange={(e) => setEditData({ ...editData, vaccination: e.target.value })}
              required
            />
            <input
              type="number"
              name="age"
              value={editData.age}
              onChange={(e) => setEditData({ ...editData, age: e.target.value })}
              required
            />
            <input
              type="text"
              name="petId"
              value={editData.petId}
              onChange={(e) => setEditData({ ...editData, petId: e.target.value })}
              required
            />
            <div className={styles.modalButtons}>
              <button type="submit" className={styles.btn}>Update</button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
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

export default MedicalRecords;
