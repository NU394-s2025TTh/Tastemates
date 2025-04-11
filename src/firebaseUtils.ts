import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';

/**
 * Toggles a restaurant in the user's wishlist.
 * Adds it if not present, removes it if already wishlisted.
 * Returns the updated wishlist status (true = added, false = removed).
 */
export const toggleWishlist = async (restaurantName: string): Promise<boolean> => {
  const user = getAuth().currentUser;
  if (!user) return false; // Always return a boolean

  const db = getDatabase();
  const wishlistRef = ref(db, `wishlists/${user.uid}/${restaurantName}`);

  try {
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
      await remove(wishlistRef);
      return false;
    } else {
      await set(wishlistRef, true);
      return true;
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return false;
  }
};

/**
 * Checks whether the restaurant is already in the user's wishlist.
 */
export const isRestaurantWishlisted = async (
  restaurantName: string,
): Promise<boolean> => {
  const user = getAuth().currentUser;
  if (!user) return false;

  const db = getDatabase();
  const wishlistRef = ref(db, `wishlists/${user.uid}/${restaurantName}`);

  try {
    const snapshot = await get(wishlistRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
};
