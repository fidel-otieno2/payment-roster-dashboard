import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      name: 'Brand Strategy',
      description: 'Develop a comprehensive brand strategy that resonates with your target audience.',
      tiers: [
        { name: 'Bronze', price: '$500', features: ['Basic brand analysis', 'Logo concept', 'Color palette'] },
        { name: 'Silver', price: '$1,000', features: ['Advanced brand analysis', 'Logo design', 'Brand guidelines', 'Social media templates'] },
        { name: 'Gold', price: '$2,000', features: ['Comprehensive brand strategy', 'Logo design', 'Brand guidelines', 'Social media templates', 'Website mockups', 'Brand voice guide'] }
      ]
    },
    {
      name: 'Web Development',
      description: 'Build responsive, modern websites that drive results.',
      tiers: [
        { name: 'Bronze', price: '$1,000', features: ['5-page website', 'Responsive design', 'Basic SEO'] },
        { name: 'Silver', price: '$2,500', features: ['10-page website', 'Responsive design', 'Advanced SEO', 'Contact form', 'Analytics setup'] },
        { name: 'Gold', price: '$5,000', features: ['Unlimited pages', 'Responsive design', 'Advanced SEO', 'Contact form', 'Analytics setup', 'E-commerce integration', 'Performance optimization'] }
      ]
    },
    {
      name: 'UI/UX Design',
      description: 'Create intuitive user interfaces and experiences that delight users.',
      tiers: [
        { name: 'Bronze', price: '$800', features: ['Wireframes', 'Basic UI design', 'User flow'] },
        { name: 'Silver', price: '$1,800', features: ['Wireframes', 'UI design', 'User flow', 'Prototyping', 'Usability testing'] },
        { name: 'Gold', price: '$3,500', features: ['Wireframes', 'UI design', 'User flow', 'Prototyping', 'Usability testing', 'Design system', 'Accessibility audit'] }
      ]
    },
    {
      name: 'Digital Marketing',
      description: 'Grow your online presence with targeted digital marketing campaigns.',
      tiers: [
        { name: 'Bronze', price: '$600', features: ['Social media setup', 'Basic content calendar', 'Monthly reporting'] },
        { name: 'Silver', price: '$1,500', features: ['Social media management', 'Content creation', 'Email marketing', 'Monthly reporting', 'Ad campaign setup'] },
        { name: 'Gold', price: '$3,000', features: ['Social media management', 'Content creation', 'Email marketing', 'Ad campaign management', 'SEO optimization', 'Monthly reporting', 'Strategy consultation'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Our Services
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Choose the perfect package for your business needs. All tiers include our premium quality and dedicated support.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-x-8 lg:gap-y-12">
          {services.map((service, serviceIdx) => (
            <div key={service.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                </div>
                <p className="mt-4 text-lg text-gray-500">{service.description}</p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 sm:px-10 sm:pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {service.tiers.map((tier, tierIdx) => (
                    <div key={tier.name} className="border border-gray-200 rounded-lg p-6 bg-white">
                      <h4 className="text-lg font-semibold text-gray-900">{tier.name}</h4>
                      <p className="mt-2 text-3xl font-bold text-indigo-600">{tier.price}</p>
                      <ul className="mt-4 space-y-2">
                        {tier.features.map((feature, featureIdx) => (
                          <li key={featureIdx} className="flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-3 text-sm text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Need a Custom Solution?</h2>
          <p className="mt-4 text-lg text-gray-500">
            Contact us for a personalized quote tailored to your specific needs.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
