import React from "react";

function ProfileCard({ name, role, image, skills }) {
  return (
    <div className="profile-card" style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <h2>{name}</h2>
      <p>{role}</p>
      <button style={styles.button}>Follow</button>
      <div style={styles.skills}>
        {skills.map((skill, index) => (
          <span key={index} style={styles.skill}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "20px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    justifyContent: "center",
  },
  skill: {
    border: "1px solid #000",
    borderRadius: "8px",
    padding: "4px 8px",
    fontSize: "12px",
  },
};

export default ProfileCard;
