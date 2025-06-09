package helper

import (
	"encoding/base64"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type SendEmailRequest struct {
	ToEmail          string
	Subject          string
	HtmlContent      string
	PlainTextContent string
	Attachments      map[string][]byte
}

func SendEmail(req SendEmailRequest) error {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	fromEmail := os.Getenv("SENDGRID_GMAIL")

	if apiKey == "" || fromEmail == "" {
		return fmt.Errorf("missing SendGrid configuration: API key or sender email not found")
	}

	m := mail.NewV3Mail()

	from := mail.NewEmail("Medicare", fromEmail)
	m.SetFrom(from)

	m.Subject = req.Subject

	p := mail.NewPersonalization()
	p.AddTos(mail.NewEmail("", req.ToEmail))

	m.AddPersonalizations(p)

	if req.PlainTextContent != "" {
		m.AddContent(mail.NewContent("text/plain", req.PlainTextContent))
	}

	if req.HtmlContent != "" {
		m.AddContent(mail.NewContent("text/html", req.HtmlContent))
	}

	if len(req.Attachments) > 0 {
		for filename, content := range req.Attachments {
			attachment := mail.NewAttachment()
			attachment.SetContent(encodeBase64(content))
			attachment.SetType(getContentType(filename))
			attachment.SetFilename(filename)
			attachment.SetDisposition("attachment")
			m.AddAttachment(attachment)
		}
	}

	client := sendgrid.NewSendClient(apiKey)
	response, err := client.Send(m)

	if err != nil {
		slog.Error("Failed to send email", "error", err)
		return err
	}

	if response.StatusCode >= 400 {
		slog.Error("SendGrid API error",
			"status_code", response.StatusCode,
			"body", response.Body)

		if len(req.Attachments) > 0 {
			slog.Error("Email had attachments",
				"attachment_count", len(req.Attachments),
				"attachment_names", fmt.Sprintf("%v", getMapKeys(req.Attachments)))
		}

		return fmt.Errorf("failed to send email: status code %d", response.StatusCode)
	}

	slog.Info("Email sent successfully",
		"to", req.ToEmail,
		"status_code", response.StatusCode)
	return nil
}
func getContentType(filename string) string {
	ext := filepath.Ext(filename)
	switch ext {
	case ".pdf":
		return "application/pdf"
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".txt":
		return "text/plain"
	default:
		return "application/octet-stream"
	}
}
func encodeBase64(data []byte) string {
	// Return simple base64 encoded string without line breaks
	return base64.StdEncoding.EncodeToString(data)
}

func SendOtpEmail(email, otpCode string) error {
	slog.Info("Gửi email OTP đến:", "email", email)
	slog.Info("Mã OTP:", "otpCode", otpCode)
	subject := "Your OTP Code"
	htmlContent := fmt.Sprintf(`
        <html>
        <body>
            <h3>Mã OTP của bạn là: <strong>%s</strong></h3>
            <p>Mã chỉ có hiệu lực 5 phút</p>
        </body>
        </html>`, otpCode)

	return SendEmail(SendEmailRequest{
		ToEmail:     email,
		Subject:     subject,
		HtmlContent: htmlContent,
	})
}

func SendInvoiceEmail(email string, pdfBytes []byte, orderID string) error {
	subject := fmt.Sprintf("Hóa đơn mua hàng #%s", orderID)
	slog.Info("Gửi email hóa đơn đến:", "email", email)
	slog.Info("Hóa đơn ID:", "orderID", orderID)
	htmlContent := `
		<html>
		<body>
			<h3>Cảm ơn bạn đã mua hàng tại Medicare!</h3>
			<p>Hóa đơn mua hàng của bạn được đính kèm trong email này.</p>
		</body>
		</html>`

	attachments := map[string][]byte{
		fmt.Sprintf("%s.pdf", orderID): pdfBytes,
	}

	return SendEmail(SendEmailRequest{
		ToEmail:     email,
		Subject:     subject,
		HtmlContent: htmlContent,
		Attachments: attachments,
	})
}

func SendOrderStatusUpdateEmail(email, orderID, status string) error {
	subject := fmt.Sprintf("Cập nhật trạng thái đơn hàng #%s", orderID)
	slog.Info("Gửi email cập nhật trạng thái đơn hàng", "email", email, "orderID", orderID, "status", status)
	htmlContent := fmt.Sprintf(`
		<html>
		<body>
			<h3>Đơn hàng #%s của bạn đã được cập nhật trạng thái:</h3>
			<p><strong>%s</strong></p>
			<p>Cảm ơn bạn đã mua sắm tại Medicare!</p>
		</body>
		</html>`, orderID, status)

	return SendEmail(SendEmailRequest{
		ToEmail:     email,
		Subject:     subject,
		HtmlContent: htmlContent,
	})
}

func getMapKeys(m map[string][]byte) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}
