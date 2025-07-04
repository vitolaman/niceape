import React from 'react';

const Hero = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">NiceApe</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-600 mb-6">
            Trade tokens, fund causes!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Every trade generates fees that go directly to charity.
          </p>
          <p className="text-lg font-medium text-gray-800">Trade nice, ape big! 🦍💚</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format"
              alt="NiceApe Community"
              className="rounded-2xl shadow-2xl max-w-lg w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
