import Card from './components/Card';
import Navbar from './components/Navbar';

const FeedPage = () => {
  return (
    <>
      <Navbar />
      <Card
        isFeed={true}
        profileImg="src/assets/poster-pic.svg"
        postUser="Pedro"
        caption="Best dinner of my life! Must try."
        imgSrc="src/assets/calo.jpg"
        restaurantName="Calo Ristorante"
        rating={4.6}
        reviewSrc="https://g.co/kgs/vXuQeiZ"
        cuisine="Italian"
        price="$$"
      />
      <Card
        isFeed={true}
        profileImg="src/assets/poster-pic.svg"
        postUser="Carly"
        caption="Primos was SOOOOO good. Who's down to go again next week?"
        imgSrc="src/assets/pizza.png"
        restaurantName="Primos"
        rating={4.5}
        reviewSrc="https://g.co/kgs/st6SdLx"
        cuisine="Italian"
        price="$"
      />
    </>
  );
};

export default FeedPage;
