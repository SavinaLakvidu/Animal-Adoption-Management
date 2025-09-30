import React, { useEffect, useState } from "react";
import styles from "./MedicalRecords.module.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function MedicalRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mid: "",
    animalId: "",
    animalName: "",
    species: "",
    breed: "",
    sex: "",
    dateOfBirth: "",
    dateOfExamination: "",
    reasonForExamination: "",
    pastMedicalHistory: "",
    vaccinationStatus: "",
    vitalSigns: "",
    diagnosis: "",
    followUpDate: "",
    fitForAdoption: { status: false, notes: "" },
  });

  // Fetch records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await API.get("/medical-records");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // Search filter
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredRecords(
      records.filter(
        (rec) =>
          rec.mid.toLowerCase().includes(lower) ||
          rec.animalId.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, records]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "fitForAdoption.status") {
      setFormData({
        ...formData,
        fitForAdoption: { ...formData.fitForAdoption, status: checked },
      });
    } else if (name === "fitForAdoption.notes") {
      setFormData({
        ...formData,
        fitForAdoption: { ...formData.fitForAdoption, notes: value },
      });
    } else if (name.startsWith("vitalSigns.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        vitalSigns: { ...formData.vitalSigns, [field]: value },
      });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    try {
      if (isEditing) {
        const res = await API.put(`/medical-records/${formData.mid}`, formData);
        console.log("Update response:", res.data);
      } else {
        const res = await API.post("/medical-records", formData);
        console.log("Create response:", res.data);
      }
      fetchRecords();
      setIsModalOpen(false);
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving record:", err.response?.data || err);
    }
  };

  const resetForm = () => {
    setFormData({
      mid: "",
      animalId: "",
      animalName: "",
      species: "",
      breed: "",
      sex: "",
      dateOfBirth: "",
      dateOfExamination: "",
      reasonForExamination: "",
      pastMedicalHistory: "",
      vaccinationStatus: "",
      vitalSigns: "",
      diagnosis: "",
      followUpDate: "",
      fitForAdoption: { status: false, notes: "" },
    });
  };

  // Delete record
  const handleDelete = async (mid) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/medical-records/${mid}`);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // Edit record
  const handleEdit = (record) => {
    setFormData(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Download PDF
  const downloadPDF = (record) => {
    const doc = new jsPDF();
    doc.text("Medical Record", 14, 20);
    console.log("autoTable method:", typeof doc.autoTable);

    const rows = [
      ["Medical Record ID", record.mid],
      ["Animal ID", record.animalId],
      ["Animal Name", record.animalName],
      ["Species", record.species],
      ["Breed", record.breed],
      ["Sex", record.sex],
      ["Date of Birth", record.dateOfBirth?.substring(0, 10)],
      ["Date of Examination", record.dateOfExamination?.substring(0, 10)],
      ["Reason for Examination", record.reasonForExamination],
      ["Past Medical History", record.pastMedicalHistory],
      ["Vaccination Status", record.vaccinationStatus],
      ["Vital Signs", record.vitalSigns],
      ["Diagnosis", record.diagnosis],
      ["Fit for Adoption", record.fitForAdoption?.status ? "Yes" : "No"],
      ["Adoption Notes", record.fitForAdoption?.notes || ""],
    ];

    doc.autoTable({
      startY: 30,
      head: [["Field", "Value"]],
      body: rows,
    });

    doc.save(`MedicalRecord_${record.mid}.pdf`);
  };

  return (
  <div className={styles.container}>
    <h1 className={styles.title}>Medical Records</h1>

    {/* Search + Add */}
    <div className={styles.topBar}>
      <input
        type="text"
        placeholder="Search by MID or Animal ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.search}
      />
      <button
        className={styles.addBtn}
        onClick={() => {
          setIsModalOpen(true);
          setIsEditing(false);
          resetForm();
        }}
      >
        + Add New Record
      </button>
    </div>

    {/* Records List */}
    <div className={styles.recordList}>
      {filteredRecords.length === 0 ? (
        <p>No records found.</p>
      ) : (
        filteredRecords.map((record) => (
          <div key={record.mid} className={styles.recordCard}>
            <div className={styles.recordInfo}>
              <h3
                className={styles.recordTitle}
                onClick={() => navigate(`/medical-records/${record.mid}`)}
              >
                {record.animalName} ({record.species}) – {record.breed}
              </h3>
              <p>
                <strong>MID:</strong> {record.mid} | <strong>Animal ID:</strong>{" "}
                {record.animalId}
              </p>
              <p>
                <strong>Date of Exam:</strong>{" "}
                {record.dateOfExamination?.substring(0, 10)}
              </p>
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis || "N/A"}
              </p>
              <p>
                <strong>Vaccinations:</strong> {record.vaccinationStatus || "N/A"}
              </p>

              {record.vitalSigns && (
                <div>
                  <strong>Vital Signs:</strong>
                  <ul>
                    <li>Temperature: {record.vitalSigns.temperature || "N/A"}</li>
                    <li>Pulse: {record.vitalSigns.pulse || "N/A"}</li>
                    <li>Respiration Rate: {record.vitalSigns.respirationRate || "N/A"}</li>
                    <li>Body Condition Score: {record.vitalSigns.bodyConditionScore || "N/A"}</li>
                  </ul>
                </div>
              )}

              <p>
                <strong>Fit for Adoption:</strong>{" "}
                {record.fitForAdoption?.status ? "Yes" : "No"}{" "}
                {record.fitForAdoption?.notes
                  ? `(${record.fitForAdoption.notes})`
                  : ""}
              </p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.pdfBtn}
                onClick={() => downloadPDF(record)}
              >
              PDF
              </button>
              <button
                className={styles.editBtn}
                onClick={() => handleEdit(record)}
              >
              Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(record.mid)}
              >
              Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Modal Form */}
    {isModalOpen && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>{isEditing ? "Edit Medical Record" : "Add New Medical Record"}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Info */}
            <input
              type="text"
              name="mid"
              placeholder="Medical Record ID"
              value={formData.mid}
              onChange={handleChange}
              required
              disabled={isEditing}
            />
            <input
              type="text"
              name="animalId"
              placeholder="Animal ID"
              value={formData.animalId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="animalName"
              placeholder="Animal Name"
              value={formData.animalName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="species"
              placeholder="Species"
              value={formData.species}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={formData.breed}
              onChange={handleChange}
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <div className={styles.inputGroup}>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.substring(0, 10) || ""}
                onChange={handleChange}
                placeholder="Date Of Birth"
              />
              <label>Date of Examination:</label>
              <input
                type="date"
                name="dateOfExamination"
                value={formData.dateOfExamination?.substring(0, 10) || ""}
                onChange={handleChange}
                placeholder="Date Of Examination"
                required
              />
            </div>  
            <textarea
              name="reasonForExamination"
              placeholder="Reason for Examination"
              value={formData.reasonForExamination}
              onChange={handleChange}
            />
            <textarea
              name="pastMedicalHistory"
              placeholder="Past Medical History"
              value={formData.pastMedicalHistory}
              onChange={handleChange}
            />
            <textarea
              name="vaccinationStatus"
              placeholder="Vaccination Status"
              value={formData.vaccinationStatus}
              onChange={handleChange}
            />
            <textarea
              name="diagnosis"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />

            <div className={styles.vitalSigns}>
              <label>Vital Signs:</label>
              <input
                type="text"
                name="vitalSigns.temperature"
                placeholder="Temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleChange}
              />
              <input
                type="text"
                name="vitalSigns.pulse"
                placeholder="Pulse"
                value={formData.vitalSigns.pulse}
                onChange={handleChange}
              />
              <input
                type="text"
                name="vitalSigns.respirationRate"
                placeholder="Respiration Rate"
                value={formData.vitalSigns.respirationRate}
                onChange={handleChange}
              />
              <input
                type="text"
                name="vitalSigns.bodyConditionScore"
                placeholder="Body Condition Score"
                value={formData.vitalSigns.bodyConditionScore}
                onChange={handleChange}
              />
            </div>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="fitForAdoption.status"
                  checked={formData.fitForAdoption.status}
                  onChange={handleChange}
                />{" "}
                Fit for Adoption
              </label>
              <input
                type="text"
                name="fitForAdoption.notes"
                placeholder="Adoption Notes"
                value={formData.fitForAdoption.notes}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                {isEditing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
