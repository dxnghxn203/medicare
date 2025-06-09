"use client";
import React, {use, useEffect, useState} from "react";
import {DeliveryMethod} from "./deliveryMethod";
import {OrdererInfo} from "@/components/Checkout/CheckoutInfo/infoDelivery";
import {ShippingAddress} from "@/components/Checkout/CheckoutInfo/shippingAddress";
import {PaymentMethod} from "./paymentMethod";
import {Toggle} from "@/components/toggle/toggle";
import {
    OrdererInfo as OrdererInfoType,
    AddressFormData,
} from "../ProductInfo/types";
import ReceiveDialog from "@/components/Dialog/receiveDialog";
import {PAYMENT_COD} from "@/utils/constants";
import {useAuth} from "@/hooks/useAuth";
import LocationCheckout from "../locationCheckout";

interface DeliveryProps {
    setData: (data: any) => void;
}

const Delivery: React.FC<DeliveryProps> = ({setData}) => {
    const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
        "delivery"
    );

    const [ordererInfo, setOrdererInfo] = useState<OrdererInfoType>({
        fullName: "",
        phone: "",
        email: "",
    });
    const [addressInfo, setAddressInfo] = useState<AddressFormData>({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        district: "",
        ward: "",
        address: "",
        notes: "",
        cityCode: "",
        districtCode: "",
        wardCode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<any>(PAYMENT_COD);
    const [dataLocation, setDataLocation] = useState<any | null>(null);
    const [note, setNote] = useState<string | null>(null);

    useEffect(() => {
        if (dataLocation) {
            setData({
                ordererInfo: {
                    fullName: dataLocation?.name,
                    phone: dataLocation?.phone_number,
                    email: dataLocation?.email,
                },
                note: note,
                addressInfo: {
                    fullName: dataLocation?.name,
                    phone: dataLocation?.phone_number,
                    email: dataLocation?.email,
                    city: dataLocation?.province,
                    district: dataLocation?.district,
                    ward: dataLocation?.ward,
                    address: dataLocation?.address,
                    notes: "",
                    cityCode: dataLocation?.province_code,
                    districtCode: dataLocation?.district_code,
                    wardCode: dataLocation?.ward_code,
                },
                deliveryMethod,
                paymentMethod,
            });
        } else {
            setData({
                ordererInfo,
                addressInfo,
                note: note,
                deliveryMethod,
                paymentMethod,
            });
        }
    }, [
        ordererInfo,
        addressInfo,
        deliveryMethod,
        paymentMethod,
        note,
        dataLocation,
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {isAuthenticated} = useAuth();
    return (
        <main className="flex overflow-hidden flex-col pt-7">
            <h2 className="my-auto text-black text-sm font-medium">
                Chọn hình thức nhận hàng
            </h2>

            <div className="flex flex-col px-5 py-6 mt-5 font-medium text-black rounded-xl bg-[#F5F7F9]">
                {isAuthenticated ? (
                    <>
                        <LocationCheckout
                            setDataLocation={setDataLocation}
                            setNote={setNote}
                        />
                    </>
                ) : (
                    <>
                        <OrdererInfo info={ordererInfo} onChange={setOrdererInfo}/>
                        <ShippingAddress address={addressInfo} onChange={setAddressInfo}/>
                        <div
                            className="bg-white mt-5 flex flex-col items-start pt-5 pr-20 pb-12 pl-5 rounded-3xl border border-black/10">
                            <label className="text-xs">Ghi chú (không bắt buộc)</label>
                            <textarea
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao hàng"
                                className="w-full mt-3.5 text-sm bg-transparent outline-none resize-none placeholder:text-[14px] placeholder:font-normal"
                            />
                        </div>
                    </>
                )}
            </div>
            <div
                className="flex items-center justify-between px-6 py-3 mt-1.5 rounded-xl bg-[#F5F7F9] max-md:px-5 min-w-0">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-black whitespace-nowrap">
                        Yêu cầu xuất hóa đơn điện tử
                    </p>
                    <p className="text-xs font-normal text-black/50">
                        (Hóa đơn sẽ được tự động gửi qua email của bạn)
                    </p>
                </div>
            </div>

            <h2 className="my-6 text-sm font-medium text-black">
                Chọn phương thức thanh toán
            </h2>
            <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod}/>
            {isDialogOpen && <ReceiveDialog onClose={() => setIsDialogOpen(false)}/>}
        </main>
    );
};

export default Delivery;
