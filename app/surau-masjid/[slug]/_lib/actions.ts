"use server";

import { db } from "@/db";
import { surauMasjids } from "@/db/schema";
import { handleApiRequest } from "@/helper";
import { eq } from "drizzle-orm";

export default async function getSurauMasjid(uniqueName: string) {
  return handleApiRequest(async () => {
    const surauMasjid = await db.query.surauMasjids.findFirst({
      where: eq(surauMasjids.uniqueName, uniqueName),
      with: {
        ratings: {
          with: {
            user: true,
          },
        },
        images: true,
        user: true,
      },
    });

    if (surauMasjid) {
      const ratings = surauMasjid.ratings;
      const totalRatings = ratings.length;

      const sumRatings = ratings.reduce(
        (sum, rating) => sum + (rating.rating ?? 0),
        0
      );

      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      return { ...surauMasjid, averageRating };
    }
  });
}
