import React from "react";
import { ArrowRight, TrendingUp, ChevronRight } from "lucide-react";
import { Trophy, User } from "lucide-react";

export const trendingNewsData = {
  mainImage:
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=450&fit=crop", // Soccer/football action image
  title: "5 things to look out for this international break",
  subtitle:
    "World Cup qualifiers and potential milestones await for those Gunners representing their countries",
  items: [
    {
      _id: '1',
      title: "The Dispatch: Carabao Cup, Kim Little and NLD",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop", // Stadium/cup image
      icon: Trophy,
      category: "Match Preview",
    },
    {
      _id: '2',
      title: "Olivia Smith: Tearing the Super League apart",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop", // Female football player
      icon: User,
      category: "Player Feature",
    },
    {
      _id: '3',
      title: "Soskode: Tearing the Super League apart",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop", // Female football player
      icon: User,
      category: "Player Feature",
    },
  ],
};

// Large Screen Component (Desktop)
const TrendingDesktop: React.FC = () => {
 
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Trending Header */}
      <div className="bg-primary px-6 py-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-white" />
        <span className="text-white font-bold text-sm tracking-wide">
          TRENDING
        </span>
      </div>

      {/* Hero Section with Main Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={trendingNewsData.mainImage}
          alt="International break action"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            {trendingNewsData.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            {trendingNewsData.subtitle}
          </p>
        </div>
      </div>

      {/* Trending Items Grid */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingNewsData.items.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300 shrink-0">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className="flex justify-end border-t pt-6 mt-4">
          <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group">
            <span>TRENDING - SEE MORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile Screen Component
const TrendingMobile: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      {/* Trending Header - Compact */}
      <div className="bg-primary px-4 py-2.5 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-white" />
        <span className="text-white font-bold text-xs tracking-wide">
          TRENDING
        </span>
      </div>

      {/* Hero Section with Main Image - Mobile */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trendingNewsData.mainImage}
          alt="International break action"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-lg font-bold text-white mb-1 leading-tight">
            {trendingNewsData.title}
          </h2>
          <p className="text-white/80 text-xs line-clamp-2">
            {trendingNewsData.subtitle}
          </p>
        </div>
      </div>

      {/* Trending Items List - Mobile with Images */}
      <div className="p-4">
        <div className="space-y-4 mb-5">
          {trendingNewsData.items.map((item) => (
            <div
              key={item._id}
              className="bg-gray-50 rounded-lg overflow-hidden active:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex">
                <div className="w-24 h-24 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 p-1.5 rounded-lg shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-primary text-xs font-medium mt-2">
                        <span>Read more</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link - Compact */}
        <div className="border-t pt-4">
          <button className="flex items-center justify-between w-full text-primary font-semibold text-sm">
            <span>TRENDING - SEE MORE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Responsive Component
interface TrendingProps {
  className?: string;
  images?: {
    main?: string;
    item1?: string;
    item2?: string;
  };
}

const TrendingNews: React.FC<TrendingProps> = ({ className = "" }) => {
  return (
    <div className={className}>
      <div className="hidden md:block">
        <TrendingDesktop />
      </div>

      <div className="block md:hidden">
        <TrendingMobile />
      </div>
    </div>
  );
};

export default TrendingNews;
