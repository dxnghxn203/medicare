"use client";
import {useOrder} from "@/hooks/useOrder";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {X} from "lucide-react";
import {GoZoomIn} from "react-icons/go";
import SearchProductDialog from "../Dialog/searchProductDialog";
import {FiMinus, FiPlus} from "react-icons/fi";
import {ImBin} from "react-icons/im";
import {useToast} from "@/providers/toastProvider";
import {useDocument} from "@/hooks/useDocument";
import { da } from "date-fns/locale";

const STATUS_LABEL_MAP: Record<
  string,
  { text: string; className: string }
> = {
  pending: {
    text: "Đang chờ duyệt",
    className: "text-yellow-500 bg-yellow-100",
  },
  approved: {
    text: "Đã duyệt",
    className: "text-green-500 bg-green-100",
  },
  rejected: {
    text: "Đã từ chối",
    className: "text-red-500 bg-red-100",
  },
  uncontacted: {
    text: "Chưa liên lạc được",
    className: "text-blue-500 bg-blue-100",
  },
};

export default function RequestDetailPage() {
    const router = useRouter();
    const toast = useToast();
    const searchParams = useSearchParams();

    const {
        fetchGetApproveRequestOrder,
        allRequestOrderApprove,
        totalRequestOrderApprove,
        fetchApproveRequestOrder,
        fetchCheckFeeApproveRequestOrder
    } = useOrder();
    const {
        getDocumentByRequestId
    } = useDocument();
    
    const detailId = searchParams.get("chi-tiet");
    const editId = searchParams.get("edit");
    const requestId = detailId || editId;
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [requestItem, setRequestItem] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
    const [document, setDocument] = useState<any>(null);
    const [shippingFee, setShippingFee] = useState<any>({});
    
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

    const [statusApprove, setStatusApprove] = useState<string>("pending");
    const [noteApprove, setNoteApprove] = useState<string>("");

    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
    const [editedProducts, setEditedProducts] = useState<any[]>([]);

    const [statusInfo, setStatusInfo] = useState<{ text: string; className: string }>({
        text: "",
        className: "",
    });

    const checkIfRequestItemExists = () => {
        if (requestItem) return;
        if (allRequestOrderApprove && totalRequestOrderApprove > 0) {
            const item = allRequestOrderApprove.find(
                (item: any) => item.request_id === requestId
            );
            if (item) {
                setRequestItem(item);
                if (item.status) {
                    const info = STATUS_LABEL_MAP[item.status] || {
                        text: "Không rõ trạng thái",
                        className: "text-gray-500 bg-gray-100",
                    };
                    setStatusInfo(info);
                }
                
                setSelectedProduct((prev) => [
                    ...prev,
                    ...item.product.map((prod: any) => ({
                        prices: [
                            {
                                price_id: prod.price_id,
                                original_price: prod.original_price,
                                price: prod.price,
                                unit: prod.unit,
                            },
                        ],
                        product_id: prod.product_id,
                        product_name: prod.product_name,
                        images_primary: prod.images_primary,
                        quantity: prod.quantity,
                        price_id: prod.price_id,
                        original_price: prod.original_price,
                        price: prod.price,
                        unit: prod.unit,
                    })),
                ]);

                getDocumentByRequestId(
                    item.request_id,
                    (data: any) => setDocument(data),
                    (error: any) => console.error("Error fetching document:", error)
                );
            }
        } else {
            fetchGetApproveRequestOrder(
                {
                    page: 1,
                    page_size: totalRequestOrderApprove,
                },
                () => {},
                () => {}
            );
        }
    };

    useEffect(() => {
        checkIfRequestItemExists();
    }, [requestId, allRequestOrderApprove, requestItem, totalRequestOrderApprove]);

    if (!requestItem) return <div>Loading...</div>;

    const updateQuantity = (productId: string, delta: number) => {
        setSelectedProduct((prev) =>
            prev.map((product) =>
                product.product_id === productId
                    ? {...product, quantity: Math.max(1, product.quantity + delta)}
                    : product
            )
        );
    };

    const handleRemove = (productId: string) => {
        setSelectedProduct((prev) =>
            prev.filter((product) => product.product_id !== productId)
        );
    };

    const updateUnit = (
        productId: string,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedUnit = e.target.value;
        const selectedPrice = selectedProduct
            .find((product) => product.product_id === productId)
            ?.prices.find((price: any) => price.unit === selectedUnit);
        if (selectedPrice) {
            setSelectedProduct((prev) =>
                prev.map((product) =>
                    product.product_id === productId
                        ? {
                            ...product,

                            price_id: selectedPrice.price_id,
                            original_price: selectedPrice.original_price,
                            price: selectedPrice.price,
                            unit: selectedUnit,
                        }
                        : product
                )
            );
        }
        
    };

    const body = {
        request_id: requestItem.request_id,
        status: statusApprove,
        product: selectedProduct.map((product) => ({
            product_id: product.product_id,
            quantity: product.quantity,
            price_id: product.price_id,
        })),
        note: noteApprove,
    };
    const bodyReject = {
        request_id: requestItem.request_id,
        status: statusApprove,
        product: requestItem.product.map((product: any) => ({
            product_id: product.product_id,
            quantity: product.quantity,
            price_id: product.price_id,
        })),
        note: noteApprove,
    };
    console.log("bodyReject", bodyReject);
    console.log("body", body);

    const handleApprove = () => {
        if (statusApprove === "rejected") {
            if (noteApprove === "") {
                toast.showToast("Vui lòng điền lý do từ chối!", "warning");
                return;
            }
            fetchApproveRequestOrder(
                {bodyReject}, 
                () => {
                    toast.showToast("Từ chối yêu cầu thành công", "success");
                    router.push("/kiem-duyet-yeu-cau-tu-van-thuoc");
                },
                () => {
                    toast.showToast("Từ chối yêu cầu thất bại", "error");
                }
            );
        } else if (statusApprove === "approved") {
            if (selectedProduct.length === 0) {
                toast.showToast("Vui lòng thêm ít nhất 1 sản phẩm!", "warning");
                return;
            }
            fetchApproveRequestOrder(
                {body},
                () => {
                    toast.showToast("Duyệt yêu cầu thành công", "success");
                    setErrors({});
                    router.push("/kiem-duyet-yeu-cau-tu-van-thuoc");
                },
                () => {
                    toast.showToast("Duyệt yêu cầu thất bại", "error");
                    setErrors({});
                }
            );
        } else {
            fetchApproveRequestOrder(
                {body},
                () => {
                    toast.showToast("Duyệt yêu cầu thành công", "success");
                    setErrors({});
                    router.push("/kiem-duyet-yeu-cau-tu-van-thuoc");
                },
                () => {
                    toast.showToast("Duyệt yêu cầu thất bại", "error");
                    setErrors({});
                }
            );
        }
    };

    const handleCheckFee = () => {
        fetchCheckFeeApproveRequestOrder(
                body,
                (data: any) => {
                    console.log("data fee", data)
                    toast.showToast("Kiểm tra phí yêu cầu thành công", "success");
                    setErrors({});
                    setShippingFee(data);
                },
                () => {
                    toast.showToast("Kiểm tra phí yêu cầu thất bại", "error");
                    setErrors({});
                }
            );
    }

    const totalOriginPrice = selectedProduct.reduce(
        (total, product) => total + product.original_price * product.quantity,
        0
    );
    const productDiscount = selectedProduct.reduce(
        (total, product) =>
            total + (product.original_price - product.price) * product.quantity,
        0
    );

    const startEditing = (index: number) => {
        setEditingProductIndex(index);
        setEditedProducts(document.products ? [...document.products] : []);
    };

    const handleProductChange = (index: number, field: string, value: string) => {
        const updatedProducts = [...editedProducts];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value
        };
        setEditedProducts(updatedProducts);
    };

    const saveProductChanges = () => {
        setDocument({
            ...document,
            products: editedProducts
        });
        setEditingProductIndex(null);
        toast.showToast("Đã cập nhật thông tin thuốc", "success");
    };

    const cancelEditing = () => {
        setEditingProductIndex(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-extrabold text-black">
                <h1>Chi tiết yêu cầu</h1>
            </h2>
            <div className="my-4 text-sm">
                <Link href="/dashboard" className="hover:underline text-blue-600">
                    Dashboard
                </Link>
                <span> / </span>
                <Link href="/kiem-duyet-yeu-cau-tu-van-thuoc" className="text-gray-800">
                    Danh sách yêu cầu tư vấn thuốc
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
                <div className="flex flex-col h-full">
                    <div className="bg-white shadow-sm rounded-2xl space-y-4 p-4">
                        <h4 className="text-lg font-semibold">Thông tin khách hàng</h4>
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">
                                    Mã yêu cầu
                                </label>
                                <input
                                    type="text"
                                    value={requestItem.request_id}
                                    className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600 text-sm"
                                    disabled={!!requestId}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3 text-gray-600">
                                    Trạng thái yêu cầu
                                </label>
                                
                                <span className={`font-semibold text-sm rounded-full px-2 py-1 ${statusInfo.className}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">
                                    Tên khách hàng
                                </label>
                                <input
                                    className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                    value={requestItem.pick_to.name}
                                    disabled={!!requestId}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">
                                    Số điện thoại
                                </label>
                                <input
                                    className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                    value={requestItem.pick_to.phone_number}
                                    disabled={!!requestId}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">
                                Email
                            </label>
                            <input
                                className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                value={requestItem.pick_to.email}
                                disabled={!!requestId}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">
                                Địa chỉ
                            </label>
                            <input
                                className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                value={`${requestItem.pick_to.address.address}, ${requestItem.pick_to.address.ward}, ${requestItem.pick_to.address.district}, ${requestItem.pick_to.address.province}`}
                                disabled={!!requestId}
                            />
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col gap-4">
                        <h4 className="text-lg font-semibold">Sản phẩm cần tư vấn</h4>
                        {requestItem.product?.length > 0 ? (
                            requestItem.product.map((product: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 border rounded-lg p-4 bg-white shadow-sm mb-4"
                                >
                                    <Image
                                        src={product.images_primary}
                                        alt={product.product_name}
                                        width={80}
                                        height={80}
                                        className="rounded-lg object-cover"
                                    />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-semibold text-gray-800">
                                            {product.product_name}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {product.product_id}
                                        </span>
                                        <span>Đơn vị: {product.unit}</span>
                                        <span>Số lượng: {product.quantity}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="italic text-gray-500">
                                Không có thông tin sản phẩm
                            </p>
                        )}
                    </div>
                    {editId && (
                        <div className="bg-white shadow-sm rounded-2xl space-y-4 p-4 mt-4">
                            <div className="w-full font-semibold rounded-lg mb-3">
                                Thêm sản phẩm tư vấn
                            </div>
                            <button
                                className="text-sm text-blue-700 bg-[#EAEFFA] w-full py-3.5 rounded-full flex items-center justify-center space-x-2 font-semibold"
                                type="button"
                                onClick={() => setIsOpen(true)}
                            >
                                + Thêm sản phẩm/thuốc
                            </button>

                            {/* </div> */}
                            {selectedProduct.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {selectedProduct.map((product: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between gap-3 pb-2 text-sm ${
                                                index === selectedProduct.length - 1 ? "" : "border-b"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex space-x-4 items-center">
                                                    <Image
                                                        src={product.images_primary}
                                                        alt={product.product_name}
                                                        width={70}
                                                        height={70}
                                                        className="rounded-lg object-cover border p-2"
                                                    />
                                                    <span
                                                        className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                                                        {product.product_name}
                                                    </span>
                                                </div>

                                                <div className="flex">
                                                    <button
                                                        onClick={() => updateQuantity(product.product_id, -1)}
                                                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <FiMinus/>
                                                    </button>
                                                    <input
                                                        value={product.quantity}
                                                        disabled={!!requestId}
                                                        className="text-center w-8"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(product.product_id, 1)}
                                                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <FiPlus/>
                                                    </button>
                                                </div>

                                                <select
                                                    onChange={(e) => updateUnit(product.product_id, e)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                >
                                                    {product?.prices?.map((item: any) => (
                                                        <option key={item.price_id} value={item.unit}>
                                                            {item.unit}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="text-black/50 hover:text-black transition-colors">
                                                    <button onClick={() => handleRemove(product.product_id)}>
                                                        <ImBin size={18}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {selectedProduct.length > 0 && (
                        <div className="bg-white shadow-sm rounded-2xl p-4 mt-4">
                            <div className="flex flex-col mt-4 max-w-full text-sm">
                                <h4 className="text-lg font-semibold">Thông tin đơn hàng</h4>

                                <div className="">
                                    {selectedProduct.map((product: any, index: any) => (
                                        <div
                                            key={product.product_id}
                                            className={`flex items-center py-4 text-sm ${
                                                index !== selectedProduct.length - 1
                                                    ? "border-b border-gray-300"
                                                    : ""
                                            }`}
                                        >
                                            {/* Cột 1: Hình ảnh + Tên sản phẩm */}
                                            <div className="flex items-center space-x-4 w-2/3">
                                                <Image
                                                    src={product.images_primary}
                                                    alt={product.product_name}
                                                    width={70}
                                                    height={70}
                                                    className="rounded-lg object-cover border p-2"
                                                />
                                                <span className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                                                    {product?.product_name}
                                                </span>
                                            </div>

                                            {/* Cột 2: Giá gốc và giá khuyến mãi */}
                                            <div className="flex justify-end items-center space-x-4 w-1/3">
                                                <div className="text-center">
                                                    <div className="flex flex-col items-center">
                                                        {product.original_price !== product.price && (
                                                            <span
                                                                className="text-gray-500 line-through font-semibold text-sm">
                                                                {product.original_price.toLocaleString("vi-VN")}đ
                                                            </span>
                                                        )}
                                                        <span className="text-base font-semibold text-[#0053E2]">
                                                            {product.price.toLocaleString("vi-VN")}đ
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Cột 3: Số lượng và đơn vị */}
                                                <div className="text-center">
                                                    x{product.quantity} {product.unit}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-black mt-5">
                                    <div>Tổng tiền</div>
                                    <div>{totalOriginPrice.toLocaleString("vi-VN")}đ</div>
                                </div> 
                                <div className="flex justify-between text-black mt-5">
                                    <div>Giảm giá trực tiếp</div>
                                    <div className="text-amber-500">
                                        - {(productDiscount).toLocaleString("vi-VN")}đ
                                    </div>
                                </div>
                                <div className="flex justify-between text-black mt-5">
                                    <div>Giảm giá voucher</div>
                                    <div className="text-amber-500">- {(shippingFee?.voucher_order_discount || 0).toLocaleString("vi-VN")}đ</div>
                                </div>
                                
                            </div>

                            <div className="shrink-0 mt-5 max-w-full border-b"/>
                            <div className="flex justify-between items-center mt-3 max-w-full text-sm text-black ">
                                <div>Phí vận chuyển</div>
                                <div className="flex items-center gap-2">
                                    {(
                                        <div className="text-amber-500">
                                            {(shippingFee?.shipping_fee || 0).toLocaleString("vi-VN")}đ
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 max-w-full text-sm text-black ">
                                <div>Giảm giá phí vận chuyển</div>
                                <div className="flex items-center gap-2">
                                    {(
                                        <div className="text-amber-500">
                                            - {(shippingFee?.voucher_delivery_discount || 0).toLocaleString("vi-VN")}đ
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 mt-3 max-w-full border-b "/>
                            <div className="flex justify-between items-center mt-3  max-w-full text-sm text-black">
                                Voucher có thể bị thay đổi tùy theo thời gian thực
                            </div>

                            <div className="flex gap-5 justify-between items-center mt-3  max-w-full">
                                <div className="text-xl text-black">Tiết kiệm được</div>
                                <div className="flex gap-2 whitespace-nowrap items-center">
                                    <div className="text-xl font-semibold text-blue-700">
                                        {(productDiscount+(shippingFee?.voucher_order_discount || 0)+(shippingFee?.voucher_delivery_discount || 0))
                                        .toLocaleString("vi-VN")}đ
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5 justify-between items-center mt-3  max-w-full">
                                <div className="text-xl text-black">Thành tiền</div>
                                <div className="flex gap-2 whitespace-nowrap items-center">
                                    <div className="text-xl font-semibold text-blue-700">
                                        {((shippingFee?.estimated_total_fee || totalOriginPrice - productDiscount)).toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-4 w-full">
                                <button
                                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium"
                                    onClick={handleCheckFee}
                                >
                                    Kiểm tra phí
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cột phải */}
                <div className=" h-full">
                    <div className="bg-white shadow-sm rounded-2xl p-4">
                        <h4 className="text-lg font-semibold">Ảnh toa thuốc</h4>
                        <div className="flex gap-4">
                            {requestItem.images && requestItem.images.length > 0 ? (
                                requestItem.images.map((img: any, imgIndex: number) => (
                                    <div key={imgIndex} className="mb-4 mt-4">
                                        <div className="flex">
                                            {/* Hiển thị ảnh */}
                                            <div className="relative">
                                                <Image
                                                    src={img.images_url}
                                                    alt={`Ảnh toa thuốc ${imgIndex + 1}`}
                                                    className="object-cover rounded-lg border p-2"
                                                    width={130}
                                                    height={130}
                                                />
                                                <div
                                                    className="absolute bottom-1 right-1 bg-black/40 rounded-full p-1 shadow-md">
                                                    <GoZoomIn
                                                        className="w-3 h-3 text-white cursor-pointer"
                                                        onClick={() => setSelectedImage(img.images_url)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Phóng to ảnh */}
                                            {selectedImage && (
                                                <div
                                                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <div className="relative bg-white p-4 rounded-lg">
                                                        <button
                                                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                                                            onClick={() => setSelectedImage(null)}
                                                        >
                                                            <X size={24}/>
                                                        </button>
                                                        <Image
                                                            src={selectedImage}
                                                            alt="Phóng to ảnh toa thuốc"
                                                            width={600}
                                                            height={600}
                                                            className="max-h-[80vh] object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Không có ảnh toa thuốc
                                </p>
                            )}
                        </div>
                        <div className="bg-white shadow-sm rounded-2xl p-4 mt-4">
                            <h4 className="text-lg font-semibold">Thông tin toa thuốc</h4>
                            {document && (
                                <div className="mt-4 space-y-3 text-sm">
                                    {document.created_at && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Ngày tạo:</span>
                                            <span>{new Date(document.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    )}
                                    {document.document_date && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Ngày toa thuốc:</span>
                                            <span>{document.document_date}</span>
                                        </div>
                                    )}
                                    {document.document_id && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Mã toa thuốc:</span>
                                            <span>{document.document_id}</span>
                                        </div>
                                    )}
                                    {document.document_type && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Loại tài liệu:</span>
                                            <span className="capitalize">{document.document_type}</span>
                                        </div>
                                    )}
                                    {document.issuing_organization && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Tổ chức phát hành:</span>
                                            <span>{document.issuing_organization}</span>
                                        </div>
                                    )}
                                    {document.patient_information && document.patient_information.name && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Bệnh nhân:</span>
                                            <span>{document.patient_information.name}</span>
                                        </div>
                                    )}
                                    {document.prescribing_doctor && (
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Bác sĩ kê đơn:</span>
                                            <span>{document.prescribing_doctor}</span>
                                        </div>
                                    )}
                                    {document.products && document.products.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="font-medium text-gray-700">Danh sách thuốc:</h5>
                                                {editingProductIndex === null && (
                                                    <button
                                                        onClick={() => startEditing(0)}
                                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        Cập nhật thông tin
                                                    </button>
                                                )}
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col"
                                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tên thuốc
                                                        </th>
                                                        <th scope="col"
                                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Số lượng
                                                        </th>
                                                        <th scope="col"
                                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Đơn vị
                                                        </th>
                                                        <th scope="col"
                                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                    {(editingProductIndex !== null ? editedProducts : document.products).map((product: any, index: number) => (
                                                        <tr key={index}
                                                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                {editingProductIndex !== null ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editedProducts[index].product_name}
                                                                        onChange={(e) => handleProductChange(index, 'product_name', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                {editingProductIndex !== null ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editedProducts[index].quantity_value}
                                                                        onChange={(e) => handleProductChange(index, 'quantity_value', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-16"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="text-sm text-gray-900">{product.quantity_value}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                {editingProductIndex !== null ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editedProducts[index].quantity_unit}
                                                                        onChange={(e) => handleProductChange(index, 'quantity_unit', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="text-sm text-gray-900">{product.quantity_unit}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                                {editingProductIndex !== null ? (
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => saveProductChanges()}
                                                                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                                                                        >
                                                                            Lưu
                                                                        </button>
                                                                        <button
                                                                            onClick={cancelEditing}
                                                                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                                                                        >
                                                                            Hủy
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => startEditing(index)}
                                                                        className="text-indigo-600 hover:text-indigo-900 text-xs bg-indigo-50 px-2 py-1 rounded"
                                                                    >
                                                                        Sửa
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {editingProductIndex !== null && (
                                                <div className="flex justify-end mt-3 space-x-2">
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200"
                                                    >
                                                        Hủy tất cả
                                                    </button>
                                                    <button
                                                        onClick={saveProductChanges}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                                                    >
                                                        Lưu tất cả
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-2xl p-4 mt-4">
                        <h4 className="text-lg font-semibold mb-1">Ghi chú</h4>
                        <h5 className="text-sm mb-4 text-gray-500">
                            (Nếu từ chối yêu cầu, vui lòng ghi rõ lý do)
                        </h5>
                        {detailId && (
                            <textarea
                                className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                value={requestItem.note}
                                disabled={!!requestId}
                                rows={6}
                            ></textarea>
                        )}
                        {editId && (
                            <textarea
                                className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                                value={noteApprove}
                                onChange={(e) => {
                                    setNoteApprove(e.target.value);
                                }}
                                rows={6}
                            ></textarea>
                        )}
                        {errors.note && (
                            <p className="text-red-500 text-sm">{errors.note}</p>
                        )}

                        {editId && (
                            <div>
                                <h4 className="text-lg font-semibold mt-4">Trạng thái duyệt</h4>

                                <select
                                    className="border rounded-lg mt-2 p-2 w-full focus:border-blue-600 focus:ring-blue-600 focus:ring-2"
                                    value={statusApprove}
                                    onChange={(e) => {
                                        setStatusApprove(e.target.value);
                                    }}
                                >
                                    <option value="pending">Chọn trạng thái</option>
                                    <option value="approved">Duyệt</option>
                                    <option value="rejected">Từ chối</option>
                                    <option value="uncontacted">Chưa liên lạc được</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {editId && (
                <div className="mt-4 flex justify-end gap-4 w-full">
                    <button
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium"
                        onClick={handleApprove}
                    >
                        Duyệt yêu cầu
                    </button>
                </div>
            )}

            <SearchProductDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSelectProduct={(product) => {
                    if (
                        selectedProduct.some((p) => p.product_id === product.product_id)
                    ) {
                        toast.showToast("Sản phẩm đã được thêm", "error");
                        return;
                    }
                    const defaultPrice = product.prices?.[0];

                    setSelectedProduct((prev) => [
                        ...prev,
                        {
                            ...product,
                            quantity: 1,
                            price_id: defaultPrice.price_id,
                            original_price: defaultPrice.original_price,
                            price: defaultPrice.price,
                            unit: defaultPrice.unit,

                        },
                    ]);
                }}
            />
        </div>
    );
}
