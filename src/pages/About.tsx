
import { useState } from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-center">
            About <span className="text-accent">The Label H</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80" 
                alt="Our Workshop" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-playfair font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2012, The Label H began as a small boutique in Mumbai with a vision to blend traditional Indian craftsmanship with contemporary design sensibilities.
              </p>
              <p className="text-muted-foreground">
                Over the years, we've grown into a recognized name in the fashion industry, known for our commitment to quality, ethical production practices, and celebration of India's rich textile heritage.
              </p>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">Our Vision & Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Vision</h3>
                <p className="text-muted-foreground">
                  To be a global brand that represents the best of Indian craftsmanship while setting new standards in sustainable and ethical fashion.
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Mission</h3>
                <p className="text-muted-foreground">
                  To create timeless pieces that honor tradition, embrace innovation, and empower artisans across India.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="p-6 border border-border rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">The Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-accent">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-muted py-8 px-4 text-center text-foreground/70">
        <p>© {new Date().getFullYear()} The Label H. All rights reserved.</p>
      </footer>
    </div>
  );
};

const values = [
  {
    title: "Craftsmanship",
    description: "We honor traditional techniques and skills passed down through generations."
  },
  {
    title: "Sustainability",
    description: "We are committed to environmentally responsible practices across our operations."
  },
  {
    title: "Innovation",
    description: "We constantly explore new designs and production methods."
  },
  {
    title: "Empowerment",
    description: "We support and uplift the artisan communities we work with."
  },
  {
    title: "Quality",
    description: "We never compromise on the excellence of our materials and products."
  },
  {
    title: "Authenticity",
    description: "We stay true to our heritage while embracing modern aesthetics."
  }
];

const team = [
  {
    name: "Priya Sharma",
    position: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Vikram Patel",
    position: "Production Director",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Anjali Desai",
    position: "Head of Design",
    image: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export default About;
