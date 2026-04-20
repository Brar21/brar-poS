export function getNextInvoiceNo() {
    const last = localStorage.getItem("invoice_counter");
  
    let next = last ? parseInt(last, 10) + 1 : 1;
  
    localStorage.setItem("invoice_counter", next);
  
    return formatInvoiceNo(next);
  }
  
  function formatInvoiceNo(num) {
    return `INV-${String(num).padStart(4, "0")}`;
  }