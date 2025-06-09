"use client";
import React, { useEffect } from "react";
import { AddressFormData } from "../ProductInfo/types";
import { PiFireTruck } from "react-icons/pi";
import { useLocation } from "@/hooks/useLocation";

interface ShippingAddressProps {
  address: AddressFormData;
  onChange: (address: AddressFormData) => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
  address,
  onChange,
}) => {
  const inputClass =
    "w-full px-5 py-4 rounded-xl border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none placeholder:text-[14px] placeholder:font-normal";

  const buttonClass =
    "flex items-center justify-between flex-1 px-5 py-4 rounded-xl border border-black/10 focus:border-[#0053E2] bg-white focus:ring-1 focus:ring-[#0053E2] outline-none";

  const {
    cities,
    districts,
    wards,
    getDistrictsByCityId,
    getCities,
    getWardsByDistrictId,
  } = useLocation();

  useEffect(() => {
    getCities();
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-6">
      <header className="flex gap-2 self-start text-sm text-black">
        <PiFireTruck className="text-2xl text-[#0053E2] mt-[-2px]" />
        <h3>Địa chỉ nhận hàng</h3>
      </header>
      <div className="flex gap-2 text-sm">
        <div className="relative flex-1">
          <select
            value={address.cityCode || ""}
            onChange={(e) => {
              const cityCode = Number(e.target.value);
              onChange({
                ...address,
                city: e.target.selectedOptions[0].text,
                cityCode: cityCode,
                district: "",
                districtCode: undefined,
                ward: "",
                wardCode: undefined,
              });
              if (cityCode) getDistrictsByCityId(cityCode.toString());
            }}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>
              Chọn tỉnh/ thành phố
            </option>
            {cities.map((city: any) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <select
            value={address.districtCode || ""}
            onChange={(e) => {
              const districtCode = Number(e.target.value);
              onChange({
                ...address,
                district: e.target.selectedOptions[0].text,
                districtCode: districtCode,
                ward: "",
                wardCode: undefined,
              });
              if (districtCode) getWardsByDistrictId(districtCode.toString());
            }}
            disabled={!address.city || districts.length === 0}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>
              Chọn quận/ huyện
            </option>
            {districts.map((district: any) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <select
            value={address.wardCode || ""}
            onChange={(e) => {
              const wardCode = Number(e.target.value);
              onChange({
                ...address,
                ward: e.target.selectedOptions[0].text,
                wardCode: wardCode,
              });
            }}
            disabled={!address.district || wards.length === 0}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>
              Chọn phường/ xã
            </option>
            {wards.map((ward: any) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input
        type="text"
        value={address.address}
        onChange={(e) => onChange({ ...address, address: e.target.value })}
        placeholder="Địa chỉ cụ thể"
        className={inputClass}
      />
    </section>
  );
};
