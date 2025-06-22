import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, MapPin, Users, Droplets, Square, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

interface FormData {
  bhk: number;
  bathrooms: number;
  squareFeet: string;
  location: string;
}

interface PredictionResult {
  price: number;
}

const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    bhk: 2,
    bathrooms: 2,
    squareFeet: '',
    location: ''
  });

  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    axios.get('http://localhost:5000/get_location')
      .then((res) => setLocations(res.data.locations))
      .catch((err) => console.error("Location fetch failed", err));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.squareFeet || parseFloat(formData.squareFeet) <= 0) newErrors.squareFeet = 'Enter valid area';
    if (!formData.location) newErrors.location = 'Choose a location';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/prediction', {
        total_sqft: formData.squareFeet,
        location: formData.location,
        bhk: formData.bhk,
        bath: formData.bathrooms
      });
      setPrediction({ price: res.data.price });
    } catch (err) {
      console.error('Prediction error:', err);
    }

    setIsLoading(false);
  };

  const formatPrice = (price: number): string => {
    if (price >= 1e7) return `₹${(price / 1e7).toFixed(2)} Cr`;
    if (price >= 1e5) return `₹${(price / 1e5).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-800 to-slate-900 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-32 left-40 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>

      {/* Particle Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* UI Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent animate-pulse">
            Property Price Predictor
          </h1>
          <p className="text-cyan-100 mt-4 max-w-xl mx-auto">
            Powered by your machine learning model – enter property details and get real-time predictions!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Form Side */}
            <div className="space-y-6">
              <div>
                <label className="text-cyan-100 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  BHK
                </label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {[1, 2, 3, 4].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setFormData({ ...formData, bhk })}
                      className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        formData.bhk === bhk
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md scale-105'
                          : 'bg-white/10 text-cyan-100 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {bhk} BHK
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-cyan-100 font-medium flex items-center">
                  <Droplets className="w-4 h-4 mr-2" />
                  Bathrooms
                </label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {[1, 2, 3, 4].map((bath) => (
                    <button
                      key={bath}
                      onClick={() => setFormData({ ...formData, bathrooms: bath })}
                      className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        formData.bathrooms === bath
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md scale-105'
                          : 'bg-white/10 text-cyan-100 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {bath} Bath
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-cyan-100 font-medium flex items-center">
                  <Square className="w-4 h-4 mr-2" />
                  Square Feet
                </label>
                <input
                  type="number"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  className={`w-full p-4 rounded-xl bg-white/10 border ${
                    errors.squareFeet ? 'border-red-400' : 'border-white/20'
                  } text-white placeholder-cyan-200 focus:outline-none`}
                  placeholder="e.g. 1200"
                />
                {errors.squareFeet && <p className="text-red-400 text-sm mt-1">{errors.squareFeet}</p>}
              </div>

              <div>
                <label className="text-cyan-100 font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full p-4 rounded-xl bg-white/10 border ${
                    errors.location ? 'border-red-400' : 'border-white/20'
                  } text-white focus:outline-none`}
                >
                  <option value="">Select a location</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>

              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-4 px-8 rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Predicting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Predict Price
                  </span>
                )}
              </button>
            </div>

            {/* Result Side */}
            <div className="flex flex-col justify-center items-center">
              {prediction ? (
                <div className="bg-white/10 border border-white/30 p-8 rounded-2xl text-center w-full animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Predicted Price</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                    {formatPrice(prediction.price)}
                  </div>
                </div>
              ) : (
                <div className="text-cyan-100 text-center">
                  <div className="w-24 h-24 border-4 border-dashed border-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <Home className="w-8 h-8 text-cyan-300" />
                  </div>
                  <h3 className="text-xl font-semibold">Ready to Predict</h3>
                  <p className="text-cyan-200 mt-2">Fill in details and get the estimated price instantly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
