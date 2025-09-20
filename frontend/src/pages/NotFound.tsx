import { useState, useEffect } from "react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Simulate the animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Log the 404 error (simulated)
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
      <div 
        className={`text-center max-w-lg transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Custom 404 Illustration using CSS */}
        <div 
          className={`w-72 h-48 mx-auto mb-6 flex items-center justify-center transition-all duration-600 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-80 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <svg 
            viewBox="0 0 200 120" 
            className="w-full h-full text-gray-400"
            fill="currentColor"
          >
            {/* Broken page icon */}
            <rect x="40" y="20" width="80" height="100" rx="4" fill="none" stroke="currentColor" strokeWidth="3"/>
            <line x1="50" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="2"/>
            <line x1="50" y1="45" x2="110" y2="45" stroke="currentColor" strokeWidth="2"/>
            <line x1="50" y1="55" x2="80" y2="55" stroke="currentColor" strokeWidth="2"/>
            
            {/* Crack in the page */}
            <path d="M 80 20 L 85 35 L 75 50 L 90 65 L 70 80 L 95 95 L 80 120" 
                  stroke="currentColor" strokeWidth="2" fill="none"/>
            
            {/* Question mark */}
            <circle cx="150" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M 145 35 Q 150 30 155 35 Q 155 40 150 42" 
                  stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="150" cy="50" r="2" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Heading */}
        <h1 
          className={`text-6xl font-extrabold text-gray-800 mb-4 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          404
        </h1>
        
        {/* Subtext */}
        <p 
          className={`text-xl text-gray-600 mb-6 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          Oops! The page you're looking for doesn't exist.
        </p>
        
        {/* Button */}
        <div
          className={`transition-all duration-400 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="ml-4 px-6 py-3 text-lg rounded-2xl shadow-lg bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;