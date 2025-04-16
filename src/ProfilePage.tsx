import './ProfilePage.css';

import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Info } from 'lucide-react';
// import editIcon from './assets/edit.svg';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { useNavigate } from 'react-router-dom';

import Card from './components/Card';
import EditPreferencesModal from './components/EditPreferencesModal';
import Navbar from './components/Navbar';
import TastemateModal from './components/TastemateModal';
import { auth, db, get, ref, set } from './firebase';
import { Restaurant } from './firebaseUtils';

const MIN = 0;
const MAX = 100;
const STEP = 1;

const ProfilePage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [userName, setUserName] = useState<string>('User');
  const [wishlist, setWishlist] = useState<Restaurant[]>([]);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [tastemates, setTastemates] = useState<any[]>([]);
  const [selectedTastemate, setSelectedTastemate] = useState<any>(null);
  const [number, setNumber] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePriceChange = async (values: [number, number]) => {
    setPriceRange(values);
    const user = auth.currentUser;
    if (!user) return;

    const userPrefRef = ref(db, `users/${user.uid}/preferences`);
    try {
      await set(userPrefRef, {
        ...preferences,
        minPrice: values[0],
        maxPrice: values[1],
      });
      setPreferences((prev: any) => ({
        ...prev,
        minPrice: values[0],
        maxPrice: values[1],
      }));
    } catch (error) {
      console.error('Error updating price preferences:', error);
    }
  };

  const handleEdit = async () => {
    setShowEditModal(true);
  };

  //add profile picture functionality
  const handlePhotoUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64String = e.target?.result as string;
      const user = auth.currentUser; //understand this instance auth
      if (!user) return;

      const userPrefRef = ref(db, `users/${user.uid}/preferences`);
      try {
        await set(userPrefRef, {
          ...preferences,
          photoURL: base64String,
        });

        setPhotoURL(base64String);
        setPreferences((prev: any) => ({ ...prev, photoURL: base64String }));
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const changedUser = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      const fetchData = async () => {
        setUserName(user.displayName || 'User');

        const prefSnap = await get(ref(db, `users/${user.uid}/preferences`));
        if (prefSnap.exists()) {
          const prefs = prefSnap.val();
          setPreferences(prefs);
          setNumber(prefs.phoneNumber);
          setPriceRange([prefs.minPrice || 0, prefs.maxPrice || 100]);
          setPhotoURL(prefs.photoURL || user.photoURL || '/assets/profile.svg');
        }

        const wishlistSnap = await get(ref(db, `wishlists/${user.uid}`));
        if (wishlistSnap.exists()) {
          const data = wishlistSnap.val();
          setWishlist(Object.values(data));
        }
      };

      const fetchTastemates = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
          const tastemateSnap = await get(ref(db, 'tastemateRequests'));
          if (!tastemateSnap.exists()) return;

          const requests = tastemateSnap.val();
          const tastemateIds = new Set<string>();

          for (const otherUserId in requests) {
            const nestedRequests = requests[otherUserId];

            for (const nestedUserId in nestedRequests) {
              const request = nestedRequests[nestedUserId];

              const isAccepted = request.status === 'accepted';
              const involvesCurrentUser =
                otherUserId === user.uid || nestedUserId === user.uid;

              if (isAccepted && involvesCurrentUser) {
                const tastemateId = otherUserId === user.uid ? nestedUserId : otherUserId;
                tastemateIds.add(tastemateId);
              }
            }
          }

          const tastematePromises = Array.from(tastemateIds).map(async (uid) => {
            const prefsSnap = await get(ref(db, `users/${uid}/preferences`));
            const prefs = prefsSnap.exists() ? prefsSnap.val() : {};
            return {
              uid,
              ...prefs,
            };
          });

          const tastemateData = await Promise.all(tastematePromises);
          setTastemates(tastemateData);
        } catch (error) {
          console.error('Error fetching tastemates:', error);
        }
      };

      fetchData();
      fetchTastemates();
    });
    return () => changedUser();
  }, []);

  if (!preferences) return <div>Loading preferences...</div>;

  return (
    <div className="Profile">
      <Navbar />
      <div className="profile-container">
        <div className="pic-container">
          <img
            className="user-pic"
            src={photoURL || '/assets/profile.svg'}
            alt="your user profile"
          />
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>
        <div className="name-row">
          <h2 className="user-name">{userName}</h2>
        </div>
        {number && <p className="phone-number">Phone: {number}</p>}

        <div className="pref-card">
          <div className="pref-card-edit">
            <p className="pref-card-title">Your Favorite Cuisines</p>
            <Edit
              className="edit-icon-button"
              size={20}
              role="button"
              tabIndex={0}
              onClick={() => handleEdit()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleEdit();
                }
              }}
              aria-label="Edit profile"
            />
          </div>
          <div className="cuisine-box">
            {preferences.cuisines?.length ? (
              preferences.cuisines.map((cuisine: string) => (
                <p className="cuisine-tag" key={cuisine}>
                  {cuisine}
                </p>
              ))
            ) : (
              <p>No cuisines selected.</p>
            )}
          </div>
        </div>

        <div className="pref-card">
          <p className="pref-card-title">Your Price Range</p>
          <div className="slider-wrapper">
            <p className="price-text">
              ${priceRange[0]} — {priceRange[1] === MAX ? `${MAX}+` : `$${priceRange[1]}`}
            </p>
            <Range
              step={STEP}
              min={MIN}
              max={MAX}
              values={priceRange}
              onChange={(values) => setPriceRange(values as [number, number])}
              onFinalChange={(values) => handlePriceChange(values as [number, number])}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '6px',
                    width: '96%',
                    background: '#ccc',
                    borderRadius: '3px',
                    marginTop: '10px',
                    marginLeft: '2%',
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '15px',
                    width: '15px',
                    backgroundColor: '#98897e',
                    border: '3px solid white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                />
              )}
            />
          </div>
        </div>

        <div>
          <h2>Your Tastemates</h2>
          <div
            className={
              tastemates.length > 0 ? 'tastemates-container' : 'tastemates-empty'
            }
          >
            {tastemates.length > 0 ? (
              tastemates.map((mate) => (
                <div className="tastemate-box" key={mate.uid}>
                  <img
                    className="tastemate-pic"
                    src={mate.photoURL}
                    alt={mate.displayName}
                  />
                  <div className="tastemate-name">{mate.displayName || 'User'}</div>
                  <Info
                    className="view-details-button"
                    size={20}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTastemate(mate)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedTastemate(mate);
                      }
                    }}
                    aria-label={`View info for ${mate.displayName}`}
                  />
                </div>
              ))
            ) : (
              <p className="no-tastemates">No tastemates found yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2>Your Wishlist</h2>
          <div className={wishlist.length > 0 ? 'wishlist' : 'tastemates-empty'}>
            {wishlist.length > 0 ? (
              wishlist.map((restaurant) => (
                <Card
                  key={restaurant.restaurantName}
                  isFeed={false}
                  {...restaurant}
                  userId=""
                />
              ))
            ) : (
              <p className="no-tastemates">No wishlisted restaurants yet.</p>
            )}
          </div>
        </div>

        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
        {showEditModal && (
          <EditPreferencesModal
            existingPrefs={preferences}
            onClose={() => setShowEditModal(false)}
            setPreferences={setPreferences}
          />
        )}
        {selectedTastemate && (
          <TastemateModal
            tastemate={selectedTastemate}
            onClose={() => setSelectedTastemate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
