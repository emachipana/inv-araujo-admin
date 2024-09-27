import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import AlertError from "../../../components/AlertError";
import Badge from "../../../components/Badge";
import { capitalize } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt, FaFileInvoice } from "react-icons/fa";
import DeleteModal from "../Product/DeleteModal";
import { Variety } from "./styles";
import { PiPlantFill } from "react-icons/pi";
import ItemModal from "./ItemModal";

function InvitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [item, setItem] = useState("");
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const { error, setError, deleteVitro, deleteItem } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const order = await apiFetch(`vitroOrders/${id}`);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [id, setError]);

  const options = {
    day: "numeric",
    weekday: "long",
    month: "short",
    year: "numeric"
  }

  const handleEdit = (item) => {
    setItemModal(true);
    setItem(item);
  }

  const handleDelete = async (itemId) => {
    try {
      const updatedVitroOrder = await deleteItem(itemId, id);
      setOrder(updatedVitroOrder);
    }catch(error) {
      console.error(error);
      setError(error.message);
    }
  } 

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.destination
          ? <Title>El pedido invitro no existe</Title>
          : <>
              <Title capitalize>{ `${order.firstName.toLowerCase()} ${order.lastName?.toLowerCase()}` }</Title>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        { order.documentType }
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { order.document }
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
                        { order.phone }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text weight={700}>
                        Destino
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                        style={{textTransform: "capitalize"}}
                      >
                        { order.destination }
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
                        S/. { order.advance }
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
                        { capitalize(new Date(order.finishDate).toLocaleDateString("es-ES", options)) }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper isButtons>
                    <Button
                      Icon={FaFileInvoice}
                      fontSize={15}
                      iconSize={17}
                      color="secondary"
                    >
                      Generar factura
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
                          <Variety key={index}>
                            <Wrapper>
                              <FlexColumn gap={0.1}>
                                <Text 
                                  weight={700}
                                  size={15}
                                >
                                  Variedad
                                </Text>
                                <Text
                                  weight={600}
                                  size={14}
                                  color={COLORS.dim}
                                >
                                  { item.variety.name }
                                </Text>
                              </FlexColumn>
                              <FlexColumn gap={0.1}>
                                <Text 
                                  weight={700}
                                  size={15}
                                >
                                  Precio
                                </Text>
                                <Text
                                  weight={600}
                                  size={14}
                                  color={COLORS.dim}
                                >
                                  S/. { item.price }
                                </Text>
                              </FlexColumn>
                              <FlexColumn gap={0.1}>
                                <Text 
                                  weight={700}
                                  size={15}
                                >
                                  Cantidad
                                </Text>
                                <Text
                                  weight={600}
                                  size={14}
                                  color={COLORS.dim}
                                >
                                  { item.quantity }
                                </Text>
                              </FlexColumn>
                              <FlexColumn gap={0.1}>
                                <Text 
                                  weight={700}
                                  size={15}
                                >
                                  Subtotal
                                </Text>
                                <Text
                                  weight={600}
                                  size={14}
                                  color={COLORS.dim}
                                >
                                  S/. { item.subTotal }
                                </Text>
                              </FlexColumn>
                            </Wrapper>
                            <FlexRow gap={1}>
                              <Button
                                style={{padding: "0.3rem 0.6rem"}}
                                iconSize={15}
                                fontSize={14}
                                Icon={FaEdit}
                                color="warning"
                                onClick={() => handleEdit(item)}
                              >
                                Editar
                              </Button>
                              <Button
                                style={{padding: "0.3rem 0.6rem"}}
                                iconSize={14}
                                fontSize={14}
                                Icon={FaTrashAlt}
                                color="danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Eliminar
                              </Button>
                            </FlexRow>
                          </Variety>
                        ))
                      }
                      <Button
                        style={{marginTop: "1rem"}}
                        fontSize={16}
                        iconSize={18}
                        Icon={PiPlantFill}
                        onClick={() => setItemModal(!itemModal)}
                      >
                        Agregar variedad
                      </Button>
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
            </>
        }
        {
          error
          &&
          <AlertError 
            error={error}
            setError={setError}
          />
        }
      </>
  );
}

export default InvitroOrder;
