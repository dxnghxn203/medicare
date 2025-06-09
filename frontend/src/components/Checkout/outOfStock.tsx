import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import React, { useState } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { useToast } from "@/providers/toastProvider";
import SimilarProductsList from "@/components/Cart/similarProductsList";
import { useCart } from "@/hooks/useCart";

const OutOfStock = ({
  products,
  closeDialog,
  onContinue,
}: {
  products: {
    outOfStockProducts: any[];
    availableProducts: any[];
  };
  closeDialog: (isOpen: boolean) => void;
  onContinue: () => void;
}) => {
  const { outOfStockProducts, availableProducts } = products;
  const toast = useToast();
  const [isSimilarProductsOpen, setIsSimilarProductsOpen] = useState(false);
  const [currentProductForSimilar, setCurrentProductForSimilar] =
    useState<any>(null);

  const handleShowSimilarProducts = (product: any) => {
    setCurrentProductForSimilar(product);
    setIsSimilarProductsOpen(true);
  };

  const calculateTotalPrice = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateTotalOriginalPrice = (
    original_price: number,
    quantity: number
  ) => {
    return original_price * quantity;
  };

  const renderProductItem = (
    product: any,
    index: number,
    isLast: boolean,
    isAvailable: boolean = false
  ) => (
    <div
      key={`${product?.product_id}-${product?.price_id}-${index}`}
      className={`flex items-center justify-between py-3 text-sm ${
        !isLast ? "border-b border-gray-200" : ""
      }`}
    >
      <div className="flex items-center w-[40%]">
        <div className="relative min-w-[60px] h-[60px]">
          <Image
            src={product?.image || "/placeholder-product.png"}
            alt={product?.product_name || "Product Image"}
            fill
            className="object-contain rounded-md border border-stone-300 p-1"
          />
        </div>
        <div className="ml-3 flex flex-col">
          <span className="line-clamp-2 overflow-hidden text-ellipsis font-medium">
            {product?.product_name}
          </span>
          {isAvailable ? (
            <span className="text-green-600 text-xs font-medium mt-1">
              Còn hàng
            </span>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-red-500 text-xs font-medium">Hết hàng</span>
              <button
                onClick={() => handleShowSimilarProducts(product)}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <BsArrowRepeat className="mr-1" size={12} />
                Sản phẩm tương tự
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-[15%] text-center">
        <div className="flex flex-col">
          <span className="font-medium text-blue-600">
            {product?.price?.toLocaleString("vi-VN")}đ
          </span>
          {product?.original_price > 0 &&
            product?.original_price !== product?.price && (
              <span className="text-xs text-gray-500 line-through">
                {product?.original_price?.toLocaleString("vi-VN")}đ
              </span>
            )}
        </div>
      </div>

      <div className="w-[15%] text-center">
        <span className="font-medium">{product?.quantity}</span>
        <span className="text-gray-500 ml-1">{product?.unit}</span>
      </div>

      <div className="w-[20%] text-center">
        <div className="flex flex-col">
          <span className="font-medium text-blue-600">
            {calculateTotalPrice(
              product?.price,
              product?.quantity
            ).toLocaleString("vi-VN")}
            đ
          </span>
          {product?.original_price > 0 &&
            product?.original_price !== product?.price && (
              <span className="text-xs text-gray-500 line-through">
                {calculateTotalOriginalPrice(
                  product?.original_price,
                  product?.quantity
                ).toLocaleString("vi-VN")}
                đ
              </span>
            )}
        </div>
      </div>
    </div>
  );

  const renderTableHeader = () => (
    <div className="flex items-center justify-between py-2 text-xs text-gray-600 border-b border-gray-200 font-medium">
      <div className="w-[40%]">Sản phẩm</div>
      <div className="w-[15%] text-center">Đơn giá</div>
      <div className="w-[15%] text-center">Số lượng</div>
      <div className="w-[20%] text-center">Thành tiền</div>
    </div>
  );

  const { addProductTocart, getProductFromCart, removeProductFromCart } =
    useCart();

  const getCart = () => {
    getProductFromCart(
      () => {},
      (error: string) => {}
    );
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto p-4">
      {isSimilarProductsOpen && currentProductForSimilar && (
        <SimilarProductsList
          product={currentProductForSimilar}
          onClose={() => setIsSimilarProductsOpen(false)}
          addToCart={(productId, priceId, quantity) => {
            addProductTocart(
              productId,
              priceId,
              quantity,
              () => {
                toast.showToast("Thêm vào giỏ hàng thành công", "success");
                getCart();
                setIsSimilarProductsOpen(false);
              },
              (error: string) => {
                toast.showToast("Thêm vào giỏ hàng thất bại", "error");
              }
            );
          }}
        />
      )}

      <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl relative my-10 transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-base font-semibold text-red-600">
            SẢN PHẨM KHÔNG ĐỦ HÀNG
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => closeDialog(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden transition-all duration-300">
          <div className="flex flex-col px-4 py-3">
            {outOfStockProducts && outOfStockProducts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Các sản phẩm sau đã hết hàng hoặc không đủ số lượng:
                </p>

                {renderTableHeader()}

                <div className="max-h-52 overflow-y-auto pr-1 mb-2">
                  {outOfStockProducts.map((product: any, index: number) =>
                    renderProductItem(
                      product,
                      index,
                      index === outOfStockProducts.length - 1
                    )
                  )}
                </div>

                {/* Remove the general "Xem sản phẩm tương tự" button since we now have individual buttons */}
              </div>
            )}

            {availableProducts && availableProducts.length > 0 && (
              <>
                <hr className="my-3 border-gray-200" />
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Bạn có muốn tiếp tục đặt hàng với các sản phẩm còn lại không?
                </p>

                {renderTableHeader()}

                <div className="max-h-52 overflow-y-auto pr-1 mb-3">
                  {availableProducts.map((product: any, index: number) =>
                    renderProductItem(
                      product,
                      index,
                      index === availableProducts.length - 1,
                      true
                    )
                  )}
                </div>

                <div className="flex justify-end items-center mb-3 text-sm">
                  <div className="font-medium mr-2">Tổng tiền:</div>
                  <div className="text-blue-600 font-bold">
                    {availableProducts
                      .reduce(
                        (total, product) =>
                          total +
                          calculateTotalPrice(
                            product?.price,
                            product?.quantity
                          ),
                        0
                      )
                      .toLocaleString("vi-VN")}
                    đ
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 pb-2 border-t border-gray-200">
                  <button
                    onClick={() => closeDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => {
                      onContinue();
                      // closeDialog(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Tiếp tục đặt hàng
                  </button>
                </div>
              </>
            )}

            {(!availableProducts || availableProducts.length === 0) && (
              <div className="flex justify-end pt-3 pb-2 border-t border-gray-200">
                <button
                  onClick={() => closeDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfStock;
