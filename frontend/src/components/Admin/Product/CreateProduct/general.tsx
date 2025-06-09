
const General = () => {
  return (
    <>
      <div className="space-y-5">
        <div className="pt-5">
          <label htmlFor="product_name" className="block mb-1 font-medium text-gray-900">
            Product Name
          </label>
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 border">
            <input
              type="text"
              id="product_name"
              name="product_name"
              placeholder="VD: Thuốc kháng sinh 30mg"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
          <p className="text-sm mt-1">
            Note: A product name is required and recommended to be unique.
          </p>
        </div>
        <div>
          <label htmlFor="product_desc" className="block font-medium mb-1">Description</label>
          <textarea
            id="product_desc"
            name="product_desc"
            placeholder="VD: Thuốc kháng sinh 30mg, điều trị viêm phổi, viêm phế quản..."
            className="block min-w-0 w-[100%] grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 border rounded-md"
            rows={4}
          />
          <p className="text-sm mt-1">
            Note: Set a description to the product for better visibility.
          </p>
        </div>
      </div>
    </>
  );
};

export default General;
