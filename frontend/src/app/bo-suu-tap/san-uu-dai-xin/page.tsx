"use client";
import PreferentialProduct from "@/components/Collection/preferentialProducts";
import React from "react";

const Collection: React.FC = () => {
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14">
        <PreferentialProduct />
      </main>
    </div>
  );
};

export default Collection;
