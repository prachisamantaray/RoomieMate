import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { calculateCompatibility } from '../utils/compatibility';
import ProfileModal from '../components/ProfileModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Data states
  const [userProfile, setUserProfile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [requestsMap, setRequestsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingRequestId, setSendingRequestId] = useState(null);
  
  // UI states
  const [expandedWhyMatch, setExpandedWhyMatch] = useState({});
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Filter states
  const [filterCity, setFilterCity] = useState('Any');
  const [filterMaxBudget, setFilterMaxBudget] = useState('');
  const [filterSmoking, setFilterSmoking] = useState('Any');
  const [filterPets, setFilterPets] = useState('Any');
  const [sortBy, setSortBy] = useState('best');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        setError('');

        // 1. Fetch current user profile
        const myDocRef = doc(db, 'roommateProfiles', currentUser.uid);
        const myDocSnap = await getDoc(myDocRef);

        if (!myDocSnap.exists()) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        const myProfileData = myDocSnap.data();
        setUserProfile(myProfileData);

        // 2. Safely fetch existing requests for currentUser
        const reqMap = {};
        try {
          const sentQuery = query(collection(db, 'roommateRequests'), where('senderId', '==', currentUser.uid));
          const receivedQuery = query(collection(db, 'roommateRequests'), where('receiverId', '==', currentUser.uid));
          
          const [sentSnap, receivedSnap] = await Promise.all([
            getDocs(sentQuery),
            getDocs(receivedQuery)
          ]);

          sentSnap.forEach((docSnap) => {
            const data = docSnap.data();
            reqMap[data.receiverId] = data.status;
          });
          receivedSnap.forEach((docSnap) => {
            const data = docSnap.data();
            reqMap[data.senderId] = data.status;
          });
        } catch (reqErr) {
          console.warn('Could not load existing requests (checking security rules):', reqErr);
        }
        setRequestsMap(reqMap);

        // 3. Fetch all candidate profiles from roommateProfiles
        const querySnapshot = await getDocs(collection(db, 'roommateProfiles'));
        const rawCandidates = [];

        querySnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentUser.uid) {
            rawCandidates.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          }
        });

        // 4. Calculate compatibility for each candidate
        const calculatedCandidates = rawCandidates.map((candidate) => {
          const { overallScore, breakdown } = calculateCompatibility(myProfileData, candidate);

          let compatibilityText = 'Low lifestyle compatibility';
          if (overallScore >= 80) compatibilityText = 'High lifestyle compatibility';
          else if (overallScore >= 60) compatibilityText = 'Good lifestyle compatibility';
          else if (overallScore >= 40) compatibilityText = 'Moderate lifestyle compatibility';

          return {
            ...candidate,
            overallScore,
            breakdown,
            compatibilityText
          };
        });

        setCandidates(calculatedCandidates);
      } catch (err) {
        console.error('Error loading matches:', err);
        if (err.code === 'permission-denied') {
          setError('Firebase Permission Error: Please update your Firestore Security Rules in Firebase Console to allow reading roommateProfiles and roommateRequests.');
        } else {
          setError(`We couldn't load roommate matches right now (${err.message || 'Error'}). Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle sending a roommate request
  const handleSendRequest = async (targetUserId) => {
    if (!currentUser?.uid || sendingRequestId) return;

    try {
      setSendingRequestId(targetUserId);
      await addDoc(collection(db, 'roommateRequests'), {
        senderId: currentUser.uid,
        receiverId: targetUserId,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setRequestsMap((prev) => ({
        ...prev,
        [targetUserId]: 'pending'
      }));
    } catch (err) {
      console.error('Failed to send request:', err);
      if (err.code === 'permission-denied') {
        alert('Firebase Permission Error: Please update your Firestore Security Rules for roommateRequests.');
      } else {
        alert('Failed to send roommate request. Please try again.');
      }
    } finally {
      setSendingRequestId(null);
    }
  };

  // Toggle "Why this match?" breakdown
  const toggleWhyMatch = (id) => {
    setExpandedWhyMatch((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reset filters
  const handleClearFilters = () => {
    setFilterCity('Any');
    setFilterMaxBudget('');
    setFilterSmoking('Any');
    setFilterPets('Any');
    setSortBy('best');
  };

  const uniqueCities = ['Any', ...new Set(candidates.map((c) => c.city).filter(Boolean))];

  // Apply filters
  const filteredCandidates = candidates.filter((c) => {
    if (filterCity !== 'Any' && c.city?.toLowerCase() !== filterCity.toLowerCase()) {
      return false;
    }
    if (filterMaxBudget && c.minBudget) {
      const maxFilterVal = parseInt(filterMaxBudget, 10);
      if (!isNaN(maxFilterVal) && c.minBudget > maxFilterVal) {
        return false;
      }
    }
    if (filterSmoking !== 'Any' && c.smoking !== filterSmoking) {
      return false;
    }
    if (filterPets !== 'Any' && c.pets !== filterPets) {
      return false;
    }
    return true;
  });

  // Apply sorting
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'lowestBudget') {
      return (a.minBudget || 0) - (b.minBudget || 0);
    }
    return b.overallScore - a.overallScore;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Finding compatible roommates...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-empty">
          <h2>Complete your profile first</h2>
          <p>Please create your lifestyle profile to discover compatible roommates in your city.</p>
          <Link to="/profile" className="btn btn-primary">
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-empty">
          <p style={{ color: '#991b1b', fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container container">
      
      <div className="dashboard-header">
        <h1>Find Your Roommate Match</h1>
        <p>Discover people whose lifestyle preferences are compatible with yours.</p>
      </div>

      {candidates.length > 0 && (
        <div className="filter-bar">
          <div className="filters-left">
            <div className="filter-group">
              <label htmlFor="filterCity">City</label>
              <select
                id="filterCity"
                className="filter-control"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterMaxBudget">Max Budget (₹)</label>
              <input
                id="filterMaxBudget"
                type="number"
                className="filter-control"
                placeholder="e.g. 15000"
                value={filterMaxBudget}
                onChange={(e) => setFilterMaxBudget(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filterSmoking">Smoking</label>
              <select
                id="filterSmoking"
                className="filter-control"
                value={filterSmoking}
                onChange={(e) => setFilterSmoking(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="Non-Smoker">Non-Smoker</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterPets">Pets</label>
              <select
                id="filterPets"
                className="filter-control"
                value={filterPets}
                onChange={(e) => setFilterPets(e.target.value)}
              >
                <option value="Any">Any</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="No Pets">No Pets</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="filter-right">
            <div className="filter-group">
              <label htmlFor="sortBy">Sort by</label>
              <select
                id="sortBy"
                className="filter-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="best">Best Match</option>
                <option value="highestMatch">Highest Match</option>
                <option value="lowestBudget">Lowest Budget</option>
              </select>
            </div>

            {(filterCity !== 'Any' || filterMaxBudget || filterSmoking !== 'Any' || filterPets !== 'Any') && (
              <button onClick={handleClearFilters} className="btn btn-secondary clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="dashboard-empty">
          <h2>No roommate matches available yet.</h2>
          <p>As more people join RoomieMatch, compatible profiles will appear here.</p>
        </div>
      ) : sortedCandidates.length === 0 ? (
        <div className="dashboard-empty">
          <h2>No matches found with these filters.</h2>
          <p>Try adjusting your search criteria or clear filters to see all available roommates.</p>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {sortedCandidates.map((candidate) => {
            const reqStatus = requestsMap[candidate.id];

            return (
              <div key={candidate.id} className="match-card">
                
                <div className="match-card-header">
                  <div className="match-user-title">
                    <h2>{candidate.name}, {candidate.age}</h2>
                    <p className="match-user-location">📍 {candidate.city} • {candidate.college}</p>
                  </div>
                  <div className="match-score-badge">
                    {candidate.overallScore}% Match
                  </div>
                </div>

                <div className="match-compatibility-tag">
                  {candidate.compatibilityText}
                </div>

                <div className="match-budget-box">
                  Budget: <strong>₹{candidate.minBudget?.toLocaleString('en-IN')} – ₹{candidate.maxBudget?.toLocaleString('en-IN')}</strong> / month
                </div>

                <div className="match-tags-list">
                  {candidate.sleepSchedule && <span className="match-tag">🌙 {candidate.sleepSchedule}</span>}
                  {candidate.cleanliness && <span className="match-tag">✨ {candidate.cleanliness}</span>}
                  {candidate.smoking && <span className="match-tag">🚭 {candidate.smoking}</span>}
                  {candidate.pets && <span className="match-tag">🐾 {candidate.pets}</span>}
                </div>

                <button className="why-match-btn" onClick={() => toggleWhyMatch(candidate.id)}>
                  {expandedWhyMatch[candidate.id] ? '▲ Hide breakdown' : '▼ Why this match?'}
                </button>

                {expandedWhyMatch[candidate.id] && (
                  <div className="breakdown-box">
                    <div className="breakdown-item">
                      <span>✓ Budget</span>
                      <strong>{candidate.breakdown?.budget}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Sleep schedule</span>
                      <strong>{candidate.breakdown?.sleepSchedule}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Cleanliness</span>
                      <strong>{candidate.breakdown?.cleanliness}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Smoking</span>
                      <strong>{candidate.breakdown?.smoking}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Pets</span>
                      <strong>{candidate.breakdown?.pets}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Cooking</span>
                      <strong>{candidate.breakdown?.cooking}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Guests</span>
                      <strong>{candidate.breakdown?.guests}%</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>✓ Social preference</span>
                      <strong>{candidate.breakdown?.socialPreference}%</strong>
                    </div>
                  </div>
                )}

                <div className="match-card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedProfile(candidate)}
                  >
                    View Profile
                  </button>
                  
                  {reqStatus === 'pending' ? (
                    <button className="btn btn-secondary" disabled>
                      Request Sent
                    </button>
                  ) : reqStatus === 'accepted' ? (
                    <button className="btn btn-outline" disabled>
                      Connected
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSendRequest(candidate.id)}
                      disabled={sendingRequestId === candidate.id}
                    >
                      {sendingRequestId === candidate.id ? 'Sending...' : 'Send Request'}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
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

export default Dashboard;
