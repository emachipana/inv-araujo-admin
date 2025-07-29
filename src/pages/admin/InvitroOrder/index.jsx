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
import { PiPlantFill } from "react-icons/pi";
import ItemModal from "./ItemModal";
import NewCategory from "../../../components/Category/New";
import { FaMoneyBillWheat, FaFileCircleCheck } from "react-icons/fa6";
import AdvancesModal from "./AdvancesModal";
import Item from "./Item";
import InvoiceModal from "../../../components/InvoiceModal";
import { handleClick } from "./handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import OrderStateModal from "./OrderStateModal";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import EvidenceModal from "../Order/EvidenceModal";
import { useAuth } from "../../../context/auth";

function InvitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
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
  const { deleteVitro, loadVitroOrders, updateVitro } = useAdmin();
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
          !order.city
          ? <Title>El pedido invitro no existe</Title>
          : <>
              <Title capitalize>{ order.client.rsocial.toLowerCase() }</Title>
              {
                (userPermissions.includes("INVITRO_ADVANCE_WATCH") || userPermissions.includes("INVITRO_UPDATE"))
                &&
                <FlexRow>
                  {
                    userPermissions.includes("INVITRO_ADVANCE_WATCH")
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
                    userPermissions.includes("INVITRO_UPDATE")
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
              }
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
                        Destino
                      </Text>
                      <Text
                        align="start"
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{textTransform: "capitalize"}}
                      >
                        { `${order.city}, ${order.department}` }
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
                        Entrega
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.shippingType === "ENVIO_AGENCIA" ? "Traslado a agencia" : "Recojo en almacén" }
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
                  <Wrapper isButtons>
                    {
                      (userPermissions.includes("INVOICES_WATCH") || userPermissions.includes("INVOICES_CREATE"))
                      &&
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
                    }
                    {
                      userPermissions.includes("INVITRO_UPDATE")
                      &&
                      <Button
                        Icon={FaEdit}
                        fontSize={15}
                        iconSize={18}
                        color="warning"
                        onClick={() => navigate("edit")}
                      >
                        Editar
                      </Button>
                    }
                    {
                      userPermissions.includes("INVITRO_DELETE")
                      &&
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
                    }
                  </Wrapper>
                </Card>
                <Card>
                  <FlexColumn>
                    <Text
                      weight={700}
                      size={18}
                    >
                      Variedades
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
                            orderStatus={order.status}
                            setVitro={setOrder}
                            vitroId={id}
                            isInvoiceGenerated={order.invoice?.isGenerated}
                            setOrderItems={setOrderItems}
                          />
                        ))
                      }
                      {
                        userPermissions.includes("INVITRO_ITEM_CREATE")
                        &&
                        (
                          (order.status === "PENDIENTE" && !order.invoice?.isGenerated)
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
              />
              <InvoiceModal 
                address={`${order.city}, ${order.department}`}
                document={order.client.document}
                documentType={order.client.documentType}
                isActive={invoiceModal}
                rsocial={order.client.rsocial}
                setIsActive={setInvoiceModal}
                items={orderItems.map(item => ({ name: item.variety.name, price: item.price, quantity: item.quantity }))}
                order={order}
                updateOrder={updateVitro}
              />
              <OrderStateModal 
                isActive={stateModal}
                setIsActive={setStateModal}
                order={order}
                setOrder={setOrder}
              />
              <EvidenceModal 
                employee={order.employee}
                evidence={order.evidence}
                isActive={evidenceModal}
                setIsActive={setEvidenceModal}
              />
            </>
        }
      </>
  );
}

export default InvitroOrder;
