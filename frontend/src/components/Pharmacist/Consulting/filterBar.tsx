interface FilterBarProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export default function FilterBar({
  status,
  onStatusChange,
}: FilterBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onStatusChange(e.target.value);
    };

  const handleClearStatus = () => {
    onStatusChange("");
  };
  return (
    <div className="flex gap-4 justify-between">
      {/* Bộ lọc */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Status</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearStatus}
          >
            Clear
          </span>
        </div>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={status}
          onChange={handleChange}
        >
          <option key="" value="">Chọn trạng thái</option>
          <option key="approved" value="approved">Đã duyệt</option>
          <option key="rejected" value="rejected">Đã từ chối</option>
          <option key="pending" value="pending">Chờ duyệt</option>
          <option key="uncontacted" value="uncontacted">Chưa liên lạc được</option>
        </select>
      </div>
    </div>
  );
}
