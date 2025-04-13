import './InvitationsPage.css';

import React from 'react';

import Navbar from './Navbar';

interface InvitationsPageProps {
  onBack: () => void;
}

const InvitationsPage: React.FC<InvitationsPageProps> = ({ onBack }) => {
  return (
    <div className="invitations-page">
      <Navbar />
      <button className="back-button" onClick={onBack}>
        &lt;
      </button>
      <h2>Received Tastemate Requests</h2>
      <p>(Placeholder for received requests)</p>
      <h2>Sent / Pending Requests</h2>
      <p>(Placeholder for sent requests)</p>
    </div>
  );
};

export default InvitationsPage;
