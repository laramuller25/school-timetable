export default function Modal({ title, children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "15px" }}>{title}</h2>
        {children}
        <button style={closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "360px",
};

const closeBtn = {
  marginTop: "15px",
};
