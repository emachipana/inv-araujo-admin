import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, shadowSm, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import { capitalize } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt, FaFileInvoice } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import { PiPlantFill, PiWarehouseFill } from "react-icons/pi";
import ItemModal from "./ItemModal";
import NewCategory from "../../../components/Category/New";
import { FaMoneyBillWheat, FaFileCircleCheck, FaEye, FaCheck } from "react-icons/fa6";
import AdvancesModal from "./AdvancesModal";
import Item from "./Item";
import InvoiceModal from "../../../components/InvoiceModal";
import { handleClick } from "./handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import OrderStateModal from "./OrderStateModal";
import { MdLocalShipping } from "react-icons/md";
import EvidenceModal from "../Order/EvidenceModal";
import { useAuth } from "../../../context/auth";
import ShippingModal from "../Order/ShippingModal";

function InvitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [shippingTypeModal, setShippingTypeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [evidenceModal, setEvidenceModal] = useState(false);
  const [item, setItem] = useState("");
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [advances, setAdvances] = useState([]);
  const { id } = useParams();
  const { deleteVitro, loadVitroOrders } = useAdmin();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userPermissions = user.role.permissions;

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadVitroOrders();
        setIsLoading(true);
        const order = await apiFetch(`vitroOrders/${id}`);
        const items = await apiFetch(`orderVarieties/vitroOrder/${order.data.id}`);
        if(userPermissions.includes("INVITRO_ADVANCE_WATCH")) {
          const advances = await apiFetch(`advances/vitroOrder/${order.data.id}`);
          setAdvances(advances);
        }
        setOrderItems(items);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id, loadVitroOrders, userPermissions ]);

  const options = {
    day: "numeric",
    weekday: "long",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }

  const handleEdit = (item) => {
    setItemModal(true);
    setItem(item);
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.initDate
          ? <Title>El pedido invitro no existe</Title>
          : <>
              <FlexRow
                width="100%"
                justify="space-between"
              >
                <Title capitalize>{ order.client.rsocial.toLowerCase() }</Title>
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
                  order.total > 0
                  &&
                  <NewCategory
                    Icon={FaMoneyBillWheat}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setAdvanceModal(!advanceModal)}
                  >
                    Adelantos
                  </NewCategory>
                }
                {
                  (order.total > 0 && order.totalAdvance > 0)
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
                  order.shippingType
                  &&
                  <NewCategory
                    Icon={order.shippingType === "ENVIO_AGENCIA" ? MdLocalShipping : PiWarehouseFill}
                    style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                    onClick={() => setShippingTypeModal(!shippingTypeModal)}
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
                        Entrega
                      </Text>
                      <Badge color={order.shippingType === "ENVIO_AGENCIA" ? "warning" : "primary"}>
                        {
                          !order.shippingType
                          ? "Por definir"
                          : order.shippingType === "ENVIO_AGENCIA" ? "Envío agencia" : "Recojo almacén" 
                        }
                      </Badge>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Estado
                      </Text>
                      <Badge color={
                        (order.isReady && order.status !== "ENTREGADO" && order.location !== "AGENCIA")
                          ? "blue"
                          : order.status === "PENDIENTE" ? "warning" : (order.status === "ENTREGADO" ? "primary" : "danger")
                      }>
                        {
                          (order.isReady && order.status !== "ENTREGADO" && order.location !== "AGENCIA")
                          ? "TERMINADO"
                          : order.status === "PENDIENTE" && order.totalAdvance > 0
                            ? "EN PRODUCCIÓN"
                            : order.status
                        }
                      </Badge>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Total
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { order.total }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Adelanto
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { order.totalAdvance }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Pendiente
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        S/. { order.pending }
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
                  </Wrapper>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Fecha de inicio
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { capitalize(new Date(order.initDate).toLocaleDateString("es-ES", options)) }
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
                        { 
                          !order.finishDate
                          ? "Por asignar"
                          : capitalize(new Date(order.finishDate).toLocaleDateString("es-ES", options))
                        }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper 
                    isButtons
                    justify="space-around"
                  >
                    {
                      (order.totalAdvance === order.total && order.total > 0 && order.isReady)
                      &&
                      <Button
                        Icon={FaFileInvoice}
                        fontSize={14}
                        iconSize={16}
                        color={order?.invoice ? "primary" : "secondary"}
                        onClick={() => handleClick(order, navigate, setInvoiceModal)}
                        disabled={orderItems.length <= 0}
                      >
                        {
                          order?.invoice 
                          ? `Ver ${order?.invoice.invoiceType.toLowerCase()}`
                          : "Comprobante"
                        }
                      </Button>
                    }
                    {
                      order.createdBy === "ADMINISTRADOR"
                      &&
                      <Button
                        Icon={FaEdit}
                        fontSize={14}
                        iconSize={16}
                        color="warning"
                        onClick={() => navigate(`/clientes/${order.client.id}/edit`)}
                      >
                        Editar datos de cliente
                      </Button>
                    }
                    {
                      (order.total <= 0 && order.totalAdvance <= 0)
                      &&
                      <Button
                        onClick={() => setDeleteModal(!deleteModal)}
                        Icon={FaTrashAlt}
                        fontSize={14}
                        iconSize={16}
                        color="danger"
                        disabled={order.status === "ENTREGADO" || order?.invoice?.isGenerated}
                      >
                        Eliminar pedido
                      </Button>
                    }
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                    <FlexRow
                      width="100%"
                      justify="space-between"
                    >
                      <Text
                        weight={700}
                        size={18}
                      >
                        Variedades
                      </Text>
                      {
                        orderItems.length > 0
                        &&
                        <Text
                          weight={600}
                          size={15}
                          color={COLORS.dim}
                        >
                          { orderItems.reduce((acc, cur) => acc + cur.quantity, 0) } plántulas
                        </Text>
                      }
                    </FlexRow>
                    <FlexColumn 
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        orderItems.length <= 0
                        ? <Text
                            weight={600}
                            size={15}
                            color={COLORS.dim}
                          >
                            Aún no tienes nada registrado
                          </Text>
                        : orderItems.map((item, index) => (
                            <Item 
                              key={index}
                              handleEdit={handleEdit}
                              item={item}
                              isAbleToEdit={order.createdBy === "ADMINISTRADOR" && !order.isReady && order.totalAdvance <= 0}
                              setVitro={setOrder}
                              vitroId={id}
                              setOrderItems={setOrderItems}
                            />
                          ))
                      }
                      {
                        userPermissions.includes("INVITRO_ITEM_CREATE")
                        &&
                        (
                          (order.createdBy === "ADMINISTRADOR" && !order.isReady && order.totalAdvance <= 0)
                          &&
                          <Button
                            style={{marginTop: "1rem"}}
                            fontSize={16}
                            iconSize={18}
                            Icon={PiPlantFill}
                            onClick={() => setItemModal(!itemModal)}
                          >
                            Agregar variedad
                          </Button>
                        )
                      }
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
              <DeleteModal 
                handleDelete={deleteVitro}
                id={order.id}
                isActive={deleteModal}
                navTo="invitro"
                setIsActive={setDeleteModal}
                title="¿Eliminar pedido invitro?"
              />
              <ItemModal 
                isActive={itemModal}
                setIsActive={setItemModal}
                vitroOrder={order}
                item={item}
                setItem={setItem}
                setVitroOrder={setOrder}
                orderItems={orderItems}
                setOrderItems={setOrderItems}
              />
              <AdvancesModal 
                isActive={advanceModal}
                setIsActive={setAdvanceModal}
                advances={advances}
                setVitroOrder={setOrder}
                vitroId={order.id}
                currentAdvance={order.totalAdvance}
                total={order.total}
                setAdvances={setAdvances}
                createdBy={order.createdBy}
              />
              <InvoiceModal 
                clientId={order.client.id}
                orderId={order.id}
                isActive={invoiceModal}
                setIsActive={setInvoiceModal}
                invoiceDetail={order?.client?.invoiceDetail || {}}
                isAbleToEdit={order.createdBy === "ADMINISTRADOR"}
                type="invitro"
              />
              <OrderStateModal 
                isActive={stateModal}
                setIsActive={setStateModal}
                order={order}
                setOrder={setOrder}
              />
              <EvidenceModal 
                order={order}
                isActive={evidenceModal}
                setIsActive={setEvidenceModal}
              />
              {
                order.shippingType
                &&
                <ShippingModal 
                  isActive={shippingTypeModal}
                  setIsActive={setShippingTypeModal}
                  order={order}
                  setOrder={setOrder}
                  type="vitro"
                />
              }
            </>
        }
      </>
  );
}

export default InvitroOrder;
