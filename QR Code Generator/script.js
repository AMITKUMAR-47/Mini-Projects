function generateQRCode() {
  const qrText = document.getElementById('qrText').value;
  const qrCodeDiv = document.getElementById('qrCode');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!qrText) {
    alert("Please enter a valid text or URL.");
    return;
  }

  // Clear existing QR code
  qrCodeDiv.innerHTML = "";

  // Generate the QR Code
  QRCode.toDataURL(qrText, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  }, function (err, url) {
    if (err) return console.error(err);
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = "QR Code";
    img.id = "qrImage";
    qrCodeDiv.appendChild(img);

    // Show download button
    downloadBtn.style.display = 'inline-block';
    downloadBtn.setAttribute('data-url', url);
  });
}

function downloadQRCode() {
  const url = document.getElementById('downloadBtn').getAttribute('data-url');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr_code.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
