// Users.tsx
import {
  endAt,
  get,
  limitToFirst,
  orderByChild,
  query,
  ref,
  startAt,
} from 'firebase/database';
import { useEffect, useState } from 'react';

import { db } from '../firebase';
import TastemateModal from './TastemateModal';
import UserCard from './UserCard';

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  //extend to reuse TastemateModal
  email?: string;
  phoneNumber?: string;
  cuisines?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface UserFeedProps {
  searchQuery: string;
}

const UserFeed: React.FC<UserFeedProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const arr: User[] = [];

        if (searchQuery.trim() === '') {
          /* first 5 users (no filter) */
          const snap = await get(
            query(
              ref(db, 'users'),
              orderByChild('preferences/displayName'),
              //   limitToFirst(5),
            ),
          );
          snap.forEach((c) => {
            const user = mapSnap(c);
            if (user) arr.push(user);
          });
        } else {
          /* ---download 50 ----------------- */
          const snap = await get(
            query(
              ref(db, 'users'),
              orderByChild('preferences/displayName'),
              limitToFirst(50),
            ),
          );
          const term = searchQuery.toLowerCase();
          snap.forEach((c) => {
            const user = mapSnap(c);
            if (user && user.displayName.toLowerCase().startsWith(term)) arr.push(user);
          });
        }

        setUsers(arr);
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  /** helper to convert a DataSnapshot to User */
  const mapSnap = (child: any): User | null => {
    const v = child.val();
    const p = v.preferences ?? {};
    if (!p.displayName) return null; // <-- Ignore invalid entries
    return {
      uid: child.key as string,
      displayName: v.preferences?.displayName,
      photoURL: p.photoURL ?? '/assets/profile.svg',
      email: p.email,
      phoneNumber: p.phoneNumber,
      cuisines: p.cuisines,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
    };
  };

  /* ---------- render ---------- */
  if (loading) {
    return <p style={{ marginTop: '2rem', fontWeight: 600 }}>Loading users…</p>;
  }

  if (users.length === 0) {
    return (
      <p style={{ marginTop: '2rem' }}>
        No users found{searchQuery && ` matching “${searchQuery}”`}
      </p>
    );
  }

  return (
    <div className="user-feed">
      {users.map((u) => (
        // eslint-disable-next-line react/jsx-key
        <UserCard user={u} onOpen={() => setSelected(u)} />
      ))}
      {selected && (
        <TastemateModal
          tastemate={selected}
          onClose={() => {
            setSelected(null);
          }}
          showRequest={true}
        />
      )}
    </div>
  );
};

export default UserFeed;
