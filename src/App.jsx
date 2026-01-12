import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import logo from "./assets/images.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <img
        src={logo}
        alt="Murraysburg Primary School Logo"
        style={{ width: "220px", marginBottom: "20px" }}
      />

      <h1 style={titleStyle}>Murraysburg Primary School</h1>

      <button style={buttonStyle} onClick={() => navigate("/admin")}>
        Go to Admin Dashboard
      </button>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={adminContainer}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      <div style={cardGrid}>
        <div style={card}>Teachers</div>
        <div style={card}>Subjects</div>
        <div style={card}>Classes</div>
        <div style={card}>Splits</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

/* ---------- STYLES ---------- */

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  textAlign: "center",
};

const adminContainer = {
  padding: "40px",
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
};

const titleStyle = {
  fontSize: "2.5rem",
  color: "#1e3a8a",
  marginBottom: "30px",
};

const buttonStyle = {
  padding: "12px 28px",
  fontSize: "1rem",
  border: "2px solid #1e3a8a",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#1e3a8a",
  cursor: "pointer",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const card = {
  padding: "30px",
  background: "white",
  border: "2px solid #1e3a8a",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "600",
};
