import Card from './components/Card';
import Navbar from './components/Navbar';

const ExplorePage = () => {
  return (
    <>
      <Navbar />
      <Card isFeed={false} />
    </>
  );
};

export default ExplorePage;
