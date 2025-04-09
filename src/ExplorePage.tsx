import Card from './components/Card';
import Navbar from './components/Navbar';

const ExplorePage = () => {
  return (
    <>
      <Navbar />
      <Card
        isFeed={false}
        restaurantName="Frida's"
        rating={4.7}
        reviewSrc="https://g.co/kgs/3F6zToD"
        cuisine="Mexican"
        price="$"
      />
    </>
  );
};

export default ExplorePage;
