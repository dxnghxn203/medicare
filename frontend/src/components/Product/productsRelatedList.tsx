import React, { use, useEffect } from "react";
import ProductsViewCard from "./productsRelatedCard";
import { useProduct } from "@/hooks/useProduct";
import { FaArrowRightLong } from "react-icons/fa6";

const ProductsRelatedList = ({ product }: any) => {
  const { productRelated, fetchProductRelated } = useProduct();

  useEffect(() => {
    const product_id = product?.product_id;
    if (product_id) {
      fetchProductRelated(product_id);
    }
  }, []);

  return (
    <div className="w-full mt-6">
      <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
        <div className="flex gap-4 text-sm font-semibold ml-auto items-center mt-2">
          <div>Tất cả sản phẩm</div>
          <FaArrowRightLong />
        </div>
      </div>
      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-5 gap-6 max-md:grid-cols-2 w-full">
          {productRelated &&
            productRelated
              .slice(0, 5)
              .map((product: any, index: any) => (
                <ProductsViewCard key={index} product={product} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsRelatedList;
