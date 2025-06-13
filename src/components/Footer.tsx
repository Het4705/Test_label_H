
import { Github, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer = ({ isDarkMode }: FooterProps) => {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/the__label__h/', label: 'Instagram' }
  ];

  return (
    <footer className={`bg-muted py-10 px-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-playfair font-bold mb-4">The Label H</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Bringing traditional craftsmanship to modern fashion. Sustainable, ethical, and beautiful.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-accent transition-colors">Home</a>
              </li>
              <li>
                <a href="/products" className="text-muted-foreground hover:text-accent transition-colors">Shop</a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-accent transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Return Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Label H. All rights reserved.
          </p>
          <a href='https://www.instagram.com/Patelhet_4705'><p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Developed by <span className="text-accent font-medium">AmbeWeb</span>
          </p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
