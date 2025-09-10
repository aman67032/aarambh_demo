import qrcode

# Website link
url = "https://aarambh.jklu.edu.in"

# Generate QR code
qr = qrcode.make(url)

# Save QR code image
qr.save("aarambh_qr.png")

print("✅ QR code saved as 'aarambh_qr.png'")
