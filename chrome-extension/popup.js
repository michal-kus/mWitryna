document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tab.url;

  generateQRCode(currentUrl);
});

function generateQRCode(url) {
  const qrcodeContainer = document.getElementById('qrcode');

  const qrSize = 200;
  const mobywatelData = btoa(JSON.stringify({ url, timestamp: Date.now() }));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(`mobywatel://verify?data=${mobywatelData}`)}`;

  const qrImage = document.createElement('img');
  qrImage.src = qrUrl;
  qrImage.alt = 'QR Code';
  qrImage.style.width = '200px';
  qrImage.style.height = '200px';

  qrcodeContainer.appendChild(qrImage);
}
