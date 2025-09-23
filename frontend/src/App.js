import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MedicalRecords from "./pages/MedicalRecords";
import PetAdoption from "./pages/PetAdoption";
import Login from "./pages/Login";
import PetListing from "./pages/Admin/PetListing";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AppointmentScheduling from './pages/AppointmentScheduling';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/appointment' element={<AppointmentScheduling />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/pet-adoption" element={<PetAdoption />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/pet-listing"
            element={
              <ProtectedRoute requiredRole="admin">
                <PetListing />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Footer goes after Routes */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
