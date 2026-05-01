export default function UdhaarSummary({ bills = [] }) {

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
            <div key={i} className="border p-3 mb-2 rounded bg-yellow-50">
              <p className="font-bold">{c.name}</p>
              <p className="text-sm">{c.phone}</p>
              <p className="text-red-600">₹{c.due}</p>
            </div>
          ))
        )}
      </div>
    );
  }