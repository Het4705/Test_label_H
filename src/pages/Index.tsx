
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import LandingAnimation from '@/components/LandingAnimation';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryShowcase from '@/components/CollectionShowcase';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import CollectionShowcase from '@/components/CollectionShowcase';
import ReelShowcase from '@/components/sampleReels';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main>
        <LandingAnimation />
        <ReelShowcase />
        <FeaturedProducts />
        <CollectionShowcase />
        <CallToAction />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;
