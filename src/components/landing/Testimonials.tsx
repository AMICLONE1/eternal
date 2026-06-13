import { getGoogleReviews, type Review } from "@/lib/google-reviews";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

/**
 * Server component: pulls live Google reviews when GOOGLE_PLACES_API_KEY +
 * GOOGLE_PLACE_ID are configured, otherwise shows the curated fallback below.
 * The carousel UI itself is the client component.
 */

const CURATED: Review[] = [
  {
    quote:
      "Walked in for a simple haircut, walked out feeling like a new person. The attention to detail here is something else.",
    name: "Rohan K.",
    detail: "Signature Haircut · Google review",
    rating: 5,
  },
  {
    quote:
      "My bridal trial was so thoughtful — they listened more than they talked. On the wedding day everything was exactly right.",
    name: "Sneha P.",
    detail: "Bridal Makeup · Google review",
    rating: 5,
  },
  {
    quote:
      "Finally a salon in Nigdi where men's grooming is taken as seriously as it should be. The royal shave is worth every rupee.",
    name: "Amit D.",
    detail: "Royal Shave · Google review",
    rating: 5,
  },
  {
    quote:
      "Booked online in under a minute, got a confirmation instantly. The keratin treatment has my hair behaving for the first time ever.",
    name: "Priya S.",
    detail: "Keratin Smoothening · Google review",
    rating: 5,
  },
];

export async function Testimonials() {
  const live = await getGoogleReviews();
  if (live) {
    return (
      <TestimonialsCarousel
        reviews={live.reviews}
        source="google"
        rating={live.rating}
        total={live.total}
      />
    );
  }
  return (
    <TestimonialsCarousel reviews={CURATED} source="curated" rating={null} total={null} />
  );
}
