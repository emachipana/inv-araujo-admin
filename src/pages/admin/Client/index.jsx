import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { toast } from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { capitalizeAll } from "../../../helpers/capitalize";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { OrderCard } from "./styles";
import Button from "../../../components/Button";
import { PiPlantFill } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { useModal } from "../../../context/modal";

function Client() {
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState({});
  const [totalOrders, setTotalOrders] = useState({orders: 0, vitroOrders: 0});
  const { setVitroModal, setOrdersModal } = useModal();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const client = await apiFetch(`clients/${id}`);
        const orders = await apiFetch(`clients/${id}/totalOrders`);
        setClient(client.data);
        setTotalOrders(orders.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  const onRedirect = (redirectTo) => {
    if (redirectTo === "orders") {
      setOrdersModal(true);
      navigate(`/pedidos`);
    }else if (redirectTo === "vitro") {
      setVitroModal(true);
      navigate(`/invitro`);
    }
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !client.id
          ? <Title>El cliente no existe</Title>
          : <>
              <Title>{ capitalizeAll(client.rsocial.toLowerCase()) }</Title>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        { client.documentType }
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { client.document }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Correo
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { client.email }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Teléfono
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { client.phone || "Sin teléfono" }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Creado
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { client.createdBy === "ADMINISTRADOR" ? "Desde el panel" : "Desde la tienda" }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  {
                    client.createdBy === "ADMINISTRADOR"
                    &&
                    <Wrapper 
                      isButtons
                      justify="center"
                    >
                      <Button
                        fontSize={14}
                        iconSize={15}
                        color="warning"
                        Icon={FaEdit}
                        onClick={() => navigate(`/clientes/${client.id}/edit`)}
                      >
                        Editar datos del cliente
                      </Button>
                    </Wrapper>
                  }
                </Card>
                <Card position="first">
                  <FlexRow
                    width="100%"
                    justify="space-between"
                  >
                    <Text
                      weight={700}
                    >
                      Consumo total
                    </Text>
                    <Text
                      weight={600}
                      color={COLORS.blue}
                    >
                      S/. { client.consumption.toFixed(2) }
                    </Text>
                  </FlexRow>
                  <FlexRow
                    width="100%"
                    justify="space-between"
                  >
                    <Text
                      weight={700}
                    >
                      Pedidos
                    </Text>
                    <OrderCard
                      color={COLORS.blue}
                    >
                      <Text
                        weight={600}
                        color={COLORS.white}
                      >
                        { totalOrders.orders }
                      </Text>
                    </OrderCard>
                  </FlexRow>
                  <FlexRow
                    width="100%"
                    justify="space-between"
                  >
                    <Text
                      weight={700}
                    >
                      Pedidos invitro
                    </Text>
                    <OrderCard
                      color={COLORS.persian}
                    >
                      <Text
                        weight={600}
                        color={COLORS.white}
                      >
                        { totalOrders.vitroOrders }
                      </Text>
                    </OrderCard>
                  </FlexRow>
                  <Wrapper isButtons>
                    <Button
                      fontSize={14}
                      iconSize={15}
                      color="primary"
                      Icon={PiPlantFill}
                      onClick={() => onRedirect("vitro")}
                    >
                      Nuevo pedido invitro
                    </Button>
                    <Button
                      fontSize={14}
                      iconSize={15}
                      color="blue"
                      Icon={FaBasketShopping}
                      onClick={() => onRedirect("orders")}
                    >
                      Nuevo pedido
                    </Button>
                  </Wrapper>
                </Card>
              </Section>
            </>
        }
      </>
  );
}

export default Client;
