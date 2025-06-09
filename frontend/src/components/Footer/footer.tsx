"use client";

import InfoFooter from "./infoFooter";
import SubscribeNewsletter from "./subscribeNewsletter";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5]">
      <SubscribeNewsletter />
      <InfoFooter />
    </footer>
  );
}
