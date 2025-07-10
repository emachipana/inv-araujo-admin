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
import { FaEdit, FaFileInvoice, FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import ItemModal from "./ItemModal";
import Item from "./Item";
import { handleClick } from "../InvitroOrder/handlers";
import InvoiceModal from "../../../components/InvoiceModal";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import NewCategory from "../../../components/Category/New";
import { FaFileCircleCheck } from "react-icons/fa6";
import OrderStateModal from "./OrderStateModal";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import EvidenceModal from "./EvidenceModal";

function Order() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
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
        setOrder(order.data);
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
    weekday: "long",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }

  const date = new Date();
  date.setHours(12);
  const maxShipDate = new Date(order.maxShipDate);
  const days = Math.ceil((maxShipDate - date) / (24 * 60 * 60 * 1000));

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
              <Title capitalize>{ order.client.rsocial.toLowerCase().replaceAll('"', "") }</Title>
              <FlexRow>
                <NewCategory
                  Icon={FaFileCircleCheck}
                  style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                  onClick={() => setStateModal(!stateModal)}
                >
                  Estado
                </NewCategory>
                {
                  (order.employee || order.evidence)
                  &&
                  <NewCategory
                    Icon={MdPhotoSizeSelectActual}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setEvidenceModal(!evidenceModal)}
                  >
                    Evidencia
                  </NewCategory>
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
                        { order.client.phone }
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
                        order.status === "PENDIENTE" ? "warning" : (order.status === "ENTREGADO" ? "primary" : "danger")
                      }>
                        { order.status }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Destino
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{textTransform: "capitalize", whiteSpace: "nowrap"}}
                      >
                        { `${order.city}, ${order.department}` }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Correo
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.client.email }
                      </Text>
                    </FlexColumn>
                    {
                      order.status !== "ENTREGADO"
                      &&
                      <FlexColumn gap={0.3}>
                        <Text weight={700}>
                          Plazo
                        </Text>
                        <Text
                          weight={600}
                          size={15}
                          color={COLORS.dim}
                        >
                          { days === 0 ? "Entrega hoy" : (days < 0 ? "Vencido" : days) }
                          {" "}
                          { days < 1 ? "" : (days === 1 ? "día" : "días") }
                        </Text>
                      </FlexColumn>
                    }
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Entrega
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{whiteSpace: "nowrap"}}
                      >
                        { order.shippingType === "ENVIO_AGENCIA" ? "Traslado a agencia" : "Recojo en almacén" }
                      </Text>
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
                        Fecha de entrega
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { capitalize(maxShipDate.toLocaleDateString("es-ES", options)) }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper isButtons>
                   <Button
                      Icon={FaFileInvoice}
                      fontSize={15}
                      iconSize={17}
                      color={order.invoice ? "primary" : "secondary"}
                      onClick={() => handleClick(order, navigate, setInvoiceModal)}
                      disabled={orderItems.length <= 0}
                    >
                      {
                        order.invoice 
                        ? "Ver comprobante"
                        : "Comprobante"
                      }
                    </Button>
                    <Button
                      Icon={FaEdit}
                      fontSize={15}
                      iconSize={18}
                      color="warning"
                      onClick={() => navigate("edit")}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => setDeleteModal(!deleteModal)}
                      Icon={FaTrashAlt}
                      fontSize={15}
                      iconSize={16}
                      color="danger"
                      disabled={order.status === "ENTREGADO" || order.invoice?.isGenerated}
                    >
                      Eliminar
                    </Button>
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
              />
              <EvidenceModal 
                isActive={evidenceModal}
                setIsActive={setEvidenceModal}
                employee={order.employee}
                evidence={order.evidence}
              />
            </>
        }
      </>
  );
}

export default Order;
