"use client";

import { useState, useEffect } from "react";
import useStore from "../hooks/useStore";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import useBills from "../hooks/useBills";
import DeleteStoreModal from "../components/DeleteStoreModal";
import StoreSetup from "../components/StoreSetup";
import ProductManager from "../components/ProductManager";
import ItemList from "../components/ItemList";
import Cart from "../components/Cart";
import InvoiceModal from "../components/InvoiceModal";
import BillHistory from "../components/BillHistory";
import EditStoreModal from "../components/EditStoreModal";
import CartSheet from "../components/CartSheet";
import InstallButton from "@/components/installButton";
import UpdatePopup from "@/components/UpdatePopup";
export default function Page() {
  const { bills, saveBill } = useBills();
  const { store, createStore, loading, deleteStore, updateStore } = useStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditStore, setShowEditStore] = useState(false);
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
    removeItem,
    clearCart,
    total,
  } = useCart();

  const [mode, setMode] = useState("POS");
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [currentBill, setCurrentBill] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  useEffect(() => {
    if (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
      !localStorage.getItem("iosHintShown")
    ) {
      setShowIOSHint(true);
      localStorage.setItem("iosHintShown", "true");
    }
  }, []);
  useEffect(() => {
    console.log("BILLS STATE:", bills);
  }, [bills]);

  if (loading || prodLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!store) {
    return <StoreSetup createStore={createStore} />;
  }

  // ✅ COUPON
  const applyCoupon = (code) => {
    setCoupon(code);

    if (code === "No-Discount") {
      setCouponDiscount(total * 0);
    } else if (code === "SAVE10") {
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
  
  // ✅ CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (paymentMethod === "UPI" && !store.upiId) {
      alert("Please add UPI ID in store setup");
      return;
    }

    const billData = {
      id: Date.now(),
      items: [...cart],
      total,
      discount,
      coupon,
      couponDiscount,
      finalTotal,
      paymentMethod,
      date: new Date().toLocaleString(),
      upiId: store.upiId, // 💥 IMPORTANT
    };

    setCurrentBill(billData);
    saveBill(billData);
    setShowInvoice(true);
  };

  // ✅ OPEN OLD BILL FROM HISTORY
  const openInvoice = (bill) => {
    setCurrentBill(bill);
    setShowInvoice(true);
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
          <button
            onClick={() => setShowEditStore(true)}
            className="bg-yellow-500 px-3 py-1 rounded text-black"
          >
            Edit UPI
          </button>
          {showEditStore && (
            <EditStoreModal
              store={store}
              onClose={() => setShowEditStore(false)}
              onSave={(newUpi) => {
                updateStore({ upiId: newUpi });
                setShowEditStore(false);
              }}
            />
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 px-3 py-1 rounded text-white"
          >
            Reset
          </button>
          {showDeleteModal && (
            <DeleteStoreModal
              onClose={() => setShowDeleteModal(false)}
              onConfirm={async () => {
                await deleteStore();
                setShowDeleteModal(false);
              }}
            />
          )}
          {/* iOS Install Hint */}
          {showIOSHint && (
  <div className="bg-yellow-200 text-black p-2 text-center text-sm">
    Tap Share → Add to Home Screen
  </div>
)}
          <InstallButton />
          <UpdatePopup />
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
        <BillHistory bills={bills} openInvoice={openInvoice} />
      ) : (
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT - PRODUCTS */}
          <div className="flex-1 overflow-y-auto pb-[120px] md:pb-0">
            <ItemList products={products} addToCart={addToCart} />
          </div>

          {/* RIGHT - DESKTOP CART */}
          <div className="hidden md:block w-[350px] border-l bg-white">
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

          {/* MOBILE CART ONLY */}
          <CartSheet>
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
          </CartSheet>

        </div>
      )}

      {/* INVOICE */}
      {showInvoice && currentBill && (
        <InvoiceModal
          bill={currentBill}
          storeName={store.name}
          onClose={() => {
            setShowInvoice(false);
            setCurrentBill(null);
            clearCart(); // ✅ safe (only affects POS)
          }}
        />
      )}
    </div>
  );
}