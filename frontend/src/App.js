import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Home from "./pages/Home.js";
import MedicalRecords from "./pages/MedicalRecords.js";
import PetAdoption from "./pages/PetAdoption.js";
import Login from "./pages/Login.js";
import PetListing from "./pages/Admin/PetListing.js";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import Footer from "./components/Footer.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import AppointmentScheduling from './pages/AppointmentScheduling.js';
import Register from "./pages/Register.js";
import RescuedPet from "./pages/RescuedPet.js";
import PetShop from "./pages/User.js";
import User from "./pages/Login.js"

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarWithAuth />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<AppointmentScheduling />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/pet-profiles" element={<PetListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rescued-pet" element={<RescuedPet />} />
          <Route path="/products" element={<PetShop />} />
          <Route path="/user" element={<User />} />
          <Route
            path="/admin/pet-listing"
            element={
              <ProtectedRoute requiredRole="admin">
                <PetListing />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

const NavbarWithAuth = () => {
  const { isLoggedIn, logout } = useAuth();
  return <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />;
};

export default App;
