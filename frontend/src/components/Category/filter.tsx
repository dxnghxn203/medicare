import {useProduct} from "@/hooks/useProduct";
import {useEffect, useState} from "react";

const priceRanges = [
    {label: "Dưới 100.000 đ", value: "under-100", min: 0, max: 100000},
    {
        label: "100.000 đ - 300.000 đ",
        value: "100-300",
        min: 100000,
        max: 300000,
    },
    {
        label: "300.000 đ - 500.000 đ",
        value: "300-500",
        min: 300000,
        max: 500000,
    },
    {label: "Trên 500.000 đ", value: "above-500", min: 500000, max: Infinity},
];

interface FilterProps {
    onPriceFilterChange: (range: { min: number; max: number }) => void;
    onBrandFilterChange: (brands: string[]) => void;
}

export default function Filter({
                                   onPriceFilterChange,
                                   onBrandFilterChange,
                               }: FilterProps) {
    const [selectedRange, setSelectedRange] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {fetchAllBrands, allBrands} = useProduct();

    useEffect(() => {
        fetchAllBrands(
            () => {
            },
            () => {
            }
        );
    }, []);
    // console.log("allBrands", allBrands);
    const handlePriceChange = (value: string, min: number, max: number) => {
        setSelectedRange(value);
        onPriceFilterChange({min, max});
    };

    const handleCustomPriceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        setSelectedRange(""); // Hủy chọn radio nếu nhập giá thủ công
        onPriceFilterChange({min, max});
    };

    const handleBrandChange = (brand: string) => {
        const updatedBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand];

        setSelectedBrands(updatedBrands);
        onBrandFilterChange(updatedBrands);
    };

    const handleResetFilters = () => {
        setSelectedRange("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedBrands([]); // Reset danh sách thương hiệu đã chọn
        setSearchTerm("");

        onPriceFilterChange({min: 0, max: Infinity});
        onBrandFilterChange([]);
    };
    const filteredBrands = allBrands && allBrands.filter((brand: any) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const brandsToDisplay = (
        showAll
            ? (filteredBrands || [])
            : (filteredBrands || []).slice(0, 10)
    );

    return (
        <div className="pl-5 space-y-4">
            {/* Header */}
            <div className="flex pt-2 space-x-6">
                <span className="font-semibold">Bộ lọc</span>
                <span
                    className="text-[#0053E2] cursor-pointer"
                    onClick={handleResetFilters}
                >
          Thiết lập lại
        </span>
            </div>
            <div className="border-b border-gray-300"></div>

            {/* Khoảng giá */}
            <form onSubmit={handleCustomPriceSubmit}>
                <span className="font-semibold">Khoảng giá</span>
                <div className="flex flex-col gap-2 py-2">
                    <input
                        type="number"
                        placeholder="Tối thiểu"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Tối đa"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-[#0053E2] text-white font-semibold py-2 rounded-lg"
                    >
                        Áp dụng
                    </button>
                </div>
            </form>

            {/* Lọc theo khoảng giá có sẵn */}
            <div className="space-y-2">
                {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="price-range"
                            value={range.value}
                            checked={selectedRange === range.value}
                            onChange={() =>
                                handlePriceChange(range.value, range.min, range.max)
                            }
                            className="w-4 h-4"
                        />
                        <span className="text-sm">{range.label}</span>
                    </label>
                ))}
            </div>

            <div className="border-b border-gray-300"></div>

            {/* Lọc theo thương hiệu */}
            <div>
                <span className="font-semibold">Thương hiệu</span>
                <div className="flex flex-col gap-2 py-2">
                    <input
                        type="text"
                        placeholder="Nhập tên thương hiệu"
                        className="border border-gray-300 rounded-lg p-2 text-sm"
                        value={searchTerm} // Thêm giá trị của searchTerm
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi nhập
                    />
                    <div className="space-y-2">
                        {brandsToDisplay.map(
                            (brand: any, index: any) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={brand} className="text-sm">
                                        {brand}
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                    {filteredBrands && filteredBrands.length > 10 && (
                        <button
                            type="button"
                            className="text-blue-600 mt-2 hover:underline text-sm"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? "Thu gọn" : "Xem thêm"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
