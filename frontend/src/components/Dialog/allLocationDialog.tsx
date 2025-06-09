import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import AddLocation from "../Location/addLocation";
import ListLocation from "../Location/listLocation";
import UpdateLocation from "../Location/updateLocation";

const AllLocationDialog = ({
  allLocation,
  closeDialog,
  getLocation,
  selectedLocation,
  setSelectedLocation,
}: {
  allLocation: any;
  closeDialog: any;
  selectedLocation: any;
  getLocation: any;
  setSelectedLocation: any;
}) => {
  const [onAddLocation, setOnAddLocation] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  const [locationUpdate, setLocationUpdate] = useState<any>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto">
      <div className="bg-white rounded-lg w-auto shadow-lg relative my-10 transition-all duration-300">
        <div className="flex items-center justify-center relative p-4  bg-white rounded-t-lg">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => closeDialog(false)}
              className="text-gray-500 hover:text-black"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div className="text-xl text-black">Chọn địa chỉ nhận hàng</div>
        </div>

        <div className="relative w-full overflow-hidden transition-all duration-300 mb-4">
          <div
            className={`transition-transform duration-500 ease-in-out ${
              onAddLocation || updateLocation
                ? "-translate-x-full absolute"
                : "translate-x-0 relative"
            } w-full`}
          >
            <ListLocation
              allLocation={allLocation}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              setOnAddLocation={setOnAddLocation}
              setSelectedLocationUpdate={setLocationUpdate}
              setOnUpdateLocation={setUpdateLocation}
              closeDialog={closeDialog}
            />
          </div>

          <div
            className={`transition-transform duration-500 ease-in-out ${
              onAddLocation || updateLocation
                ? "translate-x-0 relative"
                : "translate-x-full absolute"
            } w-full`}
          >
            <div className="px-4">
              {onAddLocation && !updateLocation && (
                <AddLocation
                  getLocation={getLocation}
                  setOnAddLocation={setOnAddLocation}
                  setUpdateLocation={setUpdateLocation}
                  setLocationUpdate={setLocationUpdate}
                />
              )}
              {updateLocation && !onAddLocation && (
                <UpdateLocation
                  location={locationUpdate}
                  default_location={allLocation?.default_location}
                  getLocation={getLocation}
                  setUpdateLocation={setUpdateLocation}
                  setOnAddLocation={setOnAddLocation}
                  setLocationUpdate={setLocationUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLocationDialog;
