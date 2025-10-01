import { useEffect, useMemo, useState } from "react";
import styles from "./Overview.module.css";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function Overview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pets, setPets] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    const role = user?.role || "USER";

    Promise.all([
      API.get("/pet-profiles", { params: { userRole: role } }).catch(() => ({ data: [] })),
      API.get("/rescued-pets", { params: { userRole: role } }).catch(() => ({ data: [] })),
      API.get("/api/donations").catch(() => ({ data: [] })),
      API.get("/api/volunteers").catch(() => ({ data: [] })),
    ])
      .then(([petsRes, rescuesRes, donationsRes, volunteersRes]) => {
        if (!mounted) return;
        setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
        setRescues(Array.isArray(rescuesRes.data) ? rescuesRes.data : []);
        setDonations(Array.isArray(donationsRes.data) ? donationsRes.data : []);
        setVolunteers(Array.isArray(volunteersRes.data) ? volunteersRes.data : []);
      })
      .catch(() => setError("Failed to load overview data"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [user]);

  // KPI metrics
  const kpis = useMemo(() => {
    const petCount = pets.length;
    const rescueCount = rescues.length;
    const adoptedCount = pets.filter((p) => p?.petStatus === "Adopted").length;
    const availableCount = pets.filter((p) => p?.petStatus === "Available").length;
    const volunteerCount = volunteers.length;
    const totalDonations = donations.reduce((sum, d) => sum + (Number(d?.amount) || 0), 0);

    return { petCount, rescueCount, adoptedCount, availableCount, volunteerCount, totalDonations };
  }, [pets, rescues, donations, volunteers]);

  // Pie: species distribution (Dog/Cat)
  const speciesPie = useMemo(() => {
    const dogs = pets.filter((p) => p?.petSpecies === "Dog").length;
    const cats = pets.filter((p) => p?.petSpecies === "Cat").length;
    return {
      labels: ["Dogs", "Cats"],
      datasets: [
        {
          data: [dogs, cats],
          backgroundColor: ["#7b1e3a", "#c94c72"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  }, [pets]);

  // Line: rescues by month (last 6 months)
  const rescuesLine = useMemo(() => {
    const byMonth = new Map();
    const now = new Date();

    const keys = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, 0);
      return key;
    });

    rescues.forEach((r) => {
      const dt = r?.rescuedDate ? new Date(r.rescuedDate) : null;
      if (!dt || Number.isNaN(dt.getTime())) return;
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) || 0) + 1);
    });

    return {
      labels: keys,
      datasets: [
        {
          label: "Rescued Pets",
          data: keys.map((k) => byMonth.get(k) || 0),
          fill: true,
          backgroundColor: "rgba(123, 30, 58, 0.15)",
          borderColor: "#7b1e3a",
          tension: 0.35,
          pointBackgroundColor: "#7b1e3a",
        },
      ],
    };
  }, [rescues]);

  // Bar: donations by month (last 6 months)
  const donationsBar = useMemo(() => {
    const byMonth = new Map();
    const now = new Date();
    const keys = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, 0);
      return key;
    });

    donations.forEach((d) => {
      const dt = d?.createdAt ? new Date(d.createdAt) : null;
      const amt = Number(d?.amount) || 0;
      if (!dt || Number.isNaN(dt.getTime())) return;
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) || 0) + amt);
    });

    return {
      labels: keys,
      datasets: [
        {
          label: "Donations (USD)",
          data: keys.map((k) => byMonth.get(k) || 0),
          backgroundColor: "#c94c72",
          borderRadius: 6,
        },
      ],
    };
  }, [donations]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>A quick snapshot of rescued pets, adoptable pets, donations, and volunteers.</p>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading overview…</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          {/* KPI Cards */}
          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Adoptable Pets</div>
              <div className={styles.kpiValue}>{kpis.petCount}</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Rescued Pets</div>
              <div className={styles.kpiValue}>{kpis.rescueCount}</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Available</div>
              <div className={styles.kpiValue}>{kpis.availableCount}</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Adopted</div>
              <div className={styles.kpiValue}>{kpis.adoptedCount}</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Volunteers</div>
              <div className={styles.kpiValue}>{kpis.volunteerCount}</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Total Donations</div>
              <div className={styles.kpiValue}>${kpis.totalDonations.toLocaleString()}</div>
            </div>
          </section>

          {/* Charts */}
          <section className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Species Distribution</div>
              <Pie data={speciesPie} />
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Rescues (Last 6 Months)</div>
              <Line data={rescuesLine} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Donations by Month</div>
              <Bar data={donationsBar} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Overview;
