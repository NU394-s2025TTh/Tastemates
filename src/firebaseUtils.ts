import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';

export interface Restaurant {
  restaurantName: string;
  rating: number;
  reviewSrc: string;
  cuisine: string;
  price: string;
}

/**
 * Toggles a restaurant in the user's wishlist.
 * Saves full restaurant info if adding.
 */
export const toggleWishlist = async (restaurant: Restaurant): Promise<boolean> => {
  const user = getAuth().currentUser;
  if (!user) return false;

  const db = getDatabase();
  const wishlistRef = ref(db, `wishlists/${user.uid}/${restaurant.restaurantName}`);

  try {
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
      await remove(wishlistRef);
      return false;
    } else {
      await set(wishlistRef, restaurant);
      return true;
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return false;
  }
};

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
