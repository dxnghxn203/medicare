"use client";
import ProductCatalog from "../components/Home/productCatalog";
import BrandList from "@/components/BrandList/brandList";
import ProductDealsList from "@/components/Product/productDealsList";
import IntroMedicare from "../components/Home/introMedicare";
import HealthCorner from "../components/Home/healthCorner";
import SanDealHeader from "@/components/Product/dealProduct";
import ProductList from "@/components/Product/productList";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center pb-12 bg-white pt-[80px] p-5 md:p-[50px]">
        <main className="flex flex-col space-y-8">
          <ProductCatalog />
          <SanDealHeader />
          <div className="self-start text-2xl font-extrabold text-black">
            Sản phẩm bán chạy
          </div>
          <ProductList />
          <div className="self-start text-2xl font-extrabold text-black">
            Thương hiệu nổi bật
          </div>
          <BrandList />
          <div className="self-start text-2xl font-extrabold text-black">
            Deals tốt nhất hôm nay dành <br />
            cho bạn!
          </div>
          <ProductDealsList />
        </main>
        <IntroMedicare />
        <div className="self-start text-2xl font-extrabold text-black">
          Góc sức khỏe
        </div>
        <HealthCorner />
      </div>
    </>
  );
}
