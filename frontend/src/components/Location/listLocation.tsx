import {IoIosAddCircleOutline} from "react-icons/io";
import {IoChevronForward} from "react-icons/io5";
import {SlLocationPin} from "react-icons/sl";
import {useState} from "react";

const ListLocation = ({
                          allLocation,
                          selectedLocation,
                          setSelectedLocation,
                          setOnAddLocation,
                          setSelectedLocationUpdate,
                          setOnUpdateLocation,
                          closeDialog,
                      }: any) => {
    const [tempLocation, setTempLocation] = useState<any>(null); // State lưu địa chỉ tạm thời

    const handleUpdateLocation = (location: any) => {
        setSelectedLocationUpdate(location);
        setTempLocation(location);
        setOnUpdateLocation(true);
    };

    const handleConfirmUpdate = () => {
        if (tempLocation) {
            setSelectedLocation(tempLocation);
        }
        closeDialog(false); // Đóng dialog sau khi xác nhận
    };

    return (
        <>
            <div className="pl-6 text-gray-600 w-full bg-black/5 h-10 flex items-center justify-between">
                Địa chỉ của tôi
            </div>

            <div className="overflow-y-scroll max-h-[550px] space-y-4 pt-2">
                {allLocation &&
                    allLocation.locations.map((location: any) => (
                        <div key={location.location_id} className="w-full">
                            <div
                                className="flex flex-col w-full py-2 cursor-pointer px-6"
                                onClick={() => {
                                    setSelectedLocation(location);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {/* Radio button */}
                                        <div
                                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                                                selectedLocation?.location_id === location.location_id
                                                    ? "border-blue-600"
                                                    : "border-gray-300"
                                            } relative`}
                                        >
                                            <input
                                                type="radio"
                                                name="select-pharmacy"
                                                checked={
                                                    selectedLocation?.location_id === location.location_id
                                                }
                                                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                className={`w-2 h-2 rounded-full bg-blue-600 transition-all ${
                                                    selectedLocation?.location_id === location.location_id
                                                        ? "opacity-100 scale-100"
                                                        : "opacity-0 scale-0"
                                                }`}
                                            />
                                        </div>

                                        <span className="ml-2 py-1 text-[14px] font-medium text-black rounded-full">
                      {location?.name}
                    </span>

                                        <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>

                                        <span className="text-[14px] font-medium text-black/70">
                      {location?.phone_number}
                    </span>

                                        {location?.location_id === allLocation.default_location && (
                                            <span className="ml-2 text-xs text-[#0053E2] font-medium">
                        (Địa chỉ mặc định)
                      </span>
                                        )}
                                    </div>

                                    {/*<<<<<<< HEAD*/}
                                    {/*                                    <button*/}
                                    {/*                                        onClick={() => handleUpdateLocation(location)} // Gọi hàm khi bấm Cập nhật*/}
                                    {/*                                        className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-sm transition"*/}
                                    {/*                                    >*/}
                                    {/*                                        Cập nhật*/}
                                    {/*                                    </button>*/}
                                    {/*                                </div>*/}
                                    {/*=======*/}
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateLocation(location)} // Gọi hàm khi bấm Cập nhật
                                        className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-sm transition"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                                {/*>>>>>>> d758706a0c38ccba1b5a8d6f8e54a30c31c2e00c*/}

                                <div className="flex items-center text-sm text-black/50 ml-7 py-1">
                  <span>
                    {location?.address}, {location?.ward}, {location?.district},{" "}
                      {location?.province}
                  </span>
                                </div>
                            </div>
                            <hr className="mx-10 border-t border-gray-300"/>
                        </div>
                    ))}

                {/*                <div className="flex items-center px-6">*/}
                {/*                    <button*/}
                {/*                        className="bg-gray-100 text-gray-700 px-2 py-2 rounded-lg text-sm font-medium"*/}
                {/*                        onClick={() => setOnAddLocation(true)}*/}
                {/*                    >*/}
                {/*                        + Thêm địa chỉ mới*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*<<<<<<< HEAD*/}
                {/*            <div className="flex justify-end mt-6 space-x-4 px-6">*/}
                {/*                <button*/}
                {/*                    className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-lg"*/}
                {/*                    onClick={() => {*/}
                {/*                        closeDialog(false);*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    Hủy*/}
                {/*                </button>*/}
                {/*                <button*/}
                {/*                    onClick={handleConfirmUpdate} // Xác nhận thay đổi*/}
                {/*                    className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"*/}
                {/*                >*/}
                {/*                    Xác nhận*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </>*/}
                {/*    );*/}
                {/*=======*/}
                <div className="flex items-center px-6">
                    <button
                        className="bg-gray-100 text-gray-700 px-2 py-2 rounded-lg text-sm font-medium"
                        onClick={() => setOnAddLocation(true)}
                    >
                        + Thêm địa chỉ mới
                    </button>
                </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4 px-6">
                <button
                    type="button"
                    className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-lg"
                    onClick={() => {
                        closeDialog(false);
                    }}
                >
                    Hủy
                </button>
                <button
                    type="button"
                    onClick={handleConfirmUpdate} // Xác nhận thay đổi
                    className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
                >
                    Xác nhận
                </button>
            </div>
        </>
    );
// >>>>>>> d758706a0c38ccba1b5a8d6f8e54a30c31c2e00c
};

export default ListLocation;
