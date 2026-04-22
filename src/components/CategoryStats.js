"use client";

export default function CategoryStats({ bills }) {

  const categoryMap = {};

  bills.forEach((bill) => {
    bill.items?.forEach((item) => {
      const cat = item.category || "Uncategorized";

      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          revenue: 0,
          qty: 0,
        };
      }

      categoryMap[cat].revenue += item.price * item.qty;
      categoryMap[cat].qty += item.qty;
    });
  });

  const sorted = Object.entries(categoryMap).sort(
    (a, b) => b[1].revenue - a[1].revenue
  );

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">Category Sales</h2>

      {sorted.length === 0 ? (
        <p>No data</p>
      ) : (
        sorted.map(([cat, data], i) => (
          <div
            key={cat}
            className="bg-white p-3 rounded-xl shadow mb-2 flex justify-between"
          >
            <div>
              <p className="font-bold">{cat}</p>
              <p className="text-sm text-gray-500">
                Sold: {data.qty} items
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">₹{data.revenue}</p>
              {i === 0 && (
                <p className="text-green-600 text-xs">
                  🔥 Top Category
                </p>
              )}
            </div>
          </div>
        ))
      )}

    </div>
  );
}