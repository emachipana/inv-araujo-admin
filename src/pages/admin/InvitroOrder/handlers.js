import toast from "react-hot-toast";
import apiFetch from "../../../services/apiFetch";

export const handleClick = (order, navigate, setInvoiceModal) => {
  if(order.invoice) return navigate(`/comprobantes/${order.invoice.id}`);

  setInvoiceModal(invoiceModal => !invoiceModal);
}

export const updateOrder = async (orderBody, type, setOrder, order) => {
  const body = {
    ...order,
    ...orderBody,
    clientId: order.client?.id,
    invoiceId: order.invoice ? order.invoice.id : null,
    imageId: order.evidence ? order.evidence.id : null,
    employeeId: order.employee ? order.employee.id : null,
  }

  const updatedOrder = await apiFetch(`${type}/${order.id}`, { method: "PUT", body });
  setOrder(updatedOrder.data);
}

export const onLocationClick = async (order, type, setOrder, setIsLoading) => {
  if(order.status === "ENTREGADO") return toast.error("No puedes marcar el pedido en almacén si este ya se entrego");
  setIsLoading(true);

  try {
    const orderBody = {
      location: order.location === "AGENCIA" ? "ALMACEN" : "AGENCIA",
    }

    await updateOrder(orderBody, type, setOrder, order);
    setIsLoading(false);
  }catch(error) {
    toast.error(error.message);
    setIsLoading(false);
  }
}

export const onStatusClick = async (order, type, setOrder, setIsLoading) => {
  setIsLoading(true);

  try {
    const orderBody = {
      status: order.status === "ENTREGADO" ? "PENDIENTE" : "ENTREGADO",
    }

    await updateOrder(orderBody, type, setOrder, order);
    setIsLoading(false);
  }catch(error) {
    toast.error(error.message);
    setIsLoading(false);
  }
}
