import React, { useState } from 'react';
import { Home, MapPin, Users, Droplets, Square, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

interface FormData {
  bhk: number;
  bathrooms: number;
  squareFeet: string;
  location: string;
}

interface PredictionResult {
  price: number;
  confidence: number;
}

const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    bhk: 2,
    bathrooms: 2,
    squareFeet: '',
    location: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Pune, Maharashtra',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh',
    'Gurgaon, Haryana',
    'Noida, Uttar Pradesh'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.squareFeet || parseFloat(formData.squareFeet) <= 0) {
      newErrors.squareFeet = 'Please enter a valid square feet area';
    }
    
    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock prediction calculation
    const basePrice = parseFloat(formData.squareFeet) * 5000;
    const bhkMultiplier = formData.bhk * 0.8;
    const bathroomMultiplier = formData.bathrooms * 0.3;
    const locationMultiplier = Math.random() * 0.4 + 0.8;
    
    const predictedPrice = Math.round(basePrice * (1 + bhkMultiplier + bathroomMultiplier) * locationMultiplier);
    
    setPrediction({
      price: predictedPrice,
      confidence: Math.round((Math.random() * 15 + 85) * 100) / 100
    });
    
    setIsLoading(false);
  };

  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-800 to-slate-900 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent animate-pulse">
            Property Price Predictor
          </h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Harness the power of machine learning to get accurate property price predictions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-cyan-300 animate-spin" />
                  Property Details
                </h2>

                {/* BHK Selection */}
                <div className="space-y-3">
                  <label className="text-cyan-100 font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    BHK Configuration
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((bhk) => (
                      <button
                        key={bhk}
                        onClick={() => setFormData(prev => ({ ...prev, bhk }))}
                        className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          formData.bhk === bhk
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                            : 'bg-white/10 text-cyan-100 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {bhk} BHK
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-3">
                  <label className="text-cyan-100 font-medium flex items-center">
                    <Droplets className="w-4 h-4 mr-2" />
                    Number of Bathrooms
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((bathroom) => (
                      <button
                        key={bathroom}
                        onClick={() => setFormData(prev => ({ ...prev, bathrooms: bathroom }))}
                        className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          formData.bathrooms === bathroom
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                            : 'bg-white/10 text-cyan-100 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {bathroom} Bath
                      </button>
                    ))}
                  </div>
                </div>

                {/* Square Feet */}
                <div className="space-y-3">
                  <label className="text-cyan-100 font-medium flex items-center">
                    <Square className="w-4 h-4 mr-2" />
                    Square Feet Area
                  </label>
                  <input
                    type="number"
                    placeholder="Enter area in sq ft"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareFeet: e.target.value }))}
                    className={`w-full p-4 rounded-xl bg-white/10 border ${
                      errors.squareFeet ? 'border-red-400' : 'border-white/20'
                    } text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  />
                  {errors.squareFeet && (
                    <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.squareFeet}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="text-cyan-100 font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full p-4 rounded-xl bg-white/10 border ${
                      errors.location ? 'border-red-400' : 'border-white/20'
                    } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  >
                    <option value="" className="bg-slate-800">Select a location</option>
                    {locations.map((location) => (
                      <option key={location} value={location} className="bg-slate-800">
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-red-400 text-sm mt-1 animate-pulse">{errors.location}</p>
                  )}
                </div>

                {/* Predict Button */}
                <button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 mt-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Predicting...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Predict Estimate Price</span>
                    </>
                  )}
                </button>
              </div>

              {/* Results Panel */}
              <div className="flex flex-col justify-center">
                {prediction ? (
                  <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/30 animate-fade-in">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Predicted Price</h3>
                      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-4 animate-pulse">
                        {formatPrice(prediction.price)}
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-cyan-200">
                        <Sparkles className="w-4 h-4" />
                        <span>Confidence: {prediction.confidence}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-cyan-200 space-y-4">
                    <div className="w-24 h-24 border-4 border-dashed border-cyan-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Home className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Ready to Predict</h3>
                    <p className="text-cyan-300">Fill in the property details and click predict to get your estimate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-cyan-200">
          <p className="mb-2">Powered by Advanced Machine Learning</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;