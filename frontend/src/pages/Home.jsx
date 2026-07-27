// src/pages/Home.jsx
import Hero from '../components/Layout/Hero';
import ValueSlider from '../components/Layout/ValueSlider';
import ValueStrip from '../components/Layout/ValueStrip';
import ReviewBanner from '../components/Layout/ReviewBanner';
import Testimonials from '../components/Layout/Testimonials'; 
import Trending from '../components/sections/Trending';
import ShopByCategory from '../components/sections/ShopByCategory';
import SocialMediaHandling from '../components/sections/SocialMediaHandling';
// import ShopHijab from '../components/sections/ShopHijab';

const Home = () => {
  return (
    <div className="home-container">
      <Hero />
      <ValueSlider />
      <ReviewBanner />
      <Trending />
      <ValueStrip />
      <ShopByCategory />
        {/*  <ShopHijab /> */}
        <Testimonials /> 
        <SocialMediaHandling />

    </div>
  );
};

export default Home;