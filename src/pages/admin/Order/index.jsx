import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, shadowSm, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import { capitalize } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaFileInvoice, FaTrashAlt, FaShoppingCart, FaCheck } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import ItemModal from "./ItemModal";
import Item from "./Item";
import { handleClick } from "../InvitroOrder/handlers";
import InvoiceModal from "../../../components/InvoiceModal";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import NewCategory from "../../../components/Category/New";
import { FaEye, FaFileCircleCheck } from "react-icons/fa6";
import OrderStateModal from "./OrderStateModal";
import { MdCancel, MdLocalShipping, MdLooksOne } from "react-icons/md";
import EvidenceModal from "./EvidenceModal";
import { CancelWrapper, Point } from "./styles";
import { PiWarehouseFill } from "react-icons/pi";

function Order() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [itemModal, setItemModal] = useState(false);
  const [evidenceModal, setEvidenceModal] = useState(false);
  const [item, setItem] = useState(null);
  const [order, setOrder] = useState({});
  const { deleteOrder, setOrder: setOrderSecond } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const order = await apiFetch(`orders/${id}`);
        const items = await apiFetch(`orderProducts/order/${order.data.id}`);
        const cancelRequests = await apiFetch(`cancel-order/order/${order.data.id}`);
        const pendingRequest = cancelRequests.find(req => req.accepted === false && req.rejected === false);
        setCancelRequests(cancelRequests);
        setPendingRequest(!!pendingRequest);
        setOrder(order.data);
        console.log(order.data);
        setOrderItems(items);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  const handleEdit = async (item) => {
    setItem(item);
    setItemModal(true);
  }

  const options = {
    day: "numeric",
    weekday: "short",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }

  const updateOrder = async (id, body) => {
    const updatedOrder = await apiFetch(`orders/${id}`, { body, method: "PUT" });
    setOrderSecond(id, updatedOrder.data);
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.client
          ? <Title>El pedido no existe</Title>
          : <>
              <FlexRow
                width="100%"
                justify="space-between"
              >
                <Title capitalize>{ order.client.rsocial.toLowerCase().replaceAll('"', "") }</Title>
                <Button
                  Icon={FaEye}
                  fontSize={14}
                  iconSize={16}
                  color="secondary"
                  onClick={() => navigate(`/clientes/${order.client.id}`)}
                >
                  Ver detalles del cliente
                </Button>
              </FlexRow>
              <FlexRow>
                {
                  !pendingRequest
                  &&
                  <NewCategory
                    Icon={FaFileCircleCheck}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setStateModal(!stateModal)}
                  >
                    Estado
                  </NewCategory>
                }
                {
                  !pendingRequest
                  &&
                  <NewCategory
                    Icon={order.shippingType === "ENVIO_AGENCIA" ? MdLocalShipping : PiWarehouseFill}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setStateModal(!stateModal)}
                  >
                    Datos de { order.shippingType === "ENVIO_AGENCIA" ? "envío" : "recojo" }
                  </NewCategory>
                }
                {
                  order.evidence
                  &&
                  <NewCategory
                    Icon={FaCheck}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setEvidenceModal(!evidenceModal)}
                  >
                    Evidencia de { order.shippingType === "ENVIO_AGENCIA" ? "envío" : "recojo" }
                  </NewCategory>
                }
                {
                  cancelRequests.length > 0
                  &&
                  <CancelWrapper>
                    <NewCategory
                      Icon={pendingRequest ? MdLooksOne : MdCancel}
                      style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                      onClick={() => setStateModal(!stateModal)}
                    >
                      Solicitudes de cancelación
                    </NewCategory>
                    {
                      pendingRequest
                      &&
                      <Point />
                    }
                  </CancelWrapper>
                }
              </FlexRow>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        { order.client.documentType }
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.client.document }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Teléfono
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.client.phone || "Sin teléfono" }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Total
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{whiteSpace: "nowrap"}}
                      >
                        S/. { order.total?.toFixed(2) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Estado
                      </Text>
                      <Badge color={
                        order.status === "PENDIENTE" ? "warning" : (order.status === "ENTREGADO" ? "primary" : (order.status === "ENVIADO" ? "purple" : "danger"))
                      }>
                        { order.status }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Fecha de pedido
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { capitalize(new Date(order.date).toLocaleDateString("es-ES", options)) }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Origen de pedido
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.createdBy === "CLIENTE" ? "Desde la web" : "Desde el panel" }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Entrega
                      </Text>
                      <Badge color={order.shippingType === "ENVIO_AGENCIA" ? "warning" : "primary"}>
                        { order.shippingType === "ENVIO_AGENCIA" ? "Envío agencia" : "Recojo almacén" }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper 
                    isButtons
                    justify="space-around"
                  >
                    {
                      order.status !== "CANCELADO"
                      &&
                      <Button
                        Icon={FaFileInvoice}
                        fontSize={14}
                        iconSize={16}
                        color={order.invoice ? "primary" : "secondary"}
                        onClick={() => handleClick(order, navigate, setInvoiceModal)}
                        disabled={orderItems.length <= 0}
                      >
                        {
                          order.invoice 
                          ? `Ver ${order.invoice?.invoiceType?.toLowerCase()}`
                          : "Comprobante"
                        }
                      </Button>
                    }
                    {
                      order.status === "PENDIENTE"
                      &&
                      <Button
                        Icon={FaEdit}
                        fontSize={14}
                        iconSize={16}
                        color="warning"
                        onClick={() => navigate("edit")}
                      >
                        Editar pedido
                      </Button>
                    }
                    {
                      ((order.status === "PENDIENTE" && order.createdBy !== "CLIENTE") || order.status === "CANCELADO")
                      &&
                      <Button
                        onClick={() => setDeleteModal(!deleteModal)}
                        Icon={FaTrashAlt}
                        fontSize={14}
                        iconSize={16}
                        color="danger"
                        disabled={order.status === "ENTREGADO" || order.invoice?.isGenerated}
                      >
                        Eliminar pedido
                      </Button>
                    }
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                    <Text
                      weight={700}
                      size={18}
                    >
                      Productos
                    </Text>
                    <FlexColumn 
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        orderItems.map((item, index) => (
                          <Item
                            key={index}
                            handleEdit={handleEdit}
                            item={item}
                            orderId={id}
                            orderStatus={order.status}
                            setOrder={setOrder}
                            isInvoiceGenerated={order.invoice?.isGenerated}
                            setOrderItems={setOrderItems}
                          />
                        ))
                      }
                      {
                        (order.status === "PENDIENTE" && !order.invoice?.isGenerated )
                        &&
                        <Button
                          style={{marginTop: "1rem"}}
                          fontSize={16}
                          iconSize={18}
                          Icon={FaShoppingCart}
                          onClick={() => setItemModal(!itemModal)}
                        >
                          Agregar producto
                        </Button>
                      }
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
              {
                itemModal
                &&
                <ItemModal 
                  isActive={itemModal}
                  setIsActive={setItemModal}
                  item={item}
                  setItem={setItem}
                  order={order}
                  setOrder={setOrder}
                  isToEdit={!!item}
                  orderItems={orderItems}
                  setOrderItems={setOrderItems}
                />
              }
              <DeleteModal
                handleDelete={deleteOrder}
                id={order.id}
                isActive={deleteModal}
                navTo="pedidos"
                setIsActive={setDeleteModal}
                title="¿Eliminar pedido?"
              />
              <InvoiceModal 
                address={`${order.city}, ${order.department}`}
                document={order.client.document}
                documentType={order.client.documentType}
                isActive={invoiceModal}
                order={order}
                rsocial={order.client.rsocial}
                setIsActive={setInvoiceModal}
                updateOrder={updateOrder}
                items={orderItems.map(item => ({ name: item.product.name, price: item.price, quantity: item.quantity }))}
              />
              <OrderStateModal 
                isActive={stateModal}
                order={order}
                setIsActive={setStateModal}
                setOrder={setOrder}
                products={orderItems}
              />
              {
                order.evidence
                &&
                <EvidenceModal 
                  isActive={evidenceModal}
                  setIsActive={setEvidenceModal}
                  order={order}
                />
              }
            </>
        }
      </>
  );
}

export default Order;
