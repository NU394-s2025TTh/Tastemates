import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';
// const express = require('express');
// // const cors = require('cors')
// const fetch = require('node-fetch');
const app = express();
const PORT = 5000;
const API_KEY =
  'K2I23-hV2tLghIZwEP15o6ymQSsHyupVgK6zrSQFaER_iNN-k7moVRNwBiYvpkulLfptuAOuU48Wn8NpI3KlrmKouJbvGMdP7eWQFAIsULQn23EXSYZltbH8Lqb1Z3Yx';

app.use(cors());
// Fetches data from the google map api, must be done in the backend for security purposes
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
