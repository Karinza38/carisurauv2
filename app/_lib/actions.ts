"use server";

import { db } from "@/db";
import { unstable_cache } from "next/cache";

export async function getAllSurauMasjid() {
  return unstable_cache(
    async () => {
      try {
        const data = await db.query.surauMasjids.findMany({
          with: {
            ratings: true,
            images: true
          },
        });

        // Calculate average rating for each surau/masjid
        const dataWithAverageRating = data.map((surau) => {
          const ratings = surau.ratings;
          const totalRatings = ratings.length;

          // Calculate the sum of all ratings
          const sumRatings = ratings.reduce(
            (sum, rating) => sum + (rating.rating ?? 0),
            0
          );

          // Calculate the average rating
          const averageRating =
            totalRatings > 0 ? sumRatings / totalRatings : 0;

          // Return the surau/masjid data with the average rating
          return {
            ...surau,
            averageRating,
          };
        });

        return {
          data: dataWithAverageRating,
        };
      } catch (err) {
        console.error(err);
        return { data: [] };
      }
    },
    [],
    {
      revalidate: 120,
      tags: ["surauMasjids"],
    }
  )();
}
