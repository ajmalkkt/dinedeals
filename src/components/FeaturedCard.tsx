import React from "react";
import { Card, CardContent } from "./ui/card";
import { Leaf, ArrowRight } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  onTextClick?: () => void;
}

export default function FeaturedCard({ 
  title = "No Waste... More Tasty!!!", 
  subtitle = "Save Food Campaign. Join the movement to honor every meal.", 
  imageUrl,
  onTextClick
}: Props) {
  return (
    <section className="mb-4 w-full">
      {/* 
        The entire card is now the trigger for the popup.
        Added 'group' for hover effects.
      */}
      <div 
        onClick={onTextClick} 
        className="w-full cursor-pointer group transition-transform hover:-translate-y-1 duration-300"
      >
        <Card className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-green-200 overflow-hidden h-32 md:h-36 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0 h-full">
            <div className="flex items-center h-full relative">
              
              {/* --- LEFT SIDE: TEXT CONTENT --- */}
              <div className="flex-1 p-4 md:p-6 flex flex-col justify-center min-w-0">
                
                {/* Decorative Label */}
                <div className="flex items-center gap-1.5 mb-2">
                  <Leaf size={12} className="text-green-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Eco Initiative
                  </span>
                </div>

                {/* THEME UPDATES: Serif Font + Campaign Colors */}
                <h2 className="text-2xl md:text-3xl font-serif font-black text-green-900 leading-none mb-1 group-hover:text-green-700 transition-colors">
                  {title}
                </h2>
                
                <p className="text-green-800/80 text-xs md:text-sm line-clamp-2 leading-relaxed font-medium">
                  {subtitle}
                </p>

                {/* 'Read More' Indicator */}
                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                   Read our story <ArrowRight size={14} />
                </div>
              </div>

              {/* --- RIGHT SIDE: IMAGE --- */}
              <div className="w-32 md:w-48 h-full relative overflow-hidden clip-diagonal">
                {/* Diagonal overlay effect using CSS or just a simple image container */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#f0fdf4]/80 z-10 md:hidden"></div>
                
                <img 
                  src={imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80"} 
                  alt="Save Food Campaign" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}