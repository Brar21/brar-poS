"use client";

export default function ItemList({ products, addToCart }) {
  return (
    <div className="w-full md:w-2/3 p-2 md:p-4 overflow-y-auto">

      <h2 className="text-lg font-bold mb-2 text-black">
        Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        {products.map((item) => (
          <button
            key={item.id}
            onClick={() => addToCart(item)}
            className="
              bg-white 
              rounded-2xl 
              shadow 
              p-4 
              min-h-[100px]
              flex flex-col justify-center
              active:scale-95
            "
          >
            <p className="font-bold text-black text-base">
              {item.name}
            </p>

            <p className="text-lg text-black">
              ₹{item.price}
            </p>
          </button>
        ))}

      </div>
    </div>
  );
}