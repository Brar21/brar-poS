"use client";

export default function Cart({
    cart,
    updateQty,
    removeItem,
    total, discount,
    setDiscount,
    coupon,
    setCoupon,
    applyCoupon,
    couponDiscount,
    paymentMethod,
    setPaymentMethod,
    checkout,
    finalTotal
}) {
    return (
        <div className="
        w-full
        bg-white 
        p-4
        flex flex-col
        h-full
      ">

            <h2 className="text-lg font-bold mb-2 text-black">
                Cart
            </h2>

            <div className="flex-1 overflow-y-auto">

                {cart.length === 0 && (
                    <p className="text-black">No items</p>
                )}

                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center mb-3 border-b pb-2"
                    >

                        <div>
                            <p className="text-black font-medium">
                                {item.name}
                            </p>
                            <p className="text-black text-sm">
                                ₹{item.price}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <button
                                onClick={() => updateQty(item.id, "dec")}
                                className="w-10 h-10 bg-red-500 text-white rounded text-xl"
                            >
                                -
                            </button>

                            <span className="text-black font-bold text-lg">
                                {item.qty}
                            </span>

                            <button
                                onClick={() => updateQty(item.id, "inc")}
                                className="w-10 h-10 bg-green-500 text-white rounded text-xl"
                            >
                                +
                            </button>

                        </div>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 text-lg"
                        >
                            ✕
                        </button>

                    </div>
                ))}

            </div>
            <input
                type="number"
                placeholder={coupon}
                value={coupon}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="border p-2 rounded w-full text-black"
            />

            {/* Coupons */}
            <div className="flex gap-3 mt-3">
            <button onClick={() => applyCoupon("No-Discount")} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">No-Discount</button>
                <button onClick={() => applyCoupon("UPI5")} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">UPI 5%</button>
                <button onClick={() => applyCoupon("SAVE10")} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">SAVE10</button>
                <button onClick={() => applyCoupon("FLAT50")} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">FLAT50</button>
            </div>

            {/* Payment */}
            <div className="flex gap-2 mt-3">

                <button
                    onClick={() => setPaymentMethod("CASH")}
                    className={`flex-1 p-3 rounded-lg text-lg ${paymentMethod === "CASH"
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black"
                        }`}
                >
                    Cash
                </button>

                <button
                    onClick={() => setPaymentMethod("UPI")}
                    className={`flex-1 p-3 rounded-lg text-lg ${paymentMethod === "UPI"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                >
                    UPI
                </button>

            </div>

            <h2 className="text-lg text-black font-bold mt-2">₹{finalTotal}</h2>

            <button onClick={checkout} className="bg-green-600 text-white p-4 rounded-xl w-full mt-4 text-xl font-bold">
                Generate Bill {total === 0 ? "" : <span>₹{finalTotal}</span>}
            </button>
            {/* TOTAL */}
            <div className="border-t pt-3 text-black">

                <h2 className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                </h2>



            </div>

        </div>
    );
}