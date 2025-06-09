import React, {useState} from 'react';

interface FilterBarProps {
    onFilterChange: (filters: {
        categoryFilter: string;
        prescriptionFilter: string;
        statusFilter: string;
    }) => void;
    allCategory: any[];
}

const FilterBar: React.FC<FilterBarProps> = ({
    onFilterChange,
    allCategory
}) => {
    const [filters, setFilters] = useState({
        categoryFilter: '',
        prescriptionFilter: '',
        statusFilter: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange({
        categoryFilter: filters.categoryFilter,
        prescriptionFilter: filters.prescriptionFilter,
        statusFilter: filters.statusFilter,
        });
    };

    const handleResetFilters = () => {
        setFilters({
        categoryFilter: '',
        prescriptionFilter: '',
        statusFilter: '',
        });
        onFilterChange({
        categoryFilter: '',
        prescriptionFilter: '',
        statusFilter: '',
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thuốc kê toa</label>
                    <select
                        name="prescriptionFilter"
                        value={filters.prescriptionFilter}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Có</option>
                        <option value="false">Không</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                        name="categoryFilter"
                        value={filters.categoryFilter}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả danh mục</option>
                        {allCategory.map((category) => (
                            <option key={category.main_category_id} value={category.main_category_id}>
                            {category.main_category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái duyệt</label>
                    <select
                        name="statusFilter"
                        value={filters.statusFilter}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option key="" value="">Tất cả</option>
                        <option key="approved" value="approved">Đã duyệt</option>
                        <option key="pending" value="pending">Đang chờ</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Đặt lại
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
