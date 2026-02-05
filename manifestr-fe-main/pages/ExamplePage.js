import React, { useState } from "react";
import ModalCard from "../components/modal-card/ModalCard";
import { FaUsers } from "react-icons/fa";

export default function TeamPage() {
  const [showModal, setShowModal] = useState(false);

  const modalData = {
    icon: <FaUsers />,
    title: "Bring Your Team",
    description: "Invite teammates anytime. Permissions are flexible.",
    buttonText: "Invite now",
    showButton: true
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => setShowModal(true)}>
        Open Team Modal
      </button>
      <ModalCard
        {...modalData}
        isOpen={showModal}     // <-- FIX
        onClose={() => setShowModal(false)}
      />
        <h1>Team Page</h1>
  <p>Welcome to the team management page.</p>
    </div>
    
  );
}
