import React, { useEffect } from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { useBrand } from "@/hooks/useBrand";

interface BrandProps {
  name: string;
  logo: string;
}

const BrandItem: React.FC<BrandProps> = ({ name, logo }) => (
  <Link
    href={`/thuong-hieu/${encodeURIComponent(name)}`}
    className="flex flex-col items-center"
  >
    <div className="flex justify-center items-center rounded-full bg-neutral-100 md:h-[170px] md:w-[170px] w-[120px] h-[120px] md:px-5">
      <img
        loading="lazy"
        src={logo}
        alt={`${name} logo`}
        className="object-contain w-28 aspect-[1.12]"
      />
    </div>
    <div className="mt-2 text-lg font-semibold text-black text-center">
      {name}
    </div>
  </Link>
);

const BrandList: React.FC = () => {
  const { getAllBrandsUser, fetchGetAllBrandUser } = useBrand();

  useEffect(() => {
    fetchGetAllBrandUser(
      () => {},
      () => {}
    );
  }, []);

  if (!getAllBrandsUser.length) return null;

  return (
    <div className="w-full">
      <div className="flex justify-end text-sm font-semibold text-black mb-4">
        <Link href="/thuong-hieu" className="flex items-center gap-2">
          <span>Xem tất cả</span>
          <FaArrowRightLong />
        </Link>
      </div>

      <div className="grid grid-cols-2 max-md:gap-x-4 gap-y-6 max-lg:grid-cols-3 md:flex md:justify-around">
        {getAllBrandsUser.slice(0, 6).map((brand: any, index: number) => (
          <div key={index} className="flex justify-center w-full">
            <BrandItem {...brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
