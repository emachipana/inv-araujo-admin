import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, shadowSm, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Badge from "../../../components/Badge";
import { capitalize } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt, FaFileInvoice } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import { PiPlantFill } from "react-icons/pi";
import ItemModal from "./ItemModal";
import NewCategory from "../../../components/Category/New";
import { FaMoneyBillWheat } from "react-icons/fa6";
import AdvancesModal from "./AdvancesModal";
import Item from "./Item";
import InvoiceModal from "../../../components/InvoiceModal";
import { handleClick } from "./handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function InvitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [item, setItem] = useState("");
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const { deleteVitro, loadTubers, matcher, updateVitro } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.vitroOrders && !matcher.tubers) {
          setIsLoading(true);
          await loadTubers();
          setIsLoading(false);
        }

        const order = await apiFetch(`vitroOrders/${id}`);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [id, loadTubers, matcher.tubers, matcher.vitroOrders]);

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
              <NewCategory
                Icon={FaMoneyBillWheat}
                style={{boxShadow: shadowSm, marginTop: "-0.5rem"}}
                onClick={() => setAdvanceModal(!advanceModal)}
              >
                Adelantos
              </NewCategory>
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
                        Variedades
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.items ? order.items.length : 0 }
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
                    <Button
                      Icon={FaFileInvoice}
                      fontSize={15}
                      iconSize={17}
                      color={order.invoice ? "primary" : "secondary"}
                      onClick={() => handleClick(order, navigate, setInvoiceModal)}
                      disabled={order.items.length <= 0}
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
                      Variedades
                    </Text>
                    <FlexColumn 
                      width="100%"
                      align="center"
                      gap={1}
                    >
                      {
                        order.items?.map((item, index) => (
                          <Item 
                            key={index}
                            handleEdit={handleEdit}
                            item={item}
                            orderStatus={order.status}
                            setVitro={setOrder}
                            vitroId={id}
                            isInvoiceGenerated={order.invoice?.isGenerated}
                          />
                        ))
                      }
                      {
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
              />
              <AdvancesModal 
                isActive={advanceModal}
                setIsActive={setAdvanceModal}
                advances={order.advances}
                setVitroOrder={setOrder}
                vitroId={order.id}
                currentAdvance={order.totalAdvance}
                total={order.total}
              />
              <InvoiceModal 
                address={`${order.city}, ${order.department}`}
                document={order.client.document}
                documentType={order.client.documentType}
                isActive={invoiceModal}
                rsocial={order.client.rsocial}
                setIsActive={setInvoiceModal}
                items={order.items.map(item => ({ name: item.variety.name, price: item.price, quantity: item.quantity }))}
                order={order}
                updateOrder={updateVitro}
              />
            </>
        }
      </>
  );
}

export default InvitroOrder;
