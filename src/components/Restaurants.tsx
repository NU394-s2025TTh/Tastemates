import './Card.css';

import { useEffect, useState } from 'react';

import Card from './Card';

interface Restaurant {
  name: string;
  rating: number;
  address: string;
  categories: string;
  image_url: string;
  url: string;
  price: string;
}

const RestaurantFeed = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // const fetchRestaurants = async () => {
    //   const lat = 42.055984;
    //   const lng = -87.675171;
    //   const radius = 10000;
    //   const term = 'restaurant';
    //   try {
    //     const response = await fetch(
    //       `https://restaurants-e5uwjqpdqa-uc.a.run.app/restaurants?lat=${lat}&lng=${lng}&radius=${radius}&term=${term}`,
    //     );
    //     const data = await response.json();
    //     setRestaurants(data);
    //   } catch (err) {
    //     console.error('Failed to fetch restaurants:', err);
    //   } finally {
    //     setIsLoading(false); // Set loading to false after data is fetched or on error
    //   }
    // };
    // fetchRestaurants();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div style={{ fontSize: '2rem', marginTop: '3rem', fontWeight: 'bold' }}>
          Loading restaurants...
        </div>
      ) : (
        restaurants.map((restaurant, index) => (
          <Card
            key={index}
            isFeed={false}
            profileImg={
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxATEBIQERESEA0QEBUQDhAQDxIQFREWFhURExMYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAgEGB//EADQQAAIBAQQHBwMEAwEAAAAAAAABAhEDBCExBRJBUWFxkSJSgaGxwdEUMkITI2LhkqLxgv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9xAAAAAAAAAKdvf4rCPafkBcK9rfILbV8MTMtrxKWbw3ZIiAv2mknsj1dSvK+Wj/KnJJEAA7drJ5yl1ZxUABU6VrJZN9WcgCeN7tF+T8aMnhpF7UnywKIA17K/Qe2j4/JYTMA7sraUcm16dAN0FGw0gnhJU4rIupp4rED0AAAAAAAAAAAAAAAAit7eMVV+C2sjvd6UMM5bt3FmVaTbdW6sCW8XqU+C3L3IAAAAAAAAAAAAAAAAAABLYXiUcstqeREANm7XmM+D2pk5gRbTqsGadzvmt2ZYS8mBcAAAAAAAAAAArXy86iovueXDiyS8WyjGr8OLMa0m223mwPJNt1eLZ4AAAAAAAAAAAAAAAAAAAAAAAAABqXG963Zf3bOP9lwwE6Yo17neNdcVn8gWAAAAAAAp6StqR1VnL0ApXy31pcFgvkgAAAAAAAAAAAksbGUnRL4RoWOj4r7u0+iAy0iRXefdl0ZtRglkkuSodAYju8+7LoRyi1mmuaN88lFPNV5gYANW2uEHl2Xwy6Gfb3eUc1hvWQEQAAAAAAABJYWrjJNePFEYA3oSTSayeJ0Z+jLbOD5r3RoAAAAMS82utJvZs5GnfrSkHveC8THAAAAAAAAAFi6XZze6KzfsiOwsnKSivHgjas4JJJZIBZwSVEqI6AAAAAAAB5KKao8UegDKvl01e0vt9Cob7VcDHvdhqSpseK+AIAAAAAAAAdWc2mmtjqbsJVSa2pMwDU0ZaVjTuvyYFwAAZ2lZ4xjzZQJ79KtpLhReRAAAAAAAAD2MatLe0gNPRtlSOttl6Fw8iqJLcqHoAAAAAAAAAAACvfbLWg96xRYAHz4JLxCkpLi6ciMAAAAAAFvRs6TpvTXiVDuwlSUX/JeoG6AAMK2dZSf8n6nAYAAAAAABNdF248/TEhJrm/3I8/YDaAAAAAAAAAAAAAAABk6RX7j4pMqlrST/c8EVQAAAAAAAANf9cGb+oAImDq1VJNcX6nIAAAAAAOrOVGnuaZyAPoECtcLXWgt6wfsWQAAAAAAAAAAAAEV5tdWLfTmBlXudZyfGnTAhAAAAAAAAAAk1Dw0fpwBSvsaWkudeqIC9pSGKe9U6f8ASiAAAAAAAABPc7fVlweD+TZTPny7cb3Tsyy2Pd/QGmAAAAAAAAAABlaQvGs6LJebJr9e/wAY57X7IzgAAAAAAAAB3YxrKK3tepwWtHQrPkm/YDWAAFbSFnWD3rH5Mg32jDt7PVk47n5bAOAAAAAAAAAABZu18lHDOO7dyNKxvEZZPHc8GYgA+gBiwvU1lJ+OPqSrSM90ejA1QZb0jPdHo/kine7R/lTlgBq2ttGObS9ehnXm/OWEcF5sqNgAAAAAAAAAAABp6Ls6Rct78kZsI1aSzbobtnCiSWxJAdAAAUdJ2NUprZg+RePJKqowMAEt5sdWVNma5EQAAAAS2FhKTwXN7EaFjcIrPtPy6AZaVcseR2rCfdl0ZtxilkkuR6BifTz7sujH08+7LozbAGJ9PPuy6MfTz7sujNsAYn08+7Lox9PPuy6M2wBifTz7sujH08+7LozbAGG7vPuy6M4aazw5m+eSSeePMDABq21wg8uy+GXQz7e7yhnlsayAiAAAA7srNyaitoFvRljV672YLmaRxZQUUkth2AAAAAAQXuw1402rIx5Jp0eazN8p36663aX3LzQGWWLndXN1eEVnx4Ihs41aTdMaOuw3IRSSSyWQCEUlRKiR0AAAAAAAAAAAAAAAAAAPJRTVHij0AZF8uupivtflwZWN+UU1R4pmHbw1ZNVrRgcGtcbtqqr+5+S3EVwun5y/8r3L4AAAAAAAAAAAU75c9btR+7bx/sr3W9uPZlWmXFGoV7zdVPg9/wAgTxkmqrFHpkJ2lk+H+rL93vcZcHufsBYAAAAAAAAAAAAAAAADZDb3mMc3juWZn2ltO0dEsNyy8WBLe77Xsw8X8HVzuX5S8F8kt1uaji8ZeS5FoAAAAAAAAAAAAAAAADmcU1Rqq4lG30ftg/B+zNAAZULzaQwlVrdL2Zbsr/B59l8cupZlFPBpNcUVLXR8XlWPmgLcZJ5NPk6nplu5WkftdeTozz9a2jnreMa+YGqDMWkZbVHzR0tJfx8wNEGc9Jfx8zl6SlsUfNgaZ42Zf1FtLKvhH3CulrL7n/lKoFy1vsFtq+GPmVLS+TlhFU5YvqT2Wjor7m35Itws0sEkuQGfYaPbxm6cFn4sv2dmoqiVEdgAAAAAAAAAAAAAAAAAAAAAAAAAAAK14M21AA8gaF2AAuAAAAAAAAAAAAAAAAAAD//Z'
            }
            restaurantName={restaurant.name}
            rating={restaurant.rating}
            reviewSrc={restaurant.url}
            cuisine={restaurant.categories}
            price={restaurant.price != null ? restaurant.price : '$'}
          />
        ))
      )}
    </div>
  );
};

export default RestaurantFeed;
