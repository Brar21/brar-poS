"use client";

import useStore from "../hooks/useStore";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import useBills from "../hooks/useBills";
import StoreSetup from "../components/StoreSetup";
import ProductManager from "../components/ProductManager";
import ItemList from "../components/ItemList";
import Cart from "../components/Cart";
import InvoiceModal from "../components/InvoiceModal";
import { useState } from "react";
import BillHistory from "../components/BillHistory";

import { useEffect } from "react";
export default function Page() {
  const { bills,saveBill } = useBills();

useEffect(() => {
  console.log("BILLS STATE:", bills);
}, [bills]);
  const [currentBill, setCurrentBill] = useState(null);
  const { store, createStore, loading } = useStore();
  const {
    products,
    loading: prodLoading,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const {
    cart,
    addToCart,
    updateQty,
    removeItem,clearCart,
    total,
  } = useCart();

  const [mode, setMode] = useState("POS"); // POS / PRODUCTS
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [showInvoice, setShowInvoice] = useState(false);
  if (loading || prodLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!store) {
    return <StoreSetup createStore={createStore} />;
  }
  const applyCoupon = (code) => {
    setCoupon(code);

    if (code === "SAVE10") {
      setCouponDiscount(total * 0.1);
    } else if (code === "FLAT50") {
      setCouponDiscount(50);
    } else if (code === "UPI5") {
      setCouponDiscount(total * 0.05);
    } else {
      alert("Invalid coupon");
      setCouponDiscount(0);
    }
  };
  const finalTotal = total - discount - couponDiscount;
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
  
    const billData = {
      id: Date.now(),
      items: [...cart], // ✅ COPY cart
      total,
      discount,
      coupon,
      couponDiscount,
      finalTotal,
      paymentMethod,
      date: new Date().toLocaleString(),
    };
  
    // ✅ SAVE BILL DATA
    setCurrentBill(billData);
  
    // ✅ SAVE TO STORAGE
    saveBill(billData);
  
    // ✅ OPEN INVOICE
    setShowInvoice(true);
  
    // ❗ DO NOT CLEAR HERE
  };
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="bg-black text-white p-3 flex justify-between">
        <span>{store.name}</span>

        <div className="flex gap-2">

<button onClick={() => setMode("POS")}>POS</button>
<button onClick={() => setMode("PRODUCTS")}>Manage</button>
<button onClick={() => setMode("HISTORY")}>History</button>

</div>
      </div>

  {/* SWITCH */}
{mode === "PRODUCTS" ? (
  <ProductManager
    products={products}
    addProduct={addProduct}
    updateProduct={updateProduct}
    deleteProduct={deleteProduct}
  />
) : mode === "HISTORY" ? (
  <BillHistory bills={bills} />
) : (
  <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
    <ItemList products={products} addToCart={addToCart} />

    <Cart
      cart={cart}
      updateQty={updateQty}
      removeItem={removeItem}
      total={total}
      discount={discount}
      setDiscount={setDiscount}
      coupon={coupon}
      setCoupon={setCoupon}
      applyCoupon={applyCoupon}
      couponDiscount={couponDiscount}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      finalTotal={finalTotal}
      checkout={handleCheckout}
    />
  </div>
)}
      {showInvoice && (
       <InvoiceModal
       bill={currentBill}
       storeName={store.name}
       onClose={() => {
         setShowInvoice(false);
         clearCart();
       }}
     />
      )}
    </div>
  );
}