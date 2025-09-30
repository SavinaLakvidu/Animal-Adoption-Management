import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api.js";
import styles from "./MedicalRecordDetail.module.css";

export default function MedicalRecordDetail() {
  const { mid } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await API.get(`/medical-records/${mid}`);
        setRecord(res.data);
      } catch (err) {
        console.error("Error fetching record:", err);
      }
    };
    fetchRecord();
  }, [mid]);

  if (!record) return <p className={styles.loading}>Loading record...</p>;

 return (
  <div className={styles.container}>
    <button className={styles.backBtn} onClick={() => navigate(-1)}>
      ← Back
    </button>
    <h1 className={styles.title}>
      {record.animalName} ({record.species}) – {record.breed}
    </h1>

    <div className={styles.section}>
      <h2>Basic Info</h2>
      <p><strong>MID:</strong> {record.mid}</p>
      <p><strong>Animal ID:</strong> {record.animalId}</p>
      <p><strong>Sex:</strong> {record.sex}</p>
      <p><strong>Date of Birth:</strong> {record.dateOfBirth?.substring(0, 10)}</p>
      <p><strong>Date of Examination:</strong> {record.dateOfExamination?.substring(0, 10)}</p>
      <p><strong>Reason for Examination:</strong> {record.reasonForExamination}</p>
    </div>

    <div className={styles.section}>
      <h2>Medical History</h2>
      <p><strong>Past Medical History:</strong> {record.pastMedicalHistory || "N/A"}</p>
      <p><strong>Vaccination Status:</strong> {record.vaccinationStatus || "N/A"}</p>

      {record.vitalSigns ? (
          <div>
          <strong>Vital Signs:</strong>
          <ul>
              <li>Temperature: {record.vitalSigns.temperature || "N/A"}</li>
              <li>Pulse: {record.vitalSigns.pulse || "N/A"}</li>
              <li>Respiration Rate: {record.vitalSigns.respirationRate || "N/A"}</li>
              <li>Body Condition Score: {record.vitalSigns.bodyConditionScore || "N/A"}</li>
          </ul>
          </div>
      ) : (
          <p><strong>Vital Signs:</strong> N/A</p>
      )}

      <p><strong>Diagnosis:</strong> {record.diagnosis || "N/A"}</p>
    </div>

    <div className={styles.section}>
      <p>
        <strong>Fit for Adoption:</strong> {record.fitForAdoption?.status ? "Yes" : "No"}{" "}
        {record.fitForAdoption?.notes ? `(${record.fitForAdoption.notes})` : ""}
      </p>
    </div>
  </div>
);
}
