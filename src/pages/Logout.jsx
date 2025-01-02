import React, { useEffect, useState } from "react";
import { logoutUser } from "../services/api";
import { redirect } from "react-router-dom";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const result = await logoutUser();

    if (result) {
      // Redirect to the login page after successful logout
      window.location.href = "/login";
    } else {
      // Handle error if logout fails
      alert("Logout failed, please try again.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={styles.logoutButton}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

const styles = {
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    alignSelf: "center",
    marginTop: "20px",
  },
};

export default Logout;
