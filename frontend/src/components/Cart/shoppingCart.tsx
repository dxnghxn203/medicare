"use client";
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState,} from "react";
import DeleteProductDialog from "@/components/Dialog/deleteProductDialog";
import OrderSummary from "@/components/Cart/orderSumary";
import SimilarProductsList from "@/components/Cart/similarProductsList";
import {useCart} from "@/hooks/useCart";
import {useToast} from "@/providers/toastProvider";
import {getPriceFromProduct} from "@/utils/price";
import {getAvailableProduct} from "@/services/productService";
import clsx from "clsx";
import CartTableMobile from "./cartTableMobile";
import CartTableDesktop from "./cartTableDesktop";
import {RiSearch2Line} from "react-icons/ri";

const ShoppingCart = forwardRef(
    (
        {
            cart,
            setIsCheckout,
            setProductForCheckOut,
            setPriceOrder,
            setVouchers,
            shippingFee,
        }: any,
        ref
    ) => {
        const [selectedProducts, setSelectedProducts] = useState<
            { product_id: string; price_id: string }[]
        >([]);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const [isSimilarProductsOpen, setIsSimilarProductsOpen] = useState(false);
        const [currentProductForSimilar, setCurrentProductForSimilar] =
            useState<any>(null);
        const [openDropdowns, setOpenDropdowns] = useState<{
            [key: string]: boolean;
        }>({});
        const [availableQuantities, setAvailableQuantities] = useState<{
            [key: string]: number | null;
        }>({});
        const [loadingQuantities, setLoadingQuantities] = useState<{
            [key: string]: boolean;
        }>({});

        const [selectedProductId, setSelectedProductId] = useState<string | null>(
            null
        );
        const [vouchersCart, setVouchersCart] = useState<any>({});

        const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
        const [inputQuantities, setInputQuantities] = useState<{
            [key: string]: number;
        }>({});
        const {addProductTocart, getProductFromCart, removeProductFromCart} =
            useCart();
        const toast = useToast();
        const [loadingGetCart, setLoadingGetCart] = useState(false);
        const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
        const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

        useImperativeHandle(ref, () => ({
            handleShowSimilarProducts: (product: any) => {
                setCurrentProductForSimilar(product);
                setIsSimilarProductsOpen(true);
            },
        }));

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
                    if (ref && !ref.contains(event.target as Node)) {
                        setOpenDropdowns((prev) => ({...prev, [key]: false}));
                    }
                });
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        useEffect(() => {
            if (cart && cart.length > 0) {
                cart.forEach((item: any) => {
                    fetchAvailableQuantity(item.product.product_id, item.price_id);
                });
            }
        }, [cart]);

        const changeSelectVouhcher = (voucher: any) => {
            setVouchersCart(voucher);
            setVouchers(voucher);
        };

        const fetchAvailableQuantity = async (
            productId: string,
            priceId: string
        ) => {
            const key = `${productId}-${priceId}`;

            if (loadingQuantities[key]) return;

            setLoadingQuantities((prev) => ({...prev, [key]: true}));

            try {
                const response = await getAvailableProduct(productId, priceId);

                if (response.status_code === 200 && response.data !== null) {
                    setAvailableQuantities((prev) => ({...prev, [key]: response.data}));
                } else {
                    setAvailableQuantities((prev) => ({...prev, [key]: null}));
                }
            } catch (error) {
                console.error("Error fetching available quantity:", error);
                setAvailableQuantities((prev) => ({...prev, [key]: null}));
            } finally {
                setLoadingQuantities((prev) => ({...prev, [key]: false}));
            }
        };

        const handleDebouncedQuantityChange = (
            productId: string,
            priceId: string,
            newQuantity: number,
            oldQuantity: number
        ) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                if (newQuantity !== oldQuantity) {
                    handleQuantityChange(productId, priceId, newQuantity - oldQuantity);
                }
            }, 500);
        };

        const getCart = () => {
            setLoadingGetCart(true);
            getProductFromCart(
                () => {
                    setLoadingGetCart(false);
                },
                (error: string) => {
                    setLoadingGetCart(false);
                }
            );
        };
        const getPrice = (product: any, price_id: any) => {
            return getPriceFromProduct(product, price_id);
        };

        const getProductForCheckOut = () => {
            const selectedProductsData = cart.filter((item: any) =>
                selectedProducts.some(
                    (selected) =>
                        selected.product_id === item.product.product_id &&
                        selected.price_id === item.price_id
                )
            );

            let products: any[] = [];
            selectedProductsData.forEach((item: any) => {
                const price = getPrice(item.product, item.price_id);
                if (price) {
                    products.push({
                        product_id: item.product.product_id,
                        product_name: item.product.product_name,
                        image: item.product.images_primary,
                        price_id: item.price_id,
                        quantity: item.quantity,
                        price: price.price,
                        unit_price: price.unit_price,
                        unit: price.unit,
                        original_price: price.original_price,
                    });
                }
            });
            return products;
        };

        const calculateCartTotals = useMemo(() => {
            let total_original_price = 0;
            let total_price = 0;
            let total_discount = 0;
            selectedProducts.forEach((selected) => {
                const cartItem = cart.find(
                    (item: any) =>
                        item.product.product_id === selected.product_id &&
                        item.price_id === selected.price_id
                );

                if (cartItem) {
                    const priceDetail = cartItem.product.prices.find(
                        (price: any) => price.price_id === cartItem.price_id
                    );

                    if (priceDetail) {
                        const quantity = cartItem.quantity;
                        total_price += priceDetail.price * quantity;
                        total_original_price += priceDetail.original_price * quantity;
                        total_discount +=
                            (priceDetail.original_price - priceDetail.price) * quantity;
                    }
                }
            });

            setPriceOrder({
                total_original_price,
                total_price,
                total_discount,
            });

            return {
                total_original_price,
                total_price,
                total_discount,
            };
        }, [selectedProducts, cart]);

        const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                const allProducts = cart.map((item: any) => ({
                    product_id: item.product.product_id,
                    price_id: item.price_id,
                }));
                setSelectedProducts(allProducts);
            } else {
                setSelectedProducts([]);
            }
        };

        const handleSelectProduct = (product_id: string, price_id: string) => {
            setSelectedProducts((prevSelected) => {
                const exists = prevSelected.some(
                    (item) => item.product_id === product_id && item.price_id === price_id
                );

                if (exists) {
                    return prevSelected.filter(
                        (item) =>
                            !(item.product_id === product_id && item.price_id === price_id)
                    );
                } else {
                    return [...prevSelected, {product_id, price_id}];
                }
            });
        };

        const handleDeleteClick = (product_id: string, price_id: string) => {
            setSelectedProductId(product_id);
            setSelectedPriceId(price_id);
            setIsDeleteDialogOpen(true);
        };

        const handleCloseDialog = () => {
            setIsDeleteDialogOpen(false);
            setSelectedProductId(null);
            setSelectedPriceId(null);
        };

        const handleShowSimilarProducts = (product: any) => {
            setCurrentProductForSimilar(product);
            setIsSimilarProductsOpen(true);
        };

        const handleQuantityChange = (
            id: string,
            price_id: string,
            change: number
        ) => {
            addProductTocart(
                id,
                price_id,
                change,
                () => {
                    // toast.showToast("Cập nhật thành công", "success");
                    getCart();
                },
                (error: string) => {
                    toast.showToast("Cập nhật thất bại", "error");
                }
            );
        };

        const handleUnitChange = (
            id: string,
            newUnit: string,
            quantity: any,
            old_unit: string
        ) => {
            fetchAvailableQuantity(id, newUnit);

            addProductTocart(
                id,
                newUnit,
                quantity,
                () => {
                    removeProductFromCart(
                        id,
                        old_unit,
                        () => {
                            toast.showToast("Cập nhật thành công", "success");
                            getCart();
                        },
                        (error: string) => {
                            console.log(error);
                        }
                    );
                },
                (error: string) => {
                    console.log(error);
                    toast.showToast("Cập nhật thất bại", "error");
                }
            );
        };

        const checkout = () => {
            setIsCheckout(true);
        };

        useEffect(() => {
            if (selectedProducts) {
                setProductForCheckOut(getProductForCheckOut());
            }
        }, [selectedProducts]);

        const calculateTotalPrice = (price: number, quantity: number) => {
            return price * quantity;
        };

        const toggleDropdown = (productId: string) => {
            setOpenDropdowns((prev) => ({
                ...prev,
                [productId]: !prev[productId],
            }));
        };

        const renderOriginalPrice = (product: any, price_id: any) => {
            const price = getPrice(product.product, price_id);

            return (
                <>
                    <div className="text-center flex flex-col items-center ">
            <span className="text-lg font-semibold text-[#0053E2]">
              {price?.price.toLocaleString("vi-VN")}đ
            </span>
                        {price.original_price !== price.price &&
                            price.original_price > 0 && (
                                <span className="text-sm text-gray-500 line-through font-semibold">
                  {price?.original_price.toLocaleString("vi-VN")}đ
                </span>
                            )}
                    </div>
                </>
            );
        };
        const renderQuantityControls = (product: any, price_id: any) => {
            const productId = product.product.product_id;
            const dropdownKey = `${productId}-${price_id}`;
            const available = availableQuantities[dropdownKey];
            const maxQuantity =
                available !== undefined && available !== null
                    ? Math.min(50, available)
                    : 50;

            return (
                <div className="text-center flex items-center justify-center gap-2">
                    {/* Nút - */}
                    <button
                        onClick={() => {
                            if (product.quantity > 1) {
                                handleQuantityChange(productId, price_id, -1);
                            }
                        }}
                        className="px-2 py-1 border rounded disabled:cursor-not-allowed"
                        disabled={product.quantity === 1 || maxQuantity <= 1}
                    >
                        -
                    </button>

                    {/* Input số lượng */}
                    <input
                        type="number"
                        value={inputQuantities[productId] ?? product.quantity}
                        onChange={(e) => {
                            let value = parseInt(e.target.value);
                            if (isNaN(value) || value <= 0) value = 1;
                            if (value > maxQuantity) value = maxQuantity;

                            setInputQuantities((prev) => ({
                                ...prev,
                                [productId]: value,
                            }));

                            handleDebouncedQuantityChange(
                                productId,
                                price_id,
                                value,
                                product.quantity
                            );
                        }}
                        className="w-12 text-center border rounded px-2 py-1"
                    />

                    {/* Nút + */}
                    <button
                        onClick={() => {
                            if (product.quantity < maxQuantity) {
                                handleQuantityChange(productId, price_id, 1);
                            }
                        }}
                        className="px-2 py-1 border rounded"
                        disabled={product.quantity >= maxQuantity || maxQuantity <= 1}
                    >
                        +
                    </button>
                </div>
            );
        };

        const renderSimilarProductsButton = (product: any, price_id: any) => {
            // const price = getPrice(product.product, price_id);
            const productId = product.product.product_id;
            const dropdownKey = `${productId}-${price_id}`;
            const availableQuantity = availableQuantities[dropdownKey];
            const isLoadingQuantity = loadingQuantities[dropdownKey];
            if (availableQuantity && availableQuantity <= 10 && availableQuantity > 0 && !isLoadingQuantity) {
                return (
                    <button
                        title="Tìm sản phẩm tương tự"
                        onClick={() => handleShowSimilarProducts(product)}
                        className="text-sm text-blue-600 font-medium flex hover:text-blue-700"
                    >
                        <RiSearch2Line className="text-2xl"/> Tìm sản phẩm tương tự
                    </button>
                    // <button
                    //     onClick={() => handleShowSimilarProducts(product)}
                    //     className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    // >
                    //     <FiSearch size={16}/>
                    //     Tìm sản phẩm tương tự
                    // </button>
                );
            }
            return null;
        }

        const renderUnit = (product: any, price_id: any) => {
            const price = getPrice(product.product, price_id);
            const productId = product.product.product_id;
            const dropdownKey = `${productId}-${price_id}`;
            const availableQuantity = availableQuantities[dropdownKey];
            const isLoadingQuantity = loadingQuantities[dropdownKey];

            return (
                <>
                    <div
                        className="text-center relative flex flex-row md:flex-col items-center justify-center gap-2"
                        ref={(el) => {
                            dropdownRefs.current[dropdownKey] = el;
                        }}
                    >
                        <div
                            className="border rounded px-2 py-1 cursor-pointer flex bg-white"
                            onClick={() => toggleDropdown(dropdownKey)}
                        >
                            <span>{price?.unit}</span>
                            <svg
                                className="h-4 w-4 text-gray-400 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {isLoadingQuantity ? (
                            <div className="text-xs text-gray-500 mt-1">Đang tải...</div>
                        ) : availableQuantity !== null &&
                        availableQuantity !== undefined &&
                        availableQuantity <= 10 ? (
                            <div className="text-xs text-gray-500 mt-1">
                <span
                    className={
                        availableQuantity < 10 ? "text-red-500 font-medium" : ""
                    }
                >
                  Còn {availableQuantity} {price?.unit}
                </span>
                            </div>
                        ) : null}

                        {openDropdowns[dropdownKey] && (
                            <div
                                className="absolute z-10 w-fit bg-white border rounded-md shadow-lg max-h-60 overflow-auto top-8 whitespace-nowrap">
                                {product?.product?.prices &&
                                    product?.product?.prices.map((priceOption: any) => (
                                        <div
                                            key={priceOption.price_id}
                                            className={clsx(
                                                "px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm",
                                                priceOption.price_id === price_id
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-900"
                                            )}
                                            onClick={() => {
                                                if (priceOption.price_id !== price_id) {
                                                    handleUnitChange(
                                                        product.product.product_id,
                                                        priceOption.price_id,
                                                        product.quantity,
                                                        price?.price_id
                                                    );
                                                }
                                                toggleDropdown(dropdownKey);
                                            }}
                                        >
                                            {priceOption.unit} -{" "}
                                            {priceOption.price.toLocaleString("vi-VN")}đ
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </>
            );
        };

        const checkQuantity = (product: any, price_id: any) => {
            const price = getPrice(product.product, price_id);
            const productId = product.product.product_id;
            const dropdownKey = `${productId}-${price_id}`;
            return availableQuantities[dropdownKey];
        }

        const renderTotalPrice = (product: any, price_id: any) => {
            const price = getPrice(product.product, price_id);
            const productId = product.product.product_id;
            const dropdownKey = `${productId}-${price_id}`;

            return (
                <>
                    <div className="text-center font-semibold text-[#0053E2] text-lg">
                        {calculateTotalPrice(price?.price, product.quantity).toLocaleString(
                            "vi-VN"
                        )}
                        đ
                    </div>
                </>
            );
        };

        return (
            <>
                <div className="pt-4 flex flex-col lg:flex-row">
                    <div
                        className="bg-[#F5F7F9] rounded-xl w-full"
                        style={{height: `${cart && cart?.length * 20}%`}}
                    >
                        <div className="overflow-hidden rounded-xl">
                            <CartTableMobile
                                cart={cart}
                                selectedProducts={selectedProducts}
                                handleSelectAll={handleSelectAll}
                                handleSelectProduct={handleSelectProduct}
                                handleDeleteClick={handleDeleteClick}
                                handleShowSimilarProducts={handleShowSimilarProducts}
                                renderOriginalPrice={renderOriginalPrice}
                                renderQuantityControls={renderQuantityControls}
                                renderUnit={renderUnit}
                                renderTotalPrice={renderTotalPrice}
                                loadingGetCart={loadingGetCart}
                            />
                            <CartTableDesktop
                                cart={cart}
                                selectedProducts={selectedProducts}
                                handleSelectAll={handleSelectAll}
                                handleSelectProduct={handleSelectProduct}
                                handleDeleteClick={handleDeleteClick}
                                handleShowSimilarProducts={handleShowSimilarProducts}
                                renderOriginalPrice={renderOriginalPrice}
                                renderQuantityControls={renderQuantityControls}
                                renderUnit={renderUnit}
                                checkQuantity={checkQuantity}
                                renderTotalPrice={renderTotalPrice}
                                loadingGetCart={loadingGetCart}
                                renderSimilarProductsButton={renderSimilarProductsButton}
                            />
                        </div>
                    </div>

                    <OrderSummary
                        totalAmount={calculateCartTotals?.total_price || 0}
                        totalOriginPrice={calculateCartTotals?.total_original_price || 0}
                        totalDiscount={calculateCartTotals?.total_discount || 0}
                        totalSave={calculateCartTotals?.total_discount || 0}
                        shippingFee={shippingFee}
                        checkout={checkout}
                        vouchers={vouchersCart}
                        setVouchers={changeSelectVouhcher}
                    />

                    {isDeleteDialogOpen && selectedProductId !== null && (
                        <DeleteProductDialog
                            productId={selectedProductId}
                            priceId={selectedPriceId}
                            onClose={handleCloseDialog}
                            onConfirm={() => {
                                removeProductFromCart(
                                    selectedProductId,
                                    selectedPriceId,
                                    () => {
                                        toast.showToast("Xóa sản phẩm thành công", "success");
                                        getCart();
                                    },
                                    (error) => {
                                        toast.showToast("Xóa sản phẩm thất bại", "error");
                                    }
                                );
                                handleCloseDialog();
                            }}
                        />
                    )}
                </div>

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
            </>
        );
    }
);

export default ShoppingCart;
