import { useEffect } from "react";
import SmoothScroll from "@/components/shared/SmoothScroll";
import RevealProvider from "@/components/shared/RevealProvider";
import "@/styles/globals.css";

export default function ProductLayout({ children }) {
  useEffect(() => {
    // Switch to light theme while a product page is mounted.
    // inline styles beat any CSS rule, so this safely overrides
    // the dark defaults set in App.css without modifying either file.
    document.body.style.setProperty("background", "#FCFCFC");
    document.body.style.setProperty("color", "#171717");
    document.documentElement.style.setProperty("background", "#FCFCFC");

    return () => {
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("color");
      document.documentElement.style.removeProperty("background");
    };
  }, []);

  return (
    <>
      <SmoothScroll />
      <RevealProvider />
      {children}
    </>
  );
}
