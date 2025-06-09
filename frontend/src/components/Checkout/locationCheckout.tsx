import { useLocation } from "@/hooks/useLocation";
import { use, useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineUserCircle } from "react-icons/hi2";
import {
  IoChevronForward,
  IoCloseCircle,
  IoCloseOutline,
} from "react-icons/io5";
import AllLocationDialog from "../Dialog/allLocationDialog";
import { getLocationDefault } from "@/utils/location";
import { TiLocation } from "react-icons/ti";

const LocationCheckout = ({
  setDataLocation,
  setNote,
}: {
  setDataLocation: (data: any) => void;
  setNote: (data: any) => void;
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const { allLocation, getAllLocation } = useLocation();
  const [loadingGetLocation, setLoadingGetLocation] = useState(false);
  const [openModalLocation, setOpenModalLocation] = useState(false);

  const getLocation = () => {
    setLoadingGetLocation(true);
    getAllLocation(
      () => {
        setLoadingGetLocation(false);
        // const location_default = getLocationDefault(
        //   allLocation?.default_location,
        //   allLocation?.locations
        // );
        // setDataLocation(location_default);
        // setSelectedLocation(location_default);
      },
      () => {
        setLoadingGetLocation(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setDataLocation(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (allLocation && allLocation.locations?.length > 0) {
      const location_default = getLocationDefault(
        allLocation.default_location,
        allLocation.locations
      );
      setDataLocation(location_default);
      setSelectedLocation(location_default);
    }
  }, [allLocation]);
  return (
    <section className="flex flex-col">
      <header className="flex self-start text-black gap-1">
        <TiLocation className="text-2xl text-[#0053E2] mt[-2]" />
        <h2 className="text-[#0053E2]">Địa Chỉ Nhận Hàng</h2>
      </header>

      {allLocation &&
      allLocation.locations &&
      allLocation.locations.length > 0 ? (
        <>
          {selectedLocation ? (
            <>
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center">
                  <span className="text-[14px] font-semibold text-black rounded-full">
                    {selectedLocation?.name}
                  </span>

                  <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                  <span className="text-[14px] font-semibold">
                    {selectedLocation?.phone_number}
                  </span>
                </div>
                <button
                  className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
                  type="button"
                  onClick={(e) => {
                    setOpenModalLocation(true);
                  }}
                >
                  Thay đổi
                  {/* <IoChevronForward className="mr-1 text-[#0053E2] text-lg" /> */}
                </button>
              </div>
              <div className="flex items-center text-sm font-normal">
                {/* <MdLocationOn className="text-base text-black/50 mr-1" /> */}
                <span>
                  {selectedLocation?.address}, {selectedLocation?.ward},{" "}
                  {selectedLocation?.district}, {selectedLocation?.province}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between ml-6">
              <div className="flex items-center gap-2">
                <FaLocationDot className="text-[#0053E2] animate-pulse" />
                <span className="py-1 text-[14px] font-medium text-black/70">
                  Đang tải địa chỉ...
                </span>
              </div>
              <button
                className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
                onClick={(e) => {
                  setOpenModalLocation(true);
                }}
                type="button"
              >
                Chọn địa chỉ
                <IoChevronForward className="ml-1 text-[#0053E2] text-lg" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between ml-6 ">
          <div className="flex items-center">
            <span className="py-1 text-[14px] font-medium text-black rounded-full">
              Chưa có địa chỉ
            </span>
          </div>
          <button
            className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
            onClick={(e) => {
              setOpenModalLocation(true);
            }}
            type="button"
          >
            Thêm địa chỉ
            <IoChevronForward className="mr-1 text-[#0053E2] text-lg" />
          </button>
        </div>
      )}

      <div className="relative w-full mt-4">
        <label
          htmlFor="note"
          className="absolute text-xs text-gray-500 left-4 top-2"
        >
          Ghi chú (không bắt buộc)
        </label>
        <textarea
          onChange={(e) => setNote(e.target.value)}
          className="pt-6 w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                  focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] placeholder:font-normal placeholder:text-[14px]"
          placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao hàng"
          rows={4}
        />
      </div>

      {openModalLocation && (
        <AllLocationDialog
          allLocation={allLocation}
          closeDialog={setOpenModalLocation}
          getLocation={getLocation}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      )}
    </section>
  );
};
export default LocationCheckout;
