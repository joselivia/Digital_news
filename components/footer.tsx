import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
              <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">The Daily Express</h2>
            <p className="mt-2 text-sm">Innovating the future, one step at a time.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <ol className="space-y-1 text-sm">
              <li>Advertisement</li>
              <li>Politics</li>
              <li>Business</li>
              <li>Sports</li>
            </ol>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

       <div className="mt-8 text-center text-sm border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} The Daily Express. All rights reserved.
            <br />
            <Link target='_blank' href="https://portfolio-gilt-six-94.vercel.app/" className="hover:underline text-blue-500">powered by Jomu_Code</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;