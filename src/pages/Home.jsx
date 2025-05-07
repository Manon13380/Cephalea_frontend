import React from 'react';
import PrivateLayout from '../components/PrivateLayout';

const Home = () => {
  const token = sessionStorage.getItem("token");


  return (
    <PrivateLayout> 
      
      </PrivateLayout>
  );
};

export default Home;
