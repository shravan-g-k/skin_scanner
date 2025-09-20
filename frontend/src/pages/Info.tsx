import { useState, useEffect } from "react";

const AISkinScannerInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced deep learning algorithms analyze skin patterns, texture, and pigmentation with clinical-grade accuracy",
      icon: "🧠",
      details: ["95% accuracy rate", "Trained on 1M+ images", "Real-time processing"]
    },
    {
      title: "Instant Results",
      description: "Get comprehensive skin analysis in seconds with detailed insights and personalized recommendations",
      icon: "⚡",
      details: ["3-second analysis", "Detailed reports", "Progress tracking"]
    },
    {
      title: "Professional Grade",
      description: "Developed with certified dermatologists using medical-grade image analysis technology",
      icon: "👩‍⚕️",
      details: ["Dermatologist approved", "Clinical validation", "Medical standards"]
    },
    {
      title: "Complete Privacy",
      description: "Your skin data is processed locally and encrypted, ensuring complete privacy and security",
      icon: "🔒",
      details: ["Local processing", "Bank-level encryption", "No data storage"]
    }
  ];

  const analysisTypes = [
    { name: "Acne Analysis", icon: "🎯", color: "from-red-400 to-pink-500" },
    { name: "Aging Assessment", icon: "⏰", color: "from-orange-400 to-yellow-500" },
    { name: "Pigmentation", icon: "🌈", color: "from-purple-400 to-indigo-500" },
    { name: "Skin Texture", icon: "✨", color: "from-green-400 to-teal-500" },
    { name: "Hydration Level", icon: "💧", color: "from-blue-400 to-cyan-500" },
    { name: "Sun Damage", icon: "☀️", color: "from-amber-400 to-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div 
        className={`text-center py-20 px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* AI Scanner Visualization */}
          <div className="relative mb-12">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
              {/* Animated scanner lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-white/30 rounded-full animate-pulse"></div>
                <div className="absolute w-24 h-24 border-2 border-white/50 rounded-full animate-ping"></div>
              </div>
              
              {/* AI Brain Icon */}
              <svg viewBox="0 0 80 80" className="w-16 h-16 text-white relative z-10">
                <circle cx="40" cy="40" r="25" fill="currentColor" opacity="0.3"/>
                <path d="M 30 35 Q 40 25 50 35 Q 50 45 40 50 Q 30 45 30 35" fill="currentColor"/>
                <circle cx="35" cy="38" r="2" fill="white"/>
                <circle cx="45" cy="38" r="2" fill="white"/>
                <path d="M 35 45 Q 40 48 45 45" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-10 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            AI Skin Scanner
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
            Revolutionary artificial intelligence technology that provides instant, professional-grade 
            skin health analysis using advanced computer vision and machine learning
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "95%", label: "Accuracy" },
              { value: "3s", label: "Analysis Time" },
              { value: "500K+", label: "Scans Done" },
              { value: "4.9★", label: "User Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Advanced AI Analysis Capabilities
          </h2>

          {/* Interactive Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer ${
                  activeFeature === index ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start space-x-6">
                  <div className="text-5xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-lg mb-4">{feature.description}</p>
                    
                    {/* Feature details */}
                    <div className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Active indicator */}
                {activeFeature === index && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Types */}
      <div className="py-16 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Comprehensive Skin Analysis
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {analysisTypes.map((analysis, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${analysis.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="text-4xl mb-3">{analysis.icon}</div>
                <h3 className="text-lg font-semibold">{analysis.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Simple 3-Step Process
          </h2>
          
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Capture Image",
                description: "Take a clear, well-lit photo of your skin area using your smartphone camera",
                icon: "📸"
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our advanced neural networks process and analyze your image in real-time",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive detailed analysis with insights and personalized skincare recommendations",
                icon: "📊"
              }
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-8 bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <div className="text-4xl text-center">{step.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-8">Privacy & Safety First</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
              <p className="text-blue-100">All analysis happens locally on your device</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-2">Medical Standards</h3>
              <p className="text-blue-100">Developed with certified dermatologists</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">No Data Storage</h3>
              <p className="text-blue-100">Your photos are never saved or shared</p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-blue-100 text-lg">
              <strong>Medical Disclaimer:</strong> AI Skin Scanner is for educational purposes only. 
              Always consult with a qualified dermatologist for medical concerns and treatment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISkinScannerInfo;