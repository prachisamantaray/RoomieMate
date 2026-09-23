import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sleepSchedule, setSleepSchedule] = useState('Flexible');
  const [cleanliness, setCleanliness] = useState('Clean');
  const [smoking, setSmoking] = useState('Non-Smoker');
  const [pets, setPets] = useState('Pet Friendly');
  const [cooking, setCooking] = useState('Sometimes');
  const [guests, setGuests] = useState('Sometimes');
  const [socialPreference, setSocialPreference] = useState('Balanced');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing profile on mount if it exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'roommateProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || currentUser.displayName || '');
          setAge(data.age ? String(data.age) : '');
          setCity(data.city || '');
          setCollege(data.college || '');
          setMinBudget(data.minBudget ? String(data.minBudget) : '');
          setMaxBudget(data.maxBudget ? String(data.maxBudget) : '');
          setSleepSchedule(data.sleepSchedule || 'Flexible');
          setCleanliness(data.cleanliness || 'Clean');
          setSmoking(data.smoking || 'Non-Smoker');
          setPets(data.pets || 'Pet Friendly');
          setCooking(data.cooking || 'Sometimes');
          setGuests(data.guests || 'Sometimes');
          setSocialPreference(data.socialPreference || 'Balanced');
        } else {
          // Pre-fill name from auth if available
          setName(currentUser.displayName || '');
        }
      } catch (err) {
        console.error('Error fetching roommate profile:', err);
        setError('Failed to load existing profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form Validations
    if (!name.trim()) {
      return setError('Please enter your full name.');
    }

    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 100) {
      return setError('Please enter a valid age between 1 and 100.');
    }

    if (!city.trim()) {
      return setError('Please enter your city.');
    }

    if (!college.trim()) {
      return setError('Please enter your college or workplace.');
    }

    const parsedMin = parseInt(minBudget, 10);
    const parsedMax = parseInt(maxBudget, 10);

    if (isNaN(parsedMin) || parsedMin <= 0) {
      return setError('Minimum monthly budget must be greater than ₹0.');
    }

    if (isNaN(parsedMax) || parsedMax <= parsedMin) {
      return setError('Maximum budget must be greater than your minimum budget.');
    }

    try {
      setSaving(true);
      const profileData = {
        name: name.trim(),
        age: parsedAge,
        city: city.trim(),
        college: college.trim(),
        minBudget: parsedMin,
        maxBudget: parsedMax,
        sleepSchedule,
        cleanliness,
        smoking,
        pets,
        cooking,
        guests,
        socialPreference,
        updatedAt: serverTimestamp()
      };

      // Save/Update document in roommateProfiles/{currentUser.uid}
      await setDoc(doc(db, 'roommateProfiles', currentUser.uid), profileData, { merge: true });

      setSuccess('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      if (err.code === 'permission-denied') {
        setError('Firebase Permission Error: Firestore rules are blocking writes to roommateProfiles. Please allow read/write in your Firebase Console Rules tab.');
      } else {
        setError(`Failed to save profile: ${err.message || 'Please check your connection and try again.'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        <div className="profile-header">
          <h1>Lifestyle Profile</h1>
          <p>Set up your roommate preferences to find your ideal living match</p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Information */}
          <div className="form-section">
            <h2 className="form-section-title">👤 Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 22"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={saving}
                  min="16"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bhubaneswar, Bengaluru, Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College / Workplace</label>
                <input
                  id="college"
                  type="text"
                  className="form-input"
                  placeholder="e.g. KIIT University / Tech Park"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Rent Budget (₹) */}
          <div className="form-section">
            <h2 className="form-section-title">💰 Monthly Rent Budget (₹)</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minBudget">Minimum Monthly Budget (₹)</label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id="minBudget"
                    type="number"
                    className="form-input currency-input"
                    placeholder="5000"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    disabled={saving}
                    step="500"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="maxBudget">Maximum Monthly Budget (₹)</label>
                <div className="currency-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id="maxBudget"
                    type="number"
                    className="form-input currency-input"
                    placeholder="15000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    disabled={saving}
                    step="500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle Preferences */}
          <div className="form-section">
            <h2 className="form-section-title">🏡 Lifestyle & Living Habits</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sleepSchedule">Sleep Schedule</label>
                <select
                  id="sleepSchedule"
                  className="select-input"
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value)}
                  disabled={saving}
                >
                  <option value="Early Bird">Early Bird</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Night Owl">Night Owl</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cleanliness">Cleanliness Standard</label>
                <select
                  id="cleanliness"
                  className="select-input"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value)}
                  disabled={saving}
                >
                  <option value="Very Clean">Very Clean</option>
                  <option value="Clean">Clean</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Relaxed">Relaxed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="smoking">Smoking Preference</label>
                <select
                  id="smoking"
                  className="select-input"
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  disabled={saving}
                >
                  <option value="Non-Smoker">Non-Smoker</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pets">Pet Preference</label>
                <select
                  id="pets"
                  className="select-input"
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  disabled={saving}
                >
                  <option value="Pet Friendly">Pet Friendly</option>
                  <option value="No Pets">No Pets</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cooking">Cooking Habit</label>
                <select
                  id="cooking"
                  className="select-input"
                  value={cooking}
                  onChange={(e) => setCooking(e.target.value)}
                  disabled={saving}
                >
                  <option value="Cooks Often">Cooks Often</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Rarely">Rarely</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Overnight Guests</label>
                <select
                  id="guests"
                  className="select-input"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  disabled={saving}
                >
                  <option value="Frequently">Frequently</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Rarely">Rarely</option>
                </select>
              </div>
            </div>

            <div className="form-group-full">
              <label htmlFor="socialPreference">Social Preference</label>
              <select
                id="socialPreference"
                className="select-input"
                value={socialPreference}
                onChange={(e) => setSocialPreference(e.target.value)}
                disabled={saving}
              >
                <option value="Very Social">Very Social</option>
                <option value="Social">Social</option>
                <option value="Balanced">Balanced</option>
                <option value="Quiet">Quiet</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary profile-submit-btn"
            disabled={saving}
          >
            {saving ? 'Saving Profile...' : 'Save Profile'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Profile;
