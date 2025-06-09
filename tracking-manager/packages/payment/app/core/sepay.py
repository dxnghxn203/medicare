import aiohttp
from typing import Optional
import logging
from urllib.parse import urlencode

logger = logging.getLogger(__name__)

class SepayQR:
    BASE_URL = "https://qr.sepay.vn/img"
    
    @staticmethod
    async def generate_qr(
        account: str,
        bank: str,
        amount: float,
        description: str,
        template: str = "compact",
        download: bool = False
    ) -> Optional[bytes]:
        """
        Generate QR code using SePay API
        """
        try:
            params = {
                "acc": account,
                "bank": bank,
                "amount": int(amount),
                "des": description.replace(" ", "_"),
                "template": template,
                "download": "true" if download else "false"
            }
            
            url = f"{SepayQR.BASE_URL}?{urlencode(params)}"

            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        return await response.read()
                    logger.error(f"SePay API error: {response.status}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error generating SePay QR: {str(e)}")
            return None
