export const ADMIN_ROUTES = [
    '/dashboard',
    '/quan-ly-nguoi-dung',
    '/quan-ly-don-hang',
    '/san-pham',
    '/quan-ly-danh-muc',
    '/dang-nhap-admin',
    '/thong-tin-tai-khoan',
    '/doi-mat-khau-admin',
    '/quen-mat-khau',
    '/dang-ky-admin',
    '/quan-ly-giam-gia',
    '/quan-ly-voucher',
    'quan-ly-bai-viet',
    '/quan-ly-thuong-hieu',
    '/quan-ly-bai-viet',
    
] as const;

export const isVerifyEmailRoute = (path: string): boolean => {
    return /^\/dang-ky-admin\/xac-thuc-[^/]+$/.test(path);
};
export const getVerifyEmailPath = (email: string): string => {
    return `/dang-ky-admin/xac-thuc-${email}`;
};
export const PHARMACIST_ROUTES = [
    '/dashboard-duoc-si',
    '/kiem-duyet-thuoc',
    '/thong-tin-tai-khoan-duoc-si',
    '/doi-mat-khau-duoc-si',
    '/quen-mat-khau-duoc-si',
    '/kiem-duyet-yeu-cau-tu-van-thuoc',
    '/duyet-yeu-cau',
    '/phong-tu-van'
] as const;

export const PARTNER_ROUTES = [
    '/status-order',
    '/partner/partner-order',
]

export const COOKIE_TOKEN_KEY = '_x_sec_at_data'
export const COOKIE_TOKEN_KEY_ADMIN = '_x_sec_at_data_ad'
export const COOKIE_TOKEN_KEY_PHARMACIST = '_x_sec_at_data_phar'

export const COOKIE_TOKEN_EXPIRED = 60 * 60 * 24 * 7;
export const COOKIE_SESSION_KEY = '_x_sec_at_session'
export const COOKIE_SESSION_EXPIRED = 60 * 30;

export const PAYMENT_COD = 'COD';
export const PAYMENT_TP_BANK_QR = 'TPBANK_QR'
export const PAYMENT_BIDV_BANK_QR = 'BIDV_QR'
