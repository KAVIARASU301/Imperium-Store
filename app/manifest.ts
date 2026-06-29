import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Imperium Store",
    short_name: "Imperium",
    description:
      "Imperium Option Trading Terminal and professional trading software for Indian market traders.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#0b1728",
    icons: [
      {
        src: "/icons/imperium_store_icons/imperium_icon_48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/imperium_store_icons/imperium_icon_64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/imperium_store_icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
