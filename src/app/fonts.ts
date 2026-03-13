import localFont from "next/font/local";

export const chirp = localFont({
  variable: "--font-chirp",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/chirp/chirp-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/chirp/chirp-bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/chirp/chirp-heavy.woff",
      weight: "800",
      style: "normal",
    },
  ],
});
