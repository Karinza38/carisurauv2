"use client";

import { MapPin, Star, Heart } from "lucide-react";
import Image from "next/image";
import { getAllSurauMasjid } from "../_lib/actions";
import { useState } from "react";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function SurauMasjidCardInfo({
  name,
  star,
  location,
  image,
}: {
  name: string;
  star: number;
  location: string;
  image?: string;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="grid grid-cols-3">
      <div className="flex items-center justify-center">
        {/* Image with fixed size and error handling */}
        <div className="w-24 h-24 relative rounded-xl overflow-hidden">
          {imageError || !image ? (
            <Image
              src="/assets/logo-purple-resized.png" // Path to your default image
              alt="Default Image"
              fill // Fill the parent container
              className="object-cover" // Ensure the image covers the container
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill // Fill the parent container
              className="object-cover" // Ensure the image covers the container
              onError={() => setImageError(true)} // Handle image loading errors
            />
          )}
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex flex-col gap-1">
          <div>{name}</div>
          <div className="flex flex-row items-center gap-1 text-sm">
            <Star size={12} className="" fill="black" />
            {star}
          </div>
          <div className="text-secondary-foreground flex flex-row gap-2 items-center text-xs">
            <MapPin size={12} />
            {location}
          </div>
        </div>
      </div>
    </div>
  );
}

function SurauMasjidCardDesktop({
  name,
  star,
  location,
  image,
  isQiblatCertified,
  isPerformingJumaatPrayer,
}: {
  name: string;
  star: number;
  location: string;
  image?: string;
  isQiblatCertified: boolean;
  isPerformingJumaatPrayer: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  return (
    <Card className="w-full max-w-md overflow-hidden border-none shadow-none">
      {/* Image Container */}
      <div className="relative">
        <div className="w-full h-64 relative rounded-xl overflow-hidden">
          {imageError || !image ? (
            <Image
              src="/assets/logo-1.png" // Path to your default image
              alt="Default Image"
              fill // Fill the parent container
              className="object-cover" // Ensure the image covers the container
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill // Fill the parent container
              className="object-cover" // Ensure the image covers the container
              onError={() => setImageError(true)} // Handle image loading errors
            />
          )}
        </div>
        {/* Badge Container */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isQiblatCertified ? (
            <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100">
              Qiblat Verified
            </Badge>
          ) : null}

          {isPerformingJumaatPrayer ? (
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
              Solat Jumaat
            </Badge>
          ) : null}
        </div>
        {/* Heart Icon */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className=" font-semibold truncate w-[200px]">{name}</h2>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-current text-yellow-400" />
            <span className="font-semibold">{star}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
interface SurauAndMasjidListProps {
  promises: Promise<[Awaited<ReturnType<typeof getAllSurauMasjid>>]>;
}

export function SurauAndMasjidList({ promises }: SurauAndMasjidListProps) {
  const [{ data }] = React.use(promises);

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="pt-4 px-4">
        <div>
          <div className="font-bold text-xl">All</div>
          <div className="flex gap-4 flex-col pt-4">
            {data.map((sm, idx) => (
              <Link href={`/surau-masjid/${sm.uniqueName}`} key={sm.id}>
                <SurauMasjidCardInfo
                  key={idx}
                  name={sm.name}
                  star={sm.averageRating}
                  location={`${sm.district}, ${sm.state}`}
                  image={
                    sm.images.length > 0 && sm.images[0].path
                      ? sm.images[0].path
                      : undefined
                  }
                />
              </Link>
            ))}
          </div>
        </div>

        {/* <div className="pt-6">
          <div className="font-bold text-xl">Recently Added</div>
          <div className="flex gap-4 flex-col pt-4">
            {surauMasjid.map((sm, idx) => (
              <SurauMasjidCardInfo
                key={idx}
                name={sm.name}
                star={sm.star}
                location={sm.location}
                image={sm.image}
              />
            ))}
          </div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-4 gap-2">
        {data.map((sm, idx) => (
          <Link href={`/surau-masjid/${sm.uniqueName}`} key={sm.id}>
            <SurauMasjidCardDesktop
              key={idx}
              name={sm.name}
              star={sm.averageRating}
              location={`${sm.district}, ${sm.state}`}
              isPerformingJumaatPrayer={sm.isPerformingJumaatPrayer ?? false}
              isQiblatCertified={sm.isQiblatCertified ?? false}
              image={
                sm.images.length > 0 && sm.images[0].path
                  ? sm.images[0].path
                  : undefined
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
