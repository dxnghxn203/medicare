/**
 * Generates a random ID that's safe to use in client-side code
 */
export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};

export const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            if (diffMinutes === 0) {
                return "Vừa xong";
            }
            return `${diffMinutes} phút trước`;
        }
        return `${diffHours} giờ trước`;
    } else if (diffDays < 30) {
        return `${diffDays} ngày trước`;
    } else {
        return formatDate(dateString);
    }
};
export const formatCurrency = (amount: number): string => {
    if (amount === undefined || amount === null) return "0đ";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
export const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) return "";

    // Format giờ (12h format)
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Format ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
};

export const formatDateCSV = (input: string): string => {
  try {
    const cleaned = input.replace(/\.\d{6}/, (match) => `.${match.slice(1, 4)}`);
    const date = new Date(cleaned);

    if (isNaN(date.getTime())) return 'Invalid Date';
    return `"${date.toISOString().replace('T', ' ').slice(0, 19)}"`;    
  } catch {
    return 'Invalid Date';
  }
};