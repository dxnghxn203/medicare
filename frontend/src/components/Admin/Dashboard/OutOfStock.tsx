// components/LatestOrders.jsx
import React, { useEffect, useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { MdMoreHoriz } from "react-icons/md";
import { IoImage } from "react-icons/io5";
import Image from "next/image";

type ProductLowStock = {
  product_id: string;
  product_name: string;
  images_primary: string;
  unit: string;
  sell: number;
  delivery: number;
  inventory: number;
};

export default function LatestOrders() {
  const { fetchGetProducLowStock, productLowStock } = useProduct();
  const [productLowStockData, setProductLowStockData] = useState<ProductLowStock[]>([]);

  useEffect(() => {
    fetchGetProducLowStock(
      () => {},
      () => {}
    );
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Sản phẩm sắp hết hàng</h2>
        <a href="/san-pham/quan-ly-san-pham" className="text-blue-500 text-sm">
          Xem tất cả
        </a>
      </div>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                {/* <th className="py-4 px-2 text-center w-[130px]">Hình ảnh</th> */}
                <th className="py-4 px-2 text-center">Tên sản phẩm</th>
                <th className="py-4 px-2 text-center">Mã sản phẩm</th>
                <th className="py-4 px-2 text-center">Mã đơn vị</th>
                <th className="py-4 px-2 text-center">Đơn vị</th>
                <th className="py-4 px-2 text-center">Kho</th>
                <th className="py-4 px-2 text-center">Bán</th>
                <th className="py-4 px-2 text-center">Vận chuyển</th>
                <th className="py-4 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {productLowStock && productLowStock.length > 0 ? (
                productLowStock.map((product: any, index: number) => (
                  <tr
                    key={product.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== productLowStock.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    {/* <td className="py-4 px-4 text-center">
                      {product.images_primary ? (
                        <div className="relative h-16 w-16 mx-auto">
                          <Image
                            src={product.images_primary}
                            alt={product.product_name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded mx-auto">
                          <IoImage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </td> */}
                    <td className="py-4 px-2 text-center font-medium">
                      {product.product_name}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.product_id}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.prices_id}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.unit}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.inventory}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.sell}
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      {product.delivery}
                    </td>

                    {/* <td className="py-4 px-2 text-center">
                      <div className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer">
                        <MdMoreHoriz className="text-xl" />
                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
