"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  ShoppingCart,
  Package,
  History,
  BarChart3,
  Settings,
} from "lucide-react";

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
import Dashboard from "@/components/Dashboard";

export default function Page() {
  const { bills, saveBill } = useBills();
  const { store, createStore, loading, deleteStore, updateStore } = useStore();

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditStore, setShowEditStore] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [currentBill, setCurrentBill] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mode") || "POS";
    }
    return "POS";
  });

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  if (loading || prodLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!store) {
    return <StoreSetup createStore={createStore} />;
  }

  // ✅ COUPON
  const applyCoupon = (code) => {
    setCoupon(code);

    if (code === "SAVE10") setCouponDiscount(total * 0.1);
    else if (code === "FLAT50") setCouponDiscount(50);
    else if (code === "UPI5") setCouponDiscount(total * 0.05);
    else setCouponDiscount(0);
  };

  const finalTotal = total - discount - couponDiscount;

  // ✅ CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart empty");

    if (paymentMethod === "UPI" && !store.upiId) {
      return alert("Add UPI ID first");
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
      upiId: store.upiId,
    };

    setCurrentBill(billData);
    saveBill(billData);
    setShowInvoice(true);
  };

  const openInvoice = (bill) => {
    setCurrentBill(bill);
    setShowInvoice(true);
  };

  // 🎯 MENU ITEMS
  const menuItems = [
    { key: "DASHBOARD", label: "Dashboard", icon: <BarChart3 size={18} /> },
    { key: "POS", label: "POS", icon: <ShoppingCart size={18} /> },
    { key: "PRODUCTS", label: "Manage", icon: <Package size={18} /> },
    { key: "HISTORY", label: "History", icon: <History size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="bg-black text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>

          <span className="font-bold">{store.name}</span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-2">
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => setMode(item.key)}>
              {item.label}
            </button>
          ))}

          <button
            onClick={() => setShowEditStore(true)}
            className="bg-yellow-500 px-3 py-1 rounded text-black"
          >
            UPI
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Reset
          </button>

          <InstallButton />
          <UpdatePopup />
        </div>
      </div>

      {/* 🔥 MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[250px] bg-white text-black z-50 p-4 shadow-lg"
            >
              <h2 className="font-bold mb-4">{store.name}</h2>

              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setMode(item.key);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full p-3 hover:bg-gray-100 rounded"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => setShowEditStore(true)}
                className="mt-4 w-full bg-yellow-500 p-2 rounded"
              >
                Edit UPI
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-2 w-full bg-red-600 text-white p-2 rounded"
              >
                Reset Store
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      {mode === "DASHBOARD" ? (
        <Dashboard bills={bills} />
      ) : mode === "PRODUCTS" ? (
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

          {/* PRODUCTS */}
          <div className="flex-1 overflow-y-auto pb-[120px] md:pb-0">
            <ItemList products={products} addToCart={addToCart} />
          </div>

          {/* DESKTOP CART */}
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

          {/* MOBILE CART */}
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

      {/* MODALS */}
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

      {showDeleteModal && (
        <DeleteStoreModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await deleteStore();
            setShowDeleteModal(false);
          }}
        />
      )}

      {/* INVOICE */}
      {showInvoice && currentBill && (
        <InvoiceModal
          bill={currentBill}
          storeName={store.name}
          onClose={() => {
            setShowInvoice(false);
            setCurrentBill(null);
            clearCart();
          }}
        />
      )}
    </div>
  );
}