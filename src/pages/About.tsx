import React from "react";

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-amber-800 mb-6">About Us</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        Welcome to <span className="font-semibold">Crafshi</span>! We are passionate about bringing 
        you the finest collection of handmade crafts, pottery, jewelry, textiles, and more. 
        Our mission is to support local artisans and preserve the beauty of traditional art.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div className="bg-amber-200/30 shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To empower artisans by providing them with a platform to showcase 
            their skills and connect with customers who value authentic, handmade work.
          </p>
        </div>
        <div className="bg-amber-200/30 shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600">
            Every product is unique, crafted with love and dedication. By shopping 
            with us, you not only own something special but also support sustainable art.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
