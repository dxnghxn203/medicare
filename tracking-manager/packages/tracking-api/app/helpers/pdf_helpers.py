from datetime import datetime
import platform
import pdfkit
import os

from app.entities.order.response import ItemOrderRes
from app.helpers.time_utils import get_current_time


def get_wkhtmltopdf_path():
    if platform.system() == "Windows":
        return os.path.join(os.getcwd(), "app", "static", "wkhtmltopdf", "bin", "wkhtmltopdf.exe")
    else:
        default_path = "/usr/bin/wkhtmltopdf"
        if os.path.exists(default_path):
            return default_path
        else:
            path = shutil.which("wkhtmltopdf")
            if path:
                return path
            raise FileNotFoundError("wkhtmltopdf không được cài đặt trên hệ thống.")

def export_invoice_to_pdf(order: ItemOrderRes, user_name: str):
    try:
        now = get_current_time()
        current_date = now.strftime("%d/%m/%Y")
        current_time = now.strftime("%H:%M:%S")

        items_html = ""
        product_fee_before_discount = 0
        for item in order.product:
            product_fee_before_discount += item.original_price * item.quantity

            items_html += f"""
                <tr>
                    <td>{item.product_name}</td>
                    <td style="text-align: center;">{item.quantity}</td>
                    <td style="text-align: center;">{item.unit}</td>
                    <td style="text-align: center;">{item.original_price}</td>
                    <td style="text-align: center;">{item.discount:,.0f}%</td>
                    <td style="text-align: center;">{item.quantity * item.price:,.0f}</td>
                </tr>
                """

        product_discount = product_fee_before_discount - order.product_fee
        shipping_fee_display = "Miễn phí" if order.shipping_fee == 0 else f"{order.shipping_fee:,.0f}"

        html_content = f"""
        <html>
          <body>
            <h2>HÓA ĐƠN BÁN LẺ</h2>
            <p><strong>Nhà thuốc:</strong> NHÀ THUỐC MEDICARE</p>
            <p><strong>Địa chỉ:</strong>Số 1 Võ Văn Ngân, phường Linh Chiểu, Thủ Đức, thành phố Hồ Chí Minh</p>
            <p><strong>Website:</strong> https://kltn-2025.vercel.app</p>
            <p><strong>Hotline:</strong> 18006928</p>
            <hr>
            <p><strong>Ngày:</strong> {current_date} - <strong>Giờ:</strong> {current_time}</p>
            <p><strong>Đơn hàng:</strong> {order.order_id}</p>
            <p><strong>Khách hàng:</strong> {user_name}</p>
            <hr>
            <h4>Chi tiết sản phẩm</h4>
            <table border="1" cellpadding="5" cellspacing="0" width="100%">
              <tr>
                <th>Tên sản phẩm</th>
                <th>SL</th>
                <th>Đơn vị</th>
                <th>Đơn giá</th>
                <th>Giảm giá</th>
                <th>Thành tiền</th>
              </tr>
              {items_html}
            </table>
            <br>
            <p style="text-align: right;"><strong>Giá sản phẩm:</strong> {product_fee_before_discount:,.0f}</p>
            <p style="text-align: right;"><strong>Phí vận chuyển:</strong> {shipping_fee_display}</p>
            <p style="text-align: right;"><strong>Tổng tiền:</strong> {order.basic_total_fee+product_discount:,.0f}</p>
            <p style="text-align: right;"><strong>Giảm giá sản phẩm:</strong> {product_discount:,.0f}</p>
            <p style="text-align: right;"><strong>Voucher giảm giá đơn hàng:</strong> {order.voucher_order_discount:,.0f}</p>
            <p style="text-align: right;"><strong>Voucher giảm giá phí vận chuyển:</strong> {order.voucher_delivery_discount:,.0f}</p> 
            <p style="text-align: right;"><strong>Tiền phải trả:</strong> {order.estimated_total_fee:,.0f}</p>
          </body>
        </html>
        """

        options = {
            "encoding": "UTF-8",
            "enable-local-file-access": "",
            "page-size": "A5",
            "margin-top": "10mm",
            "margin-bottom": "10mm",
            "margin-left": "10mm",
            "margin-right": "10mm"
        }

        path_wkhtmltopdf = get_wkhtmltopdf_path()
        config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

        pdf_bytes = pdfkit.from_string(html_content, False, options=options, configuration=config)

        return pdf_bytes
    except Exception as e:
        print(f"Lỗi khi tạo PDF: {e}")
        return None
