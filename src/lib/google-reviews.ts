/**
 * Live Google reviews via the Places API (New) — server-only, fetched at most
 * once every ~5 days (next.revalidate) so the salon makes only ~6 Google
 * requests a month — effectively free, and reviews rarely change faster.
 *
 * Setup (when ready):
 *   1. Google Cloud console → enable "Places API (New)" → create an API key.
 *   2. Find the salon's Place ID (https://developers.google.com/maps/documentation/places/web-service/place-id).
 *   3. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (see .env.example).
 *
 * Until both are set, getGoogleReviews() returns null and the Testimonials
 * section shows the curated fallback entries — nothing breaks.
 *
 * Note: the Places API returns at most 5 reviews and cannot sort by newest;
 * this is a Google limitation, not ours. We surface the 5 it gives, best first.
 */
import { cleanEnv } from "./env";

export interface Review {
  quote: string;
  name: string;
  detail: string;
  rating: number;
  /** reviewer's Google avatar, if present */
  avatar?: string;
  /** link to the review on Google, if present */
  href?: string;
}

interface PlacesReview {
  text?: { text?: string };
  originalText?: { text?: string };
  rating?: number;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
  relativePublishTimeDescription?: string;
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
}

export interface GoogleReviewsData {
  reviews: Review[];
  rating: number | null;
  total: number | null;
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = cleanEnv(process.env.GOOGLE_PLACES_API_KEY);
  const placeId = cleanEnv(process.env.GOOGLE_PLACE_ID);
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        // Revalidate every 5 days → ~6 Google requests/month (user cap).
        next: { revalidate: 432_000 },
      },
    );
    if (!res.ok) {
      console.warn(`[eternal] Google reviews fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = (await res.json()) as PlacesResponse;

    const reviews: Review[] = (data.reviews ?? [])
      .map((r): Review | null => {
        const quote = (r.text?.text ?? r.originalText?.text ?? "").trim();
        const name = r.authorAttribution?.displayName?.trim();
        if (!quote || !name) return null;
        return {
          quote,
          name,
          detail: r.relativePublishTimeDescription
            ? `Google review · ${r.relativePublishTimeDescription}`
            : "Google review",
          rating: r.rating ?? 5,
          avatar: r.authorAttribution?.photoUri,
          href: r.authorAttribution?.uri,
        };
      })
      .filter((r): r is Review => r !== null)
      // Homepage testimonials are marketing space: show only strong reviews
      // (the overall rating badge still reflects the true average from Google).
      .filter((r) => r.rating >= 4)
      // Best ratings first (the API can't sort by date anyway).
      .sort((a, b) => b.rating - a.rating);

    if (reviews.length === 0) return null;

    return {
      reviews,
      rating: data.rating ?? null,
      total: data.userRatingCount ?? null,
    };
  } catch (err) {
    console.warn(
      "[eternal] Google reviews unavailable:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
