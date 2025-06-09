import {useState} from "react";
import {Plus} from "lucide-react";
import AddProductTemplateDialog from "../../Dialog/addProductTemplateDialog";
import AddCategoryDialog from "@/components/Admin/Dialog/addCategoryDialog";

export default function ProductDetails() {
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [isAddCategoriesDialogOpen, setIsAddCategoriesDialogOpen] =
        useState(false);
    const [isAddProductTemplateDialogOpen, setIsAddProductTemplateDialogOpen] =
        useState(false);


    const [categories, setCategories] = useState([
        "Thực phẩm chức năng",
        "Thuốc",
        "Dược mỹ phẩm",
        "Thiết bị y tế",
        "Chăm sóc cá nhân",
        "Mẹ và bé",
        "Sức khỏe sinh sản",
        "Hỗ trợ giấc ngủ",
        "Phong độ bền lâu",
    ]);
    const [productTemplate, setProductTemplate] = useState([
        "New Arrival",
        "Best Seller",
        "Limited Edition",
        "Discounted",
        "Trending",
    ]);
    const handleAddCategory = (newCategory: string) => {
        setCategories([...categories, newCategory]);
        setIsAddCategoriesDialogOpen(false);
    };

    const handleAddProductTemplate = (newProductTemplate: string) => {
        setProductTemplate([...productTemplate, newProductTemplate]);
        setIsAddProductTemplateDialogOpen(false);
    };

    return (
        <div>
            <div className="bg-white shadow-sm rounded-2xl p-4 h-full space-y-2">
                <h2 className="text-lg font-semibold">Product Details</h2>
                <div className="space-y-4">
                    <label className="block font-medium mt-4">Categories</label>
                    <select
                        className="w-full mt-1 p-2 border rounded-lg"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" disabled>
                            Categories
                        </option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <p className="text-gray-500 text-sm mt-1">
                        Add product to a category.
                    </p>
                    <button
                        className="mt-2 flex items-center text-blue-600 text-sm hover:bg-[#1E4DB7] hover:text-white font-medium bg-[#E7ECF7] p-2 rounded-lg cursor-pointer"
                        onClick={() => setIsAddCategoriesDialogOpen(true)}
                    >
                        <Plus size={16} className="mr-1"/> Create New Category
                    </button>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                    <label className="block font-medium">Product Template</label>
                    <select
                        className="w-full mt-1 p-2 border rounded-lg"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a product template
                        </option>
                        {productTemplate.map((tag, index) => (
                            <option key={index} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                    <p className="text-gray-500 text-sm mt-1">
                        Assign a template from your current theme to define how a single
                        product is displayed.
                    </p>
                    <button
                        className="mt-2 flex items-center text-blue-600 text-sm hover:bg-[#1E4DB7] hover:text-white font-medium bg-[#E7ECF7] p-2 rounded-lg"
                        onClick={() => setIsAddProductTemplateDialogOpen(true)}
                    >
                        <Plus size={16} className="mr-1"/>
                        Create New Product Template
                    </button>
                </div>
            </div>
            {isAddCategoriesDialogOpen && (
                <AddCategoryDialog
                    onClose={() => setIsAddCategoriesDialogOpen(false)}
                    // onConfirm={handleAddCategory}
                    onConfirm={(newCategory: string) => {
                        handleAddCategory(newCategory);
                    }}
                    isOpen={isAddCategoriesDialogOpen}
                />
            )}
            {isAddProductTemplateDialogOpen && (
                <AddProductTemplateDialog
                    onClose={() => setIsAddProductTemplateDialogOpen(false)}
                    onConfirm={handleAddProductTemplate}
                />
            )}
        </div>
    );
}
