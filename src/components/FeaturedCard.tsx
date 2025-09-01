import React from "react";
import { Card, CardContent } from "./ui/card";

interface Props {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function FeaturedCard({ title = "Discover Amazing Deals", subtitle = "Find the best restaurant offers and discounts in your city.", imageUrl }: Props) {
  return (
    <section className="mb-2.5">
      <div className="w-full">
        <Card className="bg-gradient-to-r from-orange-100 to-orange-50 border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{title}</h2>
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              </div>
              <div className="w-24">
                <img src={imageUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"} alt="Featured restaurants" className="rounded-lg shadow-lg w-full h-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
