import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;
const API_KEY =
  'K2I23-hV2tLghIZwEP15o6ymQSsHyupVgK6zrSQFaER_iNN-k7moVRNwBiYvpkulLfptuAOuU48Wn8NpI3KlrmKouJbvGMdP7eWQFAIsULQn23EXSYZltbH8Lqb1Z3Yx';

app.use(cors());
app.use(express.json());

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  '/Users/caelbaumgarten/Desktop/taste-mates-agile-firebase-adminsdk-fbsvc-43f020217c.json';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// let count = 0; // We use this to create new ids for each user in the db

//
//   ENDPOINTS
//

// Fetches data from the yelp api, must be done in the backend for security purposes
app.get('/api/restaurants', async (req, res) => {
  const { lat, lng, term, radius } = req.query;

  if (!lat || !lng || !term || !radius) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameters: lat, lng, and term' });
  }
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&radius=${radius}&limit=20`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.businesses) {
      // Only retrieve the data we need from the restaurants
      const restaurants = data.businesses.map((restaurant) => ({
        name: restaurant.name,
        rating: restaurant.rating,
        address: restaurant.location.display_address.join(', '),
        categories: restaurant.categories.map((c) => c.title),
        image_url: restaurant.image_url,
        url: restaurant.url,
      }));
      res.json(restaurants);
    } else {
      res.status(400).json({ error: data.error_message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adds a user to the firebase db when a profile is finished
app.post('/api/create-user', async (req, res) => {
  const { username, minPrice, maxPrice, prefs, bio, uid } = req.body;

  // Make sure request is complete
  if (!username || !minPrice || !maxPrice || !prefs || !bio) {
    return res.status(400).json({ error: 'Missing required body parameters' });
  }

  try {
    await db.collection('users').doc(String(uid)).set(
      {
        username: username,
        minPrice: minPrice,
        maxPrice: maxPrice,
        prefs: prefs,
        bio: bio,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Not sure if we'll need this but just in case
      },
      { merge: true },
    );
    res.status(200).json({ message: 'Profile saved successfully!' });
    // count = count + 1; // Increment count for the next user's id
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
