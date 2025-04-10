import { useState } from 'react';

import Card from './components/Card';
import Navbar from './components/Navbar';
import SearchInput from './components/SearchInput';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searched for: ', query);
    // TO DO: actually search and connect w Yelp API
  };
  return (
    <>
      <Navbar />
      <SearchInput onSearch={handleSearch} />
      {searchQuery && (
        <p style={{ padding: '0 1rem' }}>
          Showing results for: <strong>{searchQuery}</strong>
        </p>
      )}
      <Card
        isFeed={false}
        restaurantName="Frida's"
        rating={4.7}
        reviewSrc="https://g.co/kgs/3F6zToD"
        cuisine="Mexican"
        price="$"
      />
      <Card
        isFeed={false}
        restaurantName="Stacked and Folded"
        rating={4.2}
        reviewSrc="https://www.google.com/search?q=stacked+and+folded+reviews&sca_esv=bd578a49708ea9c5&sxsrf=AHTn8zqVl6nyIuxDtosoPG0yqt_MSi-HTg%3A1744250203704&ei=WyX3Z8ngKoPdptQPopez6AQ&ved=0ahUKEwiJ-qmursyMAxWDrokEHaLLDE0Q4dUDCBA&uact=5&oq=stacked+and+folded+reviews&gs_lp=Egxnd3Mtd2l6LXNlcnAiGnN0YWNrZWQgYW5kIGZvbGRlZCByZXZpZXdzMg4QLhiABBjHARiOBRivATIGEAAYFhgeMgsQABiABBiGAxiKBTILEAAYgAQYhgMYigUyCxAAGIAEGIYDGIoFMgsQABiABBiGAxiKBTIIEAAYgAQYogQyCBAAGIAEGKIEMgUQABjvBTIFEAAY7wUyHRAuGIAEGMcBGI4FGK8BGJcFGNwEGN4EGOAE2AEBSMcMUIADWPULcAF4AJABAJgBhAGgAYQHqgEDMS43uAEDyAEA-AEBmAIIoAK3BsICChAAGLADGNYEGEfCAg0QABiABBiwAxhDGIoFwgIcEC4YgAQYsAMYQxjHARjIAxiKBRiOBRivAdgBAcICChAAGIAEGEMYigXCAgUQABiABMICExAuGIAEGBQYhwIYxwEYjgUYrwHCAgsQABiABBiRAhiKBcICIhAuGIAEGBQYhwIYxwEYjgUYrwEYlwUY3AQY3gQY4ATYAQGYAwCIBgGQBhO6BgYIARABGAiSBwMxLjegB6RnsgcDMC43uAeuBg&sclient=gws-wiz-serp"
        cuisine="American"
        price="$$"
      />
      <Card
        isFeed={false}
        restaurantName="Tomate Fresh Kitchen"
        rating={4.8}
        reviewSrc="https://www.google.com/search?sca_esv=bd578a49708ea9c5&sxsrf=AHTn8zo5gRAmz2Zwg2ZCxvfbOrIEI4vb8A:1744250386185&si=APYL9bvoDGWmsM6h2lfKzIb8LfQg_oNQyUOQgna9TyfQHAoqUmE6VPlBvVY1dG8JaSQS0X7w75oSRORgvP19jqWKUZCy1Osxx5V2x1cwMMbxRUcWZ3BmoUrcXr1beCVdfzDMnCGP8-8IV_z_N8Y3LfZGc9ZhydSp_g%3D%3D&q=Tomate+Fresh+Kitchen+Reviews&sa=X&ved=2ahUKEwjg2KuFr8yMAxUNg4kEHTIIBhQQ0bkNegQINRAE&biw=1440&bih=727&dpr=2"
        cuisine="Mexican"
        price="$"
      />
    </>
  );
};

export default ExplorePage;
