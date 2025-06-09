import os
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
import base64
from sendgrid import SendGridAPIClient, Attachment, FileContent, FileName, FileType, Disposition
from sendgrid.helpers.mail import Mail

from typing import Optional, List

from app.core import logger

# GMAIL_USER=os.getenv("GMAIL_USER")
# GMAIL_PASSWORD=os.getenv("GMAIL_PASS")
SENDGRID_API_KEY= os.getenv("SENDGRID_API_KEY")
SENDGRID_GMAIL= os.getenv("SENDGRID_GMAIL")

def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    attachments: Optional[List[tuple]] = None,
) -> bool:
    try:
        # msg = MIMEMultipart()
        # msg["From"] = GMAIL_USER
        # msg["To"] = to_email
        # msg["Subject"] = subject
        # msg.attach(MIMEText(html_content, "html"))
        #
        # if attachments:
        #     for filename, file_bytes in attachments:
        #         part = MIMEApplication(file_bytes, _subtype="pdf")
        #         part.add_header("Content-Disposition", "attachment", filename=filename)
        #         msg.attach(part)
        #
        # server = smtplib.SMTP("smtp.gmail.com", 587)
        # server.starttls()
        # server.login(GMAIL_USER, GMAIL_PASSWORD)
        # server.sendmail(GMAIL_USER, to_email, msg.as_string())
        # server.quit()

        message = Mail(
            from_email=SENDGRID_GMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content,

        )
        if attachments:
            for filename, file_bytes in attachments:
                encoded_file = base64.b64encode(file_bytes).decode()
                attachment = Attachment(
                    FileContent(encoded_file),
                    FileName(filename),
                    FileType('application/pdf'),
                    Disposition('attachment')
                )
                message.add_attachment(attachment)

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            logger.info(f"Email sent with status code: {response.status_code}")
            logger.info(f"Email sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Error sending email via SendGrid: {str(e)}")
            return False

    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

def send_otp_email(email: str, otp_code: str) -> bool:
    subject = "Your OTP Code"
    html_content = f"""
        <html>
        <body>
            <h3>Mã OTP của bạn là: <strong>{otp_code}</strong></h3>
            <p>Mã chỉ có hiệu lực 5 phút</p>
        </body>
        </html>
    """
    return send_email(email, subject, html_content)

def send_new_password_email(email: str, new_password: str) -> bool:
    subject = "Mật khẩu mới của bạn"
    html_content = f"""
        <html>
        <body>
            <h3>Mật khẩu mới của bạn là: <strong>{new_password}</strong></h3>
            <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập để đảm bảo an toàn.</p>
        </body>
        </html>
    """
    return send_email(email, subject, html_content)

from email.mime.application import MIMEApplication

def send_invoice_email(email: str, pdf_bytes: bytes, order_id: str) -> bool:
    subject = f"Hóa đơn mua hàng #{order_id}"
    html_content = f"""
        <html>
        <body>
            <h3>Cảm ơn bạn đã mua hàng tại Medicare!</h3>
            <p>Hóa đơn mua hàng của bạn được đính kèm trong email này.</p>
        </body>
        </html>
    """
    attachment = [(f"{order_id}.pdf", pdf_bytes)]
    return send_email(email, subject, html_content, attachments=attachment)

def send_new_pharmacist_email(email: str, otp_code: str, password: str) -> bool:
    subject = "Tài khoản dược sĩ của bạn đã được tạo"
    html_content = f"""
            <html>
            <body>
                <h3>Mã OTP của bạn là: <strong>{otp_code}</strong></h3>
                <p>Mã chỉ có hiệu lực 5 phút. Vui lòng xác thực tài khoản trước khi đăng nhập</p>
                <h3>Mật khẩu của bạn là: <strong>{password}</strong></h3>
                <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập để đảm bảo an toàn.</p>
            </body>
            </html>
        """
    return send_email(email, subject, html_content)

