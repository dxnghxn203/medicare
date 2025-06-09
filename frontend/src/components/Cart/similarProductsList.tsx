import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { getSimilarProducts } from "@/services/productService";
import ProductCardInCart from "@/components/Cart/productCardInCart";
import clsx from "clsx";
import { BsCart } from "react-icons/bs";

const SimilarProductsList = ({
  product,
  onClose,
  addToCart,
}: {
  product: any;
  onClose: () => void;
  addToCart: (productId: string, priceId: string, quantity: number) => void;
}) => {
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPrices, setSelectedPrices] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const getProductId = (productData: any) => {
    if (productData?.product && productData.product.product_id) {
      return productData.product.product_id;
    }
    if (productData?.product_id) {
      return productData.product_id;
    }

    console.error("Invalid product structure:", productData);
    return null;
  };

  useEffect(() => {
    fetchSimilarProducts();
  }, [currentPage]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);

      const productId = getProductId(product);
      if (!productId) {
        throw new Error("Invalid product ID");
      }

      const response = await getSimilarProducts(
        productId,
        pageSize,
        currentPage
      );

      if (response.products && Array.isArray(response.products)) {
        setSimilarProducts(response.products);
        setTotalProducts(response.total || 0);

        const initialPrices: { [key: string]: string } = {};
        const initialQuantities: { [key: string]: number } = {};

        response.products.forEach((product: any) => {
          if (product.prices && product.prices.length > 0) {
            initialPrices[product.product_id] = product.prices[0].price_id;
            initialQuantities[product.product_id] = 1;
          }
        });

        setSelectedPrices((prev) => ({ ...prev, ...initialPrices }));
        setSelectedQuantities((prev) => ({ ...prev, ...initialQuantities }));
      } else {
        console.error("Invalid response format:", response);
        setSimilarProducts([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
      setLoading(false);
      setSimilarProducts([]);
    }
  };

  // Handle unit change
  const handleUnitChange = (productId: string, priceId: string) => {
    setSelectedPrices((prev) => ({ ...prev, [productId]: priceId }));
  };

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    addToCart(
      productId,
      selectedPrices[productId],
      selectedQuantities[productId] || 1
    );
  };

  // Pagination handling
  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Current date and user information as requested
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-lg font-semibold">Sản phẩm tương tự</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow p-5 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : similarProducts.length > 0 ? (
            <>
              {/* Optimized grid to show more products while using ProductCardInCart */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
                {similarProducts.map((product) => (
                  <div key={product.product_id} className="h-full">
                    <ProductCardInCart
                      product={product}
                      selectedUnit={
                        selectedPrices[product.product_id] ||
                        (product.prices && product.prices[0]?.price_id)
                      }
                      onUnitChange={(priceId) =>
                        handleUnitChange(product.product_id, priceId)
                      }
                      onAddToCart={() => handleAddToCart(product.product_id)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                  >
                    &laquo;
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageToShow}
                        onClick={() => handlePageChange(pageToShow)}
                        className={clsx(
                          "px-2 py-1 rounded-md text-sm",
                          currentPage === pageToShow
                            ? "bg-[#0053E2] text-white"
                            : "border border-gray-300 hover:bg-gray-50 transition-colors"
                        )}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-5">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Không tìm thấy sản phẩm tương tự
              </h3>
              <p className="text-gray-500 max-w-md">
                Hiện tại không có sản phẩm tương tự nào được tìm thấy. Vui lòng
                thử lại sau hoặc tìm kiếm sản phẩm khác.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarProductsList;
