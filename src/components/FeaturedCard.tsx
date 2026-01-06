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
    <section className="mb-3 w-full">
      <div 
        onClick={onTextClick} 
        className="w-full cursor-pointer group transition-transform hover:-translate-y-1 duration-300"
      >
        {/* 
           HEIGHT: Reduced to min-h-[128px] (Standard h-32 size)
           This keeps it compact while allowing slight expansion if text wraps
        */}
        <Card className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-green-200 overflow-hidden h-auto min-h-[128px] md:h-36 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0 h-full">
            <div className="flex flex-row h-full relative items-stretch">
              
              {/* --- LEFT SIDE: TEXT CONTENT --- */}
              {/* Reduced padding to p-3 for mobile to save space */}
              <div className="flex-1 p-3 md:p-5 flex flex-col justify-between min-w-0">
                
                <div>
                  {/* Label: Smaller text and padding */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <Leaf size={10} className="text-green-600 flex-shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      Eco Initiative
                    </span>
                  </div>

                  {/* Title: Reduced to text-lg for mobile */}
                  <h2 className="text-lg md:text-2xl font-serif font-black text-green-900 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                    {title}
                  </h2>
                  
                  {/* Subtitle: Reduced to text-[10px] */}
                  <p className="text-green-800/80 text-[10px] md:text-xs line-clamp-2 leading-snug font-medium">
                    {subtitle}
                  </p>
                </div>

                {/* Footer Link: Compacted size and margin */}
                <div className="mt-1.5 flex items-center gap-1 text-[10px] md:text-xs font-bold text-orange-600 transition-all transform 
                  opacity-100 translate-x-0 
                  md:opacity-0 md:translate-x-[-5px] md:group-hover:opacity-100 md:group-hover:translate-x-0"
                >
                   Read our story <ArrowRight size={12} />
                </div>
              </div>

              {/* --- RIGHT SIDE: IMAGE --- */}
              {/* Reduced width slightly on mobile (w-28) to give text more room */}
              <div className="w-28 md:w-48 relative self-stretch flex-shrink-0">
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