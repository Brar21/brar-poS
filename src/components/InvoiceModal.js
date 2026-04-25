"use client";

import { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { QRCodeCanvas } from "qrcode.react";

export default function InvoiceModal({ bill, storeName, onClose }) {
  const ref = useRef();
  const barcodeRef = useRef();
  const [qrImage, setQrImage] = useState(null);

  if (!bill) return null;

  const {
    items,
    total,
    discount,
    coupon,
    couponDiscount,
    finalTotal,
    paymentMethod,
    date,
  } = bill;

  const billNo = `INV-${bill.id}`;
  const upiId = bill?.upiId || "";
  const upiLink = upiId
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(storeName)}&am=${finalTotal}&cu=INR`
    : "";
  // ✅ Barcode
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, billNo);
    }
  }, [billNo]);

  // ✅ Capture QR as image
  useEffect(() => {
    const canvas = document.getElementById("qr-code");
    if (canvas) {
      setQrImage(canvas.toDataURL("image/png"));
    }
  }, [paymentMethod]);

  // ✅ PDF
  

  // ✅ PRINT (QR FIXED)
  const handlePrint = () => {
    const content = ref.current.cloneNode(true);

    const qrCanvas = content.querySelector("#qr-code");

    if (qrCanvas && qrImage) {
      const img = document.createElement("img");
      img.src = qrImage;
      img.style.width = "130px";
      qrCanvas.parentNode.replaceChild(img, qrCanvas);
    }

    const win = window.open("", "", "width=400,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial;
              text-align: center;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
    }, 300);
  };
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
  
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
  
    const imgData = canvas.toDataURL("image/png");
  
    // ✅ iOS fallback
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    if (isIOS) {
      const newTab = window.open("");
      newTab.document.write(`<img src="${imgData}" style="width:100%">`);
      return;
    }
  
    // normal PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    });
  
    pdf.addImage(imgData, "PNG", 0, 0, 80, 0);
    pdf.save(`invoice-${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-xl w-[360px] text-black shadow-xl">

        <div ref={ref} id="invoice-content" className="text-center">

          <h1 className="font-bold text-lg">{storeName}</h1>
          <p className="text-sm">Invoice</p>

          <p>Bill: {billNo}</p>
          <p>Date: {date}</p>
          <p>Payment: {paymentMethod}</p>

          <hr className="my-2" />

          {items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-2" />

          <p className="flex justify-between">
            <span>Total</span>
            <span>₹{total}</span>
          </p>

          <p className="flex justify-between">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </p>

          {couponDiscount > 0 && (
            <p className="flex justify-between">
              <span>Coupon ({coupon})</span>
              <span>-₹{couponDiscount}</span>
            </p>
          )}

          <h2 className="flex justify-between font-bold">
            <span>Final</span>
            <span>₹{finalTotal}</span>
          </h2>

          {/* BARCODE */}
          <div className="flex justify-center my-3">
            <svg ref={barcodeRef}></svg>
          </div>

          {/* QR */}
          {paymentMethod === "UPI" && upiId && (
            <div className="flex flex-col items-center mt-3">
              <p>Scan & Pay</p>
              <QRCodeCanvas id="qr-code" value={upiLink} size={130} />
              <p className="text-xs text-gray-600">
                UPI: {upiId}
              </p>
            </div>
          )}

        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-3 gap-2 mt-4">

          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white py-3 rounded-lg text-lg"
          >
            PDF
          </button>

          <button
            onClick={handlePrint}
            className="bg-green-600 text-white py-3 rounded-lg text-lg"
          >
            Print
          </button>

          <button
            onClick={onClose}
            className="bg-red-600 text-white py-3 rounded-lg text-lg"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}