export const handleClick = (order, navigate, setInvoiceModal) => {
  if(order.invoice) return navigate(`/comprobantes/${order.invoice.id}`);

  setInvoiceModal(invoiceModal => !invoiceModal);
}

export const updateStatus = async (order, updateOrder, setIsLoading, setError, navigate, navTo, invoice) => {
  try {
    let body = {
      ...order,
      clientId: order.client.id,
      status: "PENDIENTE",
      invoiceId: invoice ? invoice.id : null 
    }
  
    if(order.status === "PENDIENTE") body = {...body, status: "ENTREGADO"};
  
    setIsLoading(true);
    await updateOrder(order.id, body);
    setIsLoading(false);
    navigate(`/${navTo}/${order.id}`);
  }catch(error) {
    console.error(error);
    setError(error.message);
    setIsLoading(false);
  }
}
