import ProductFindList from "@/components/Product/productFindList";

export default function Search() {
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <div className="px-4 mb-4 space-y-2">
        <h4 className="text-xl text-black item-start pt-14 font-bold ">
          Kết quả tìm kiếm
        </h4>
      </div>

      <main className="flex flex-col space-y-8 items-center ">
        <ProductFindList />
      </main>
    </div>
  );
}
