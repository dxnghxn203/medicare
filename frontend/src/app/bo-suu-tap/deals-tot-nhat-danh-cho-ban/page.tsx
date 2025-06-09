"use client";
import React from "react";
import ProductsDeals from "@/components/Collection/productsDeals";

const Collection: React.FC = () => {
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14">
        <ProductsDeals />
      </main>
    </div>
  );
};

export default Collection;
