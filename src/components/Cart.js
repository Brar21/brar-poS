

export default function Cart({
  cart,
  updateQty,
  removeItem,
  total,
  discount,
  setDiscount,
  coupon,
  setCoupon,
  applyCoupon,
  couponDiscount,
  paymentMethod,
  setPaymentMethod,
  checkout,
  finalTotal,
}) {


  return (
    <div className="w-full bg-white flex flex-col h-full border-l">

  {/* HEADER */}
  <div className="p-4 border-b">
    <h2 className="text-xl font-bold text-black">Current Bill</h2>
  </div>

  {/* ITEMS */}
  <div className="flex-1 overflow-y-auto p-3 space-y-2">

    {cart.length === 0 && (
      <p className="text-gray-500 text-center mt-10">
        No items added
      </p>
    )}

{cart.map((item) => (
  <div
    key={item.id}
    className="flex items-center justify-between bg-gray-50 p-3 text-black rounded-lg mb-2 overflow-hidden"
  >
    {/* LEFT - NAME */}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-black truncate">
        {item.name}
      </p>
      <p className="text-xs text-gray-500">
        ₹{item.price}
      </p>
    </div>

    {/* RIGHT - CONTROLS */}
    <div className="flex items-center gap-2 flex-shrink-0">

    <button
        onClick={() => updateQty(item.id)}
        className="text-red-500 text-sm ml-1"
      >
        -
      </button>
      {/* QTY */}
      <span className="w-6 text-center">
        {item.qty}
      </span>

  

      {/* ❌ */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-red-500 text-sm ml-1"
      >
        ✕
      </button>

    </div>
  </div>
))}

  </div>

  {/* FOOTER */}
  <div className="p-4 border-t space-y-3">
{/* DISCOUNT */}
<div>
  <label className="text-sm text-gray-600">Discount (₹)</label>
  <input
    type="number"
    value={discount}
    onChange={(e) => setDiscount(Number(e.target.value))}
    className="w-full border-black border text-black p-2 rounded-lg mt-1"
    placeholder="Enter discount"
  />
</div>

{/* COUPON */}
<div>
  <label className="text-sm text-gray-600">Coupon Code</label>
  <div className="flex flex-row gap-2 mt-1">
    <input
      value={coupon}
      onChange={(e) => setCoupon(e.target.value)}
      className="flex-1 border-black border text-black p-2 rounded-lg"
      placeholder="Enter coupon"
    />
  
    <button
      onClick={() => applyCoupon(coupon)}
      className="bg-black text-white px-3 rounded-lg"
    >
      Apply
    </button>
  </div>
  {/* QUICK COUPONS */}
  <div className="flex gap-2 flex-row my-2">
  {["SAVE10", "FLAT50", "UPI5"].map((code) => (
    <button
      key={code}
      onClick={() => {
        setCoupon(code);
        applyCoupon(code);
      }}
      className="bg-gray-200 px-3 py-1 border border-black text-black rounded-full text-sm active:scale-95 active:bg-green-400 active:text-white"
    >
      {code}
    </button>
  ))}
</div>
  {couponDiscount > 0 && (
    <p className="text-green-600 text-sm mt-1">
      Coupon Applied: -₹{couponDiscount}
    </p>
  )}
</div>
    {/* PAYMENT */}
    <div className="flex gap-2">
      <button
        onClick={() => setPaymentMethod("CASH")}
        className={`flex-1 py-2 text-black rounded-xl ${
          paymentMethod === "CASH"
            ? "bg-black text-white"
            : "bg-gray-200"
        }`}
      >
        Cash
      </button>

      <button
        onClick={() => setPaymentMethod("UPI")}
        className={`flex-1 py-2 text-black rounded-xl ${
          paymentMethod === "UPI"
            ? "bg-green-600 text-white"
            : "bg-gray-200"
        }`}
      >
        UPI
      </button>
    </div>

    {/* TOTAL */}
    <div className="space-y-1 text-sm text-gray-700">
  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹{total}</span>
  </div>

  {discount > 0 && (
    <div className="flex justify-between text-red-500">
      <span>Discount</span>
      <span>-₹{discount}</span>
    </div>
  )}

  {couponDiscount > 0 && (
    <div className="flex justify-between text-green-600">
      <span>Coupon</span>
      <span>-₹{couponDiscount}</span>
    </div>
  )}
</div>

<div className="flex justify-between text-lg font-bold text-black pt-2 border-t">
  <span>Total</span>
  <span>₹{finalTotal}</span>
</div>
    {/* CHECKOUT */}
    <button
      onClick={checkout}
      className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-bold"
    >
      Generate Bill
    </button>

  </div>
</div>
  );
}