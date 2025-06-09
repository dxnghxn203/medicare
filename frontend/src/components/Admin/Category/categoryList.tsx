import { useCategory } from "@/hooks/useCategory";
import { lazy, useEffect, useState } from "react";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { ImBin } from "react-icons/im";
import { MdOutlineModeEdit } from "react-icons/md";
import SubCategoryList from "./subCategoryList";
import UpdateMainCategoryDialog from "../Dialog/updateCategoryMainDialog";
import AddNewCategoryDialog from "../Dialog/addCategoryDialog";
import DeleteCategoryDialog from "../Dialog/confirmDeleteCategoryDialog";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";

export default function QuanLyDanhMuc() {
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<number | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isAddNewDialogOpen, setAddNewDialogOpen] = useState<boolean>(false);
  const {
    categoryAdmin,
    fetchGetAllCategoryForAdmin,
    fetchDeleteMainCategory,
  } = useCategory();
  const [isDialogDeleteMain, setDialogDeleteMain] = useState<boolean>(false);
  const toast = useToast();
  const [showOptions, setShowOptions] = useState(null);
  const selectedMain = categoryAdmin.find(
    (d: any) => d?.main_category_id === selectedMainId
  );
  const mainCategoryInfo = [
    { label: "ID danh mục chính", value: selectedMain?.main_category_id },
    { label: "Tên danh mục chính", value: selectedMain?.main_category_name },
    { label: "Slug danh mục chính", value: selectedMain?.main_category_slug },
  ];
  useEffect(() => {
    fetchGetAllCategoryForAdmin();
  }, []);
  return (
    <div>
      <div className="justify-end flex items-center">
        <button
          className="bg-[#1E4DB7] text-white px-2 py-2 rounded-lg hover:bg-[#173F98] text-sm flex items-center gap-1
                "
          onClick={() => setAddNewDialogOpen(true)}
        >
          <HiOutlinePlusSmall className="text-lg" />
          Thêm mới
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 my-4">
        {categoryAdmin.map((categoryMain: any) => (
          <div
            key={categoryMain?.main_category_id}
            onClick={() => {
              setSelectedMainId(categoryMain?.main_category_id);
              setSelectedLevel1Id(null);
              setShowOptions(categoryMain?.main_category_id);
            }}
            className={`cursor-pointer px-2 py-6 rounded-xl border shadow relative ${
              selectedMainId === categoryMain?.main_category_id
                ? "bg-[#F0F5FF] border-[#1E4DB7]"
                : "hover:bg-gray-100"
            }`}
          >
            <h3
              className={`font-semibold text-center my-4 ${
                selectedMainId === categoryMain?.main_category_id
                  ? "text-[#1E4DB7]"
                  : "text-black"
              }`}
            >
              {categoryMain?.main_category_name}
            </h3>
            <div className="space-y-1 text-sm text-center">
              {/* Slug */}
              <p>
                <span
                  className={
                    "font-medium rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm w-fit"
                  }
                >
                  Slug: {categoryMain?.main_category_slug}
                </span>
              </p>

              {/* Danh mục cấp 1 */}
              <p className="flex items-center justify-center gap-1">
                <span className="text-xl text-[#039855] font-bold">
                  {categoryMain?.sub_category?.length || 0}
                </span>
                <span className="font-medium text-gray-500 text-sm">
                  Danh mục cấp 1
                </span>
              </p>

              {/* Danh mục cấp 2 */}
              <p className="flex items-center justify-center gap-1">
                <span className="text-xl text-[#BC0606] font-bold">
                  {categoryMain?.sub_category?.reduce(
                    (total: number, sub: any) =>
                      total + (sub?.child_category?.length ?? 0),
                    0
                  )}
                </span>
                <span className="font-medium text-gray-500 text-sm">
                  Danh mục cấp 2
                </span>
              </p>
            </div>

            {/* Nút Delete và Edit */}
            {showOptions === categoryMain?.main_category_id && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDialogOpen(true);
                  }}
                  className="p-2 bg-[#DDF7E9] text-white rounded-full"
                >
                  <MdOutlineModeEdit className="w-4 h-4 text-[#31B764]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMainId(categoryMain?.main_category_id);
                    setDialogDeleteMain(true);
                  }}
                  className="p-2 bg-[#FCECEC] text-white rounded-full"
                >
                  <ImBin className="w-4 h-4 text-[#D4380D]" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <SubCategoryList selectedMainId={selectedMainId} />
      <UpdateMainCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        categoryMainInfo={mainCategoryInfo}
        selectedMainId={selectedMain?.main_category_id}
      />
      <AddNewCategoryDialog
        isOpen={isAddNewDialogOpen}
        onClose={() => setAddNewDialogOpen(false)}
        onConfirm={() => {
          fetchGetAllCategoryForAdmin();
          setAddNewDialogOpen(false);
        }}
      />
      <DeleteCategoryDialog
        isOpen={isDialogDeleteMain}
        onClose={() => setDialogDeleteMain(false)}
        onDelete={() => {
          fetchDeleteMainCategory(
            selectedMain?.main_category_id,
            () => {
              toast.showToast("Xóa danh mục thành công!", ToastType.SUCCESS);
              fetchGetAllCategoryForAdmin();
              setDialogDeleteMain(false);
            },
            (message) => {
              toast.showToast(message, ToastType.ERROR);
            }
          );
        }}
      />
    </div>
  );
}
