// components/CartTableMobile.tsx
import Image from "next/image";
import { ImBin } from "react-icons/im";

export default function CartTableMobile({
  cart,
  selectedProducts,
  handleSelectAll,
  handleSelectProduct,
  handleDeleteClick,
  handleShowSimilarProducts,
  renderOriginalPrice,
  renderQuantityControls,
  renderUnit,
  renderTotalPrice,
  loadingGetCart,
}: any) {
  return (
    <div className="block md:hidden">
      <div className="px-4 py-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="select-all-mobile"
          checked={cart && selectedProducts.length === cart?.length}
          onChange={handleSelectAll}
        />
        <label htmlFor="select-all-mobile" className="cursor-pointer text-sm">
          Chọn tất cả ({selectedProducts.length}/{cart?.length})
        </label>
      </div>

      <div className={loadingGetCart ? "opacity-50 pointer-events-none" : ""}>
        {cart?.map((product: any, index: number) => (
          <div
            key={`${product.product.product_id}-${product.price_id}`}
            className={`p-4 ${
              index === cart.length - 1 ? "" : "border-b border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-2"
                checked={selectedProducts.some(
                  (item: any) =>
                    item.product_id === product.product.product_id &&
                    item.price_id === product.price_id
                )}
                onChange={() =>
                  handleSelectProduct(
                    product.product.product_id,
                    product.price_id
                  )
                }
              />

              {/* Ảnh sản phẩm */}
              <Image
                src={product?.product?.images_primary}
                alt={product.product?.product_name || "Product"}
                width={60}
                height={60}
                className="border border-gray-300 rounded-lg shrink-0 p-1"
              />

              {/* Nội dung bên phải ảnh */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium line-clamp-2">
                    {product?.product?.name_primary}
                  </span>
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        product.product.product_id,
                        product.price_id
                      )
                    }
                    className="text-gray-500 hover:text-red-600"
                  >
                    <ImBin size={16} />
                  </button>
                </div>

                {/* Giá */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm text-blue-600 font-semibold">
                    {renderTotalPrice(product, product.price_id)}
                  </span>
                </div>

                {/* Số lượng + đơn vị */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  {renderQuantityControls(product, product.price_id)}
                  {renderUnit(product, product.price_id)}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleShowSimilarProducts(
                  product.product.product_id,
                  product.price_id
                )
              }
              className="text-blue-600 hover:underline mt-2 text-sm"
            >
              Tìm sản phẩm tương tự
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
