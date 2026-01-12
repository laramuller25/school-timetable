import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import { supabase } from "./supabaseClient";

function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("name");

    if (!error) setTeachers(data);
  }

  async function addTeacher() {
    if (!teacherName.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from("teachers")
      .insert({ name: teacherName });

    setLoading(false);

    if (!error) {
      setTeacherName("");
      setShowModal(false);
      fetchTeachers();
    } else {
      alert(error.message);
    }
  }

  return (
    <div style={adminContainer}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      <div style={card}>
        <h2>Teachers</h2>

        <ul>
          {teachers.map(t => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>

        <button style={buttonStyle} onClick={() => setShowModal(true)}>
          Add Teacher
        </button>
      </div>

      {showModal && (
        <Modal title="Add Teacher" onClose={() => setShowModal(false)}>
          <input
            placeholder="Teacher name"
            value={teacherName}
            onChange={e => setTeacherName(e.target.value)}
            style={input}
          />
          <button style={buttonStyle} onClick={addTeacher} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const adminContainer = {
  padding: "40px",
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
};

const titleStyle = {
  fontSize: "2.4rem",
  color: "#1e3a8a",
  marginBottom: "30px",
};

const card = {
  background: "white",
  border: "2px solid #1e3a8a",
  borderRadius: "10px",
  padding: "20px",
  maxWidth: "400px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px 22px",
  border: "2px solid #1e3a8a",
  background: "white",
  color: "#1e3a8a",
  borderRadius: "8px",
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
};

export default AdminDashboard;