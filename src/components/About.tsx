import React from 'react';
import { Award, Users, Clock, Heart } from 'lucide-react';

const stats = [
  { icon: Award, label: 'Years of Experience', value: '25+' },
  { icon: Users, label: 'Happy Customers', value: '10K+' },
  { icon: Clock, label: 'Fresh Daily', value: '24/7' },
  { icon: Heart, label: 'Traditional Recipes', value: '100+' }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Sweet Journey
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 1998, MilkMan has been serving authentic Indian sweets 
              with the same passion and dedication that started our journey. We believe 
              in preserving traditional recipes while maintaining the highest quality standards.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Every sweet is handcrafted by our experienced artisans using premium ingredients 
              sourced directly from trusted suppliers. Our commitment to freshness means we 
              prepare sweets daily to ensure you get the best taste and quality.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/aboutUs.jpg"
              alt="Sweet preparation"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-sm font-semibold">Fresh Daily</p>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;