"use client";

export default function UdhaarSummary({ bills = [], onSelectCustomer }) {

  const customerMap = {};

  (bills || []).forEach((b) => {
    if (b?.isCredit && b?.dueAmount > 0 && b?.customerPhone) {

      if (!customerMap[b.customerPhone]) {
        customerMap[b.customerPhone] = {
          name: b.customerName || "No Name",
          phone: b.customerPhone,
          due: 0,
          bills: 0,
        };
      }

      customerMap[b.customerPhone].due += b.dueAmount;
      customerMap[b.customerPhone].bills += 1;
    }
  });

  const data = Object.values(customerMap);

  return (
    <div className="p-4 bg-white min-h-screen text-black">
      <h2 className="text-xl font-bold mb-4">💰 Udhaar Summary</h2>

      {data.length === 0 ? (
        <p>No udhaar customers</p>
      ) : (
        data.map((c, i) => (
          <div
            key={i}
            className="border p-3 mb-2 rounded bg-yellow-50 cursor-pointer"
            
            // ✅ CLICK → OPEN CUSTOMER DETAIL PAGE
            onClick={() => onSelectCustomer && onSelectCustomer(c.phone)}
          >
            <p className="font-bold">{c.name}</p>
            <p className="text-sm">{c.phone}</p>
            <p className="text-red-600">₹{c.due}</p>

            {/* ✅ WHATSAPP BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ❗ prevent card click
                const msg = `Dear ${c.name}, your pending udhaar is ₹${c.due}. Please clear it.`;
                const url = `https://wa.me/91${c.phone}?text=${encodeURIComponent(msg)}`;
                window.open(url);
              }}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              WhatsApp Reminder 📲
            </button>
          </div>
        ))
      )}
    </div>
  );
}