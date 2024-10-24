export const handleClick = (order, navigate, setInvoiceModal) => {
  if(order.invoice) return navigate(`/admin/comprobantes/${order.invoice.id}`);

  setInvoiceModal(invoiceModal => !invoiceModal);
}

export const updateStatus = async (order, updateOrder, setIsLoading, setError, navigate, navTo) => {
  try {
    let body = {
      ...order,
      clientId: order.client.id,
      status: "PENDIENTE"
    }
  
    if(order.status === "PENDIENTE") body = {...body, status: "ENTREGADO"};
  
    setIsLoading(true);
    await updateOrder(order.id, body);
    setIsLoading(false);
    navigate(`/admin/${navTo}/${order.id}`);
  }catch(error) {
    console.error(error);
    setError(error.message);
    setIsLoading(false);
  }
}
