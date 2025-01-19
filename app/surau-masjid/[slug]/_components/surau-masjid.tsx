import React from "react";
import { Heart, MapPin, Share2, Star } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Rating, User } from "@/db/schema";
import getSurauMasjid from "../_lib/actions";

interface SurauMasjidProps {
  promises: Promise<[Awaited<ReturnType<typeof getSurauMasjid>>]>;
}

const ReviewStars = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({
  review,
  user,
}: {
  review: Rating;
  user: User | null;
}) => (
  <div className="py-6 border-b border-gray-200 last:border-0">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={"/assets/logo-1.png"}
          alt={user?.name || "User"}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold">{user?.name || "Anonymous"}</h3>
        <ReviewStars rating={review.rating ?? 0} />
      </div>
    </div>
    <p className="text-gray-600 mb-4">{review.remarks}</p>
  </div>
);

export function SurauMasjid({ promises }: SurauMasjidProps) {
  const [{ data }] = React.use(promises);

  return (
    <>
      <header className="flex justify-between h-16 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="px-4">
          <Image src="/assets/logo-1.png" width={24} height={24} alt="logo 1" />
        </div>
      </header>

      <div className="max-w-xl bg-white rounded-lg shadow">
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-2">{data?.name ?? ""}</h1>

          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="">
              {data?.averageRating === 0
                ? "No ratings yet"
                : data?.averageRating}
            </span>
          </div>

          <div className="flex gap-4 mb-4">
            <button className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5" />
              <span>Save as favourite</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          <Carousel className="mb-4">
            <CarouselContent>
              {data?.images.map((image, index) => (
                <CarouselItem key={index} className="h-64 w-full relative">
                  <Image
                    src={image.path!}
                    alt={`Masjid view ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded">
                    {index + 1}/{data.images.length}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="flex flex-wrap gap-2 mb-6">
            {data?.isQiblatCertified && (
              <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100">
                Qiblat Verified
              </Badge>
            )}
            {data?.isPerformingJumaatPrayer && (
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
                Solat Jumaat
              </Badge>
            )}
          </div>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Direction</h2>
            <p className="text-gray-600 mb-2">{data?.directionDescription}</p>
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="w-5 h-5" />
              <span>{data?.name}</span>
            </div>
          </section>

          <Separator />

          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <button className="text-blue-600">Write a review</button>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="">
                {" "}
                {data?.averageRating === 0
                  ? "No ratings yet"
                  : data?.averageRating}
              </span>
            </div>
          </section>

          <div className="divide-y divide-gray-200">
            {data?.ratings.length === 0 ? (
              <div className="flex items-center justify-center flex-col">
                <Image
                  src={"/assets/no-message-placeholder.png"}
                  alt="No reviews"
                  height={114}
                  width={114}
                  className="text-center"
                />
                <div className="text-gray-500">
                    Write a review
                </div>
              </div>
            ) : (
              <>
                {data?.ratings?.map((rating) => (
                  <ReviewCard
                    key={rating.id}
                    review={rating}
                    user={rating.user}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
