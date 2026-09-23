import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { calculateCompatibility } from '../utils/compatibility';
import ProfileModal from '../components/ProfileModal';
import '../styles/Requests.css';

const Requests = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch received & sent requests
  const fetchRequests = async () => {
    if (!currentUser?.uid) return;

    try {
      setLoading(true);
      setError('');

      // 1. Fetch current user's profile for compatibility calculations
      const myDocRef = doc(db, 'roommateProfiles', currentUser.uid);
      const myDocSnap = await getDoc(myDocRef);
      const myProfile = myDocSnap.exists() ? myDocSnap.data() : null;

      // 2. Fetch Received Requests
      const receivedQuery = query(
        collection(db, 'roommateRequests'),
        where('receiverId', '==', currentUser.uid)
      );
      const receivedSnap = await getDocs(receivedQuery);
      
      const receivedData = await Promise.all(
        receivedSnap.docs.map(async (docSnap) => {
          const reqData = { id: docSnap.id, ...docSnap.data() };
          
          // Fetch sender's roommate profile
          let senderProfile = null;
          let compatibilityScore = null;

          try {
            const senderDocRef = doc(db, 'roommateProfiles', reqData.senderId);
            const senderSnap = await getDoc(senderDocRef);
            if (senderSnap.exists()) {
              senderProfile = { id: senderSnap.id, ...senderSnap.data() };
              if (myProfile) {
                const comp = calculateCompatibility(myProfile, senderProfile);
                compatibilityScore = comp.overallScore;
              }
            }
          } catch (e) {
            console.error('Error fetching sender profile:', e);
          }

          return {
            ...reqData,
            profile: senderProfile,
            compatibilityScore
          };
        })
      );

      // 3. Fetch Sent Requests
      const sentQuery = query(
        collection(db, 'roommateRequests'),
        where('senderId', '==', currentUser.uid)
      );
      const sentSnap = await getDocs(sentQuery);

      const sentData = await Promise.all(
        sentSnap.docs.map(async (docSnap) => {
          const reqData = { id: docSnap.id, ...docSnap.data() };
          
          // Fetch receiver's roommate profile
          let receiverProfile = null;
          let compatibilityScore = null;

          try {
            const receiverDocRef = doc(db, 'roommateProfiles', reqData.receiverId);
            const receiverSnap = await getDoc(receiverDocRef);
            if (receiverSnap.exists()) {
              receiverProfile = { id: receiverSnap.id, ...receiverSnap.data() };
              if (myProfile) {
                const comp = calculateCompatibility(myProfile, receiverProfile);
                compatibilityScore = comp.overallScore;
              }
            }
          } catch (e) {
            console.error('Error fetching receiver profile:', e);
          }

          return {
            ...reqData,
            profile: receiverProfile,
            compatibilityScore
          };
        })
      );

      setReceivedRequests(receivedData);
      setSentRequests(sentData);
    } catch (err) {
      console.error('Error fetching requests:', err);
      if (err.code === 'permission-denied') {
        setError('Firebase Permission Error: Please update your Firestore Security Rules in Firebase Console to allow reading roommateRequests.');
      } else {
        setError(`We couldn't load your requests right now (${err.message || 'Error'}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser]);

  // Handle Accept / Reject request updates
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      setUpdatingId(requestId);
      const requestRef = doc(db, 'roommateRequests', requestId);
      await updateDoc(requestRef, {
        status: newStatus
      });

      // Update local state instantly
      setReceivedRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      console.error(`Failed to update request to ${newStatus}:`, err);
      alert(`Failed to update request status. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading roommate requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-container container">
        <div className="requests-empty">
          <p style={{ color: '#991b1b', fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-container container">
      
      {/* Header */}
      <div className="requests-header">
        <h1>Roommate Requests</h1>
        <p>Manage incoming invitations and track requests you have sent.</p>
      </div>

      {/* Tabs */}
      <div className="requests-tabs">
        <button
          className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received Requests
          {receivedRequests.length > 0 && (
            <span className="tab-count-badge">{receivedRequests.length}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests
          {sentRequests.length > 0 && (
            <span className="tab-count-badge">{sentRequests.length}</span>
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'received' ? (
        receivedRequests.length === 0 ? (
          <div className="requests-empty">
            <h3>No roommate requests yet.</h3>
            <p>Incoming roommate requests from other users will appear here.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {receivedRequests.map((req) => {
              const p = req.profile || {};
              return (
                <div key={req.id} className="request-card">
                  
                  <div className="request-card-header">
                    <div className="request-user-info">
                      <h3>{p.name || 'Roommate Candidate'}{p.age ? `, ${p.age}` : ''}</h3>
                      <p>📍 {p.city || 'Location unavailable'} • {p.college || 'Institution'}</p>
                    </div>
                    
                    <span className={`status-badge status-${req.status}`}>
                      {req.status}
                    </span>
                  </div>

                  {req.compatibilityScore !== null && (
                    <div className="request-meta-box">
                      <span>Lifestyle Compatibility</span>
                      <strong>{req.compatibilityScore}% Match</strong>
                    </div>
                  )}

                  <div className="request-actions">
                    {p.name && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedProfile(p)}
                      >
                        View Profile
                      </button>
                    )}

                    {req.status === 'pending' ? (
                      <>
                        <button
                          className="btn btn-accept"
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          disabled={updatingId === req.id}
                        >
                          {updatingId === req.id ? 'Updating...' : 'Accept'}
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          disabled={updatingId === req.id}
                        >
                          Reject
                        </button>
                      </>
                    ) : req.status === 'accepted' ? (
                      <button className="btn btn-outline" disabled>
                        Connected
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        Rejected
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Sent Requests Tab */
        sentRequests.length === 0 ? (
          <div className="requests-empty">
            <h3>You haven't sent any roommate requests yet.</h3>
            <p>Browse the Match Dashboard to find compatible roommates and send requests.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {sentRequests.map((req) => {
              const p = req.profile || {};
              return (
                <div key={req.id} className="request-card">
                  
                  <div className="request-card-header">
                    <div className="request-user-info">
                      <h3>{p.name || 'Roommate Candidate'}</h3>
                      <p>📍 {p.city || 'Location unavailable'}</p>
                    </div>
                    
                    <span className={`status-badge status-${req.status}`}>
                      {req.status}
                    </span>
                  </div>

                  {req.compatibilityScore !== null && (
                    <div className="request-meta-box">
                      <span>Lifestyle Compatibility</span>
                      <strong>{req.compatibilityScore}% Match</strong>
                    </div>
                  )}

                  <div className="request-actions">
                    {p.name && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setSelectedProfile(p)}
                      >
                        View Profile
                      </button>
                    )}
                    
                    <button className="btn btn-secondary" disabled>
                      Status: {req.status}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )
      )}

      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

    </div>
  );
};

export default Requests;
