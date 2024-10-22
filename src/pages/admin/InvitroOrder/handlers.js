export const handleClick = (order, navigate, setInvoiceModal) => {
  if(order.invoice) return navigate(`/admin/comprobantes/${order.invoice.id}`);

  setInvoiceModal(invoiceModal => !invoiceModal);
}
