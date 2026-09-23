import React from 'react';

const ProfileModal = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <h2>{profile.name}, {profile.age}</h2>
          <p>📍 {profile.city} • {profile.college}</p>
        </div>

        <div className="modal-detail-grid">
          <div className="modal-detail-item">
            <label>Monthly Budget</label>
            <p>₹{profile.minBudget?.toLocaleString('en-IN')} – ₹{profile.maxBudget?.toLocaleString('en-IN')}</p>
          </div>

          <div className="modal-detail-item">
            <label>Sleep Schedule</label>
            <p>🌙 {profile.sleepSchedule}</p>
          </div>

          <div className="modal-detail-item">
            <label>Cleanliness</label>
            <p>✨ {profile.cleanliness}</p>
          </div>

          <div className="modal-detail-item">
            <label>Smoking</label>
            <p>🚭 {profile.smoking}</p>
          </div>

          <div className="modal-detail-item">
            <label>Pets</label>
            <p>🐾 {profile.pets}</p>
          </div>

          <div className="modal-detail-item">
            <label>Cooking</label>
            <p>🍳 {profile.cooking}</p>
          </div>

          <div className="modal-detail-item">
            <label>Guests</label>
            <p>👥 {profile.guests}</p>
          </div>

          <div className="modal-detail-item">
            <label>Social Preference</label>
            <p>🛋️ {profile.socialPreference}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
