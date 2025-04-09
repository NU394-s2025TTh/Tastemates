import Card from './components/Card';
import Navbar from './components/Navbar';

const FeedPage = () => {
  return (
    <>
      <Navbar />
      <Card isFeed={true} />
    </>
  );
};

export default FeedPage;
