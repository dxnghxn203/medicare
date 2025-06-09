"use client";
import CartEmpty from "@/components/Cart/emptyCart";
import ShoppingCart from "@/components/Cart/shoppingCart";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Loading from "../loading";
import Checkout from "@/components/Checkout/checkout";
import { useOrder } from "@/hooks/useOrder";
import { useToast } from "@/providers/toastProvider";
import LoaingCenter from "@/components/loading/loading";
import QRPayment from "@/components/Checkout/qrPayment";
import OutOfStock from "@/components/Checkout/outOfStock";
import checkout from "@/components/Checkout/checkout";

export default function Cart() {
  const { cart, getProductFromCart } = useCart();
  const [loadingGetCart, setLoadingGetCart] = useState(false);

  const shoppingCartRef = useRef<any>(null);

  const fetchingCart = () => {
    setLoadingGetCart(true);
    getProductFromCart(
      () => {
        setLoadingGetCart(false);
      },
      (error: string) => {
        setLoadingGetCart(false);
        console.error(error);
      }
    );
  };
  useEffect(() => {
    fetchingCart();
  }, []);

  const [isCheckout, setIsCheckout] = useState(false);
  const [productForCheckOut, setProductForCheckOut] = useState<any[]>([]);
  const [data, setData] = useState<any>({});
  const { checkOrder, checkShippingFee } = useOrder();
  const toast = useToast();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [isQR, setIsQR] = useState(false);
  const [orderID, setOrderID] = useState<string | null>(null);
  const [priceOrder, setPriceOrder] = useState<any | null>(null);
  const [imageQR, setImageQR] = useState<any>(null);
  const [isCOD, setIsCOD] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [productsOutOfStock, setProductsOutOfStock] = useState<any>([]);
  const [isLoadingCheckFee, setIsLoadingCheckFee] = useState(false);
  const [vouchers, setVouchers] = useState<any>({});

  const handleShowSimilarProducts = (product: any) => {
    setIsOutOfStock(false);

    setTimeout(() => {
      if (
        shoppingCartRef.current &&
        shoppingCartRef.current.handleShowSimilarProducts
      ) {
        shoppingCartRef.current.handleShowSimilarProducts(product);
      }
    }, 100);
  };

  const validateData = (isCheckVoucher: boolean) => {
    if (isCheckVoucher) {
      return productForCheckOut && productForCheckOut.length > 0;
    }

    if (!data || !data?.ordererInfo || !data?.addressInfo) {
      return false;
    }

    const orderInf = data?.ordererInfo;
    const addressInf = data?.addressInfo;
    if (!orderInf || !orderInf.fullName || !orderInf.phone || !orderInf.email) {
      return false;
    }
    return !(
      !addressInf ||
      !addressInf.address ||
      !addressInf.cityCode ||
      !addressInf.districtCode ||
      !addressInf.wardCode
    );
  };

  const [shippingFee, setShippingFee] = useState<any>({});

  useEffect(() => {
    if (!productForCheckOut || productForCheckOut.length === 0) {
      setShippingFee({});
      setIsOutOfStock(false);
      setVouchers({});
      return;
    }
  }, [productForCheckOut]);

  const checkShippingFeeUI = (isCheckVoucher: boolean) => {
    if (!validateData(isCheckVoucher)) {
      return;
    }
    if (!productForCheckOut) return;
    setProductsOutOfStock([]);
    setIsLoadingCheckFee(true);
    try {
      checkShippingFee(
        {
          orderData: {
            product: productForCheckOut,
            ...data,
            voucherOrderId: vouchers?.selectedVoucherOrder?.voucher_id || null,
            voucherDeliveryId: vouchers?.selectedVoucher?.voucher_id || null,
          },
        },
        (data: any) => {
          setIsLoadingCheckFee(false);
          setShippingFee(data || {});
          setIsOutOfStock(false);
        },
        (error: any) => {
          setIsLoadingCheckFee(false);
          setIsOutOfStock(error.isOutOfStock || false);
          setProductsOutOfStock(error?.data || []);
          toast.showToast("Lỗi khi kiểm tra phí vận chuyển", error.message);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addressDeps = JSON.stringify({
    fullName: data?.ordererInfo?.fullName,
    phone: data?.ordererInfo?.phone,
    email: data?.ordererInfo?.email,
    address: data?.addressInfo?.address,
    cityCode: data?.addressInfo?.cityCode,
    districtCode: data?.addressInfo?.districtCode,
    wardCode: data?.addressInfo?.wardCode,
  });

  useEffect(() => {
    checkShippingFeeUI(false);
  }, [addressDeps]);

  useEffect(() => {
    if (vouchers) {
      checkShippingFeeUI(true);
    }
  }, [vouchers]);

  const checkOrderStatus = () => {
    if (!validateData(false)) {
      toast.showToast("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }
    setLoadingCheckout(true);
    checkOrder(
      {
        orderData: {
          product: productForCheckOut,
          ...data,
          voucherOrderId: vouchers?.selectedVoucherOrder?.voucher_id || null,
          voucherDeliveryId: vouchers?.selectedVoucher?.voucher_id || null,
        },
      },
      (data: any) => {
        toast.showToast("Đặt hàng thành công", "success");
        if (data && data?.order_id) {
          setOrderID(data?.order_id);
          if (data.isQR && data?.qr_code && data?.qr_code !== "") {
            setIsQR(true);
            setImageQR(data?.qr_code);
          }
        }
        if (data && data?.order_id && !data.isQR) {
          fetchingCart();
          setIsCOD(true);
          setIsCheckout(false);
        }
        setLoadingCheckout(false);
      },
      (error: any) => {
        toast.showToast("Đặt hàng thất bại", error);
        setLoadingCheckout(false);
      }
    );
  };

  const handleCheckout = () => {
    checkOrderStatus();
  };

  const calculateCartTotals = () => {
    let total_original_price = 0;
    let total_price = 0;
    let total_discount = 0;
    productForCheckOut.forEach((product) => {
      const {
        quantity = 0,
        price = 0,
        original_price = 0,
        unit_price,
      } = product;
      const calculated_unit_price =
        unit_price !== undefined ? unit_price : original_price;
      if (quantity > 0 && calculated_unit_price >= 0 && price >= 0) {
        total_original_price += calculated_unit_price * quantity;
        total_price += price * quantity;
        total_discount += (calculated_unit_price - price) * quantity;
      }
    });
    return {
      total_original_price: total_original_price || 0,
      total_price: total_price || 0,
      total_discount: total_discount || 0,
    };
  };

  const closeQR = () => {
    setIsQR(false);
    setIsCheckout(false);
    setProductForCheckOut([]);
    setLoadingCheckout(false);
    setImageQR(null);
  };

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {isQR && orderID && imageQR && productForCheckOut ? (
        <QRPayment
          image={imageQR}
          order_id={orderID}
          price={calculateCartTotals()}
          setClose={closeQR}
        />
      ) : (
        <>
          {isCheckout ? (
            <>
              {loadingCheckout ? (
                <LoaingCenter />
              ) : (
                <Checkout
                  back={() => {
                    setIsCheckout(false);
                    setVouchers({});
                  }}
                  price={calculateCartTotals()}
                  productForCheckOut={productForCheckOut}
                  setData={setData}
                  handleCheckout={handleCheckout}
                  shippingFee={shippingFee}
                  vouchers={vouchers}
                  setVouchers={setVouchers}
                />
              )}
            </>
          ) : (
            <main className="flex flex-col space-y-8 w-full">
              <div className="flex flex-col px-5 ">
                <div className="pt-14">
                  <Link
                    href="/"
                    className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
                  >
                    <ChevronLeft size={20} />
                    <span>Tiếp tục mua sắm</span>
                  </Link>
                </div>
                {loadingGetCart ? (
                  <Loading />
                ) : (
                  <>
                    {cart && cart?.length ? (
                      <ShoppingCart
                        ref={shoppingCartRef}
                        cart={cart}
                        setIsCheckout={setIsCheckout}
                        setProductForCheckOut={setProductForCheckOut}
                        setPriceOrder={setPriceOrder}
                        setVouchers={setVouchers}
                        shippingFee={shippingFee}
                      />
                    ) : (
                      <CartEmpty />
                    )}
                  </>
                )}
              </div>

              <div className="px-5">
                <ProductsViewedList />
              </div>
            </main>
          )}
        </>
      )}

      {isOutOfStock && (
        <OutOfStock
          products={productsOutOfStock}
          onContinue={() => {
            setIsOutOfStock(false);
            setProductForCheckOut(productsOutOfStock?.availableProducts);
            setIsCheckout(true);
            setIsOutOfStock(false);
          }}
          closeDialog={(isClose: boolean) => {
            setIsOutOfStock(isClose);
            closeQR();
          }}
        />
      )}

      {isLoadingCheckFee && <LoaingCenter />}
    </div>
  );
}
