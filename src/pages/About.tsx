import { useState } from "react";
import Navbar from "../components/Navbar";
import { FaInstagram } from "react-icons/fa";

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://res.cloudinary.com/dvhhx0aid/image/upload/v1749667634/Screenshot_2025-06-12_001632_crofnf.png"
                alt="Our Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-playfair font-bold mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2024 , The Label H based in Vadoadara Gujarat, With
                the vision to blend traditional Indian craftsmanship with
                contemporary design sensibilities.
              </p>
              <p className="text-muted-foreground">
                We are weaving dreams into threads of tradition and elegance
                production practices, and celebration of India's rich textile
                heritage.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">
              Our Vision & Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Vision</h3>
                <p className="text-muted-foreground">
                  To be a global brand that represents the best of Indian
                  craftsmanship while setting new standards in sustainable and
                  ethical fashion.
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Mission</h3>
                <p className="text-muted-foreground">
                  To create timeless pieces that honor tradition, embrace
                  innovation, and empower artisans across India.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 border border-border rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">
              The Team
            </h2>
            <div className=" justify-center items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex ">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name} </h3>
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
    description:
      "We honor traditional techniques and skills passed down through generations.",
  },
  {
    title: "Sustainability",
    description:
      "We are committed to environmentally responsible practices across our operations.",
  },
  {
    title: "Innovation",
    description: "We constantly explore new designs and production methods.",
  },
  {
    title: "Empowerment",
    description: "We support and uplift the artisan communities we work with.",
  },
  {
    title: "Quality",
    description:
      "We never compromise on the excellence of our materials and products.",
  },
  {
    title: "Authenticity",
    description:
      "We stay true to our heritage while embracing modern aesthetics.",
  },
];

const team = [
  {
    name: "Hinal Tadvi",
    position: "Founder & Creative Director",
    image:
      "https://res.cloudinary.com/dvhhx0aid/image/upload/v1749667238/f7857f66-b31a-41e5-b231-aebdbd6138b1_bqkoft.jpg",
  },
];

export default About;
