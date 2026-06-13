import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eternal — For Him & Her",
    short_name: "Eternal",
    description:
      "Premium unisex salon in Pradhikaran, Nigdi, Pune. Book your chair online.",
    start_url: "/",
    display: "browser",
    background_color: "#FBF8F3",
    theme_color: "#7C4FB5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
