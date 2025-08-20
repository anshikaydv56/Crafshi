import React from "react";

const About: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4">
          About <span className="text-amber-600">Crafshi</span>
        </h1>
        <p className="text-lg text-amber-700 max-w-3xl mx-auto">
          Welcome to <b>Crafshi</b> – your one-stop destination for premium handcrafted products.  
          We connect artisans with the world by bringing their craftsmanship online.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80"
          alt="Crafts"
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-semibold text-amber-800 mb-4">
            Our Mission
          </h2>
          <p className="text-amber-700 leading-relaxed">
            We aim to preserve and promote traditional art forms by giving local
            artisans a modern platform. Every purchase you make supports
            talented craftsmen and keeps cultural heritage alive.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-semibold text-center text-amber-800 mb-12">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Member 1 */}
          <div className="bg-amber-50 rounded-2xl p-6 text-center shadow-md">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-amber-800">Anshika Yadav</h3>
            <p className="text-amber-600">Founder & CEO</p>
          </div>
          {/* Member 2 */}
          <div className="bg-amber-50 rounded-2xl p-6 text-center shadow-md">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-amber-800">Rahul Verma</h3>
            <p className="text-amber-600">Lead Designer</p>
          </div>
          {/* Member 3 */}
          <div className="bg-amber-50 rounded-2xl p-6 text-center shadow-md">
            <img
              src="https://randomuser.me/api/portraits/men/67.jpg"
              alt="Team Member"
              className="w-28 h-28 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-amber-800">Rohan Gupta</h3>
            <p className="text-amber-600">Tech Head</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-amber-800 mb-6">
          Our Values
        </h2>
        <p className="text-amber-700 leading-relaxed max-w-3xl mx-auto">
          At Crafshi, we believe in sustainability, fair trade, and empowering
          artisans. Each product tells a story, and with your support, we keep
          those stories alive for generations to come.
        </p>
      </section>
    </div>
  );
};

export default About;
